import { AggregateRoot, UniqueEntityId } from '@lib/domain';
import { Email } from './email';
import { CustomerAddress } from './customer-address';

export interface CustomerProps {
  id?: string;
  name: string;
  email: Email;
  addresses: CustomerAddress[];
}

export class Customer extends AggregateRoot<CustomerProps> {
  constructor(props: CustomerProps) {
    super(props, new UniqueEntityId(props.id));
  }

  addAddress(address: CustomerAddress): void {
    this.props.addresses.push(address);
  }
}
