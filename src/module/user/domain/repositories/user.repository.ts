import { Email, Phone, User, Username } from '../models';

export abstract class UserRepository {
  abstract save(user: User): Promise<void>;
  abstract existsUsername(username: Username): Promise<boolean>;
  abstract existsEmail(email: Email): Promise<boolean>;
  abstract existsPhone(phone: Phone): Promise<boolean>;
}
