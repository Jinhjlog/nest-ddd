import { CustomerAddress } from '@prisma/client';
import { CustomerAddress as CustomerAddressDomain } from '../../domain/models';

export class CustomerAddressMapper {
  static toDomain(address: CustomerAddress): CustomerAddressDomain {
    return new CustomerAddressDomain({
      id: address.id,
      customerId: address.customerId,
      address: address.address,
    });
  }

  static toPersistence({
    id,
    props: { customerId, address },
  }: CustomerAddressDomain): CustomerAddress {
    return {
      id: id.toString(),
      customerId,
      address,
    };
  }
}
