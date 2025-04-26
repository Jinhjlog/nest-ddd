import { Customer, Email } from '../models';

export abstract class CustomerRepository {
  abstract save(customer: Customer): Promise<void>;
  abstract existsEmail(email: Email): Promise<boolean>;
}
