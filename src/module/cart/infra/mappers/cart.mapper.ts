import { Cart } from '@prisma/client';
import {
  Cart as CartDomain,
  CartItem as CartItemDomain,
} from '../../domain/models';

export class CartMapper {
  static toDomain(
    { id, customerId }: Cart,
    cartItems: CartItemDomain[],
  ): CartDomain {
    return new CartDomain({
      id,
      customerId,
      items: cartItems,
    });
  }

  static toPersistence(cart: CartDomain): Cart {
    return {
      id: cart.id.toString(),
      customerId: cart.props.customerId,
    };
  }
}
