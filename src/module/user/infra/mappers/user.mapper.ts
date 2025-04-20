import { User } from '@prisma/client';
import {
  Email,
  Password,
  Phone,
  User as UserDomain,
  Username,
} from '../../domain/models';

export class UserMapper {
  static toDomain(data: User): UserDomain {
    return new UserDomain({
      id: data.id,
      username: Username.unsafeCreate(data.username),
      password: Password.unsafeCreate(data.password),
      phone: Phone.unsafeCreate(data.phone),
      email: Email.unsafeCreate(data.email),
      realname: data.realname,
    });
  }

  static toPersistence(data: UserDomain): User {
    const { username, password, phone, email, realname } = data.props;
    return {
      id: data.id.toString(),
      username: username.props.value,
      password: password.props.value,
      phone: phone.props.value,
      email: email.props.value,
      realname,
    };
  }
}
