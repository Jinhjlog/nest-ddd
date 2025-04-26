import { Customer } from '@prisma/client';
import {
  CustomerAddress as CustomerAddressDomain,
  Customer as CustomerDomain,
  Email,
} from '../../domain/models';

export class CustomerMapper {
  static toDomain(
    { id, name, email }: Customer,
    addresses: CustomerAddressDomain[],
  ): CustomerDomain {
    return new CustomerDomain({
      id,
      name,
      email: Email.unsafeCreate(email),
      addresses,
    });
  }

  static toPersistence({
    id,
    props: { name, email },
  }: CustomerDomain): Customer {
    return {
      id: id.toString(),
      name,
      email: email.props.value,
    };
  }
}
