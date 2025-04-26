import { EntityClass, UniqueEntityId } from '@lib/domain';

export interface CustomerAddressProps {
  id?: string;
  customerId: string;
  address: string;
}

export class CustomerAddress extends EntityClass<CustomerAddressProps> {
  constructor(props: CustomerAddressProps) {
    super(props, new UniqueEntityId(props.id));
  }
}
