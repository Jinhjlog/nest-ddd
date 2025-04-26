import { err, ok, Result } from 'neverthrow';
import {
  Customer,
  CustomerAddress,
  Email,
  EmailError,
} from '../../domain/models';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { CreateCustomerDto, CustomerDto } from '../dtos';
import { Injectable } from '@nestjs/common';

export const EmailAlreadyExistsError = '이미 존재하는 email 입니다.';

type CreateCustomerError =
  | (typeof EmailError)[keyof typeof EmailError]
  | typeof EmailAlreadyExistsError;

@Injectable()
export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(
    dto: CreateCustomerDto,
  ): Promise<Result<CustomerDto, CreateCustomerError>> {
    const emailOrError = Email.create(dto.email);

    const propsOrError = Result.combine([emailOrError]);
    if (propsOrError.isErr()) {
      return err(propsOrError.error);
    }

    const [email] = propsOrError.value;

    const emailExists = await this.customerRepository.existsEmail(email);
    if (emailExists) {
      return err(EmailAlreadyExistsError);
    }

    const customer = new Customer({
      name: dto.name,
      email: email,
      addresses: [],
    });

    if (dto.address) {
      const address = new CustomerAddress({
        customerId: customer.id.toString(),
        address: dto.address,
      });

      customer.addAddress(address);
    }

    await this.customerRepository.save(customer);

    return ok({
      id: customer.id.toString(),
      name: customer.props.name,
      email: customer.props.email.props.value,
      addresses: customer.props.addresses.map((address) => ({
        id: address.id.toString(),
        customerId: address.props.customerId,
        address: address.props.address,
      })),
    });
  }
}
