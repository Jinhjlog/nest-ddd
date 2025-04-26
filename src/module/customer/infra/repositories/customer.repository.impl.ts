import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { PrismaService } from 'src/module/core/database/prisma.service';
import { Customer, Email } from '../../domain/models';
import { CustomerAddressMapper, CustomerMapper } from '../mappers';
import { DomainEvents } from '@lib/domain/events/DomainEvents';

@Injectable()
export class CustomerRepositoryImpl implements CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(customer: Customer): Promise<void> {
    const customerData = CustomerMapper.toPersistence(customer);

    await this.prisma.$transaction(async (tx) => {
      await tx.customer.upsert({
        where: { id: customerData.id },
        create: customerData,
        update: customerData,
      });

      const currentAddressIds = customer.props.addresses.map((address) =>
        address.id.toString(),
      );

      await tx.customerAddress.deleteMany({
        where: {
          customerId: customerData.id,
          id: { notIn: currentAddressIds },
        },
      });

      if (customer.props.addresses.length > 0) {
        await Promise.all(
          customer.props.addresses.map((address) => {
            const addressData = CustomerAddressMapper.toPersistence(address);

            return tx.customerAddress.upsert({
              where: { id: addressData.id },
              create: addressData,
              update: addressData,
            });
          }),
        );
      }
    });

    DomainEvents.dispatchEventsForAggregate(customer.id);
  }

  async existsEmail(email: Email): Promise<boolean> {
    const customer = await this.prisma.customer.findUnique({
      where: { email: email.props.value },
    });

    return !!customer;
  }
}
