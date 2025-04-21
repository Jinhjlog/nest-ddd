import { AggregateRoot, UniqueEntityId } from '@lib/domain';
import { Username } from './username';
import { Phone } from './phone';
import { Email } from './email';
import { Password } from './password';

export interface UserProps {
  id?: string;
  username: Username;
  password: Password;
  phone: Phone;
  email: Email;
  realname: string;
}

export class User extends AggregateRoot<UserProps> {
  constructor(props: UserProps) {
    super(props, new UniqueEntityId(props.id));
  }
}
