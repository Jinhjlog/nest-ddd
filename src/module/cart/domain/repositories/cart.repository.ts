import { Cart } from '../models';

export abstract class CartRepository {
  abstract save(cart: Cart): Promise<void>;
  abstract findById(id: string): Promise<Cart | null>;
  abstract findByCustomerId(customerId: string): Promise<Cart | null>;
}
