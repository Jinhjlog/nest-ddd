import { CartItem } from '@prisma/client';
import { CartItem as CartItemDomain, Quantity } from '../../domain/models';

export class CartItemMapper {
  static toDomain(cartItem: CartItem): CartItemDomain {
    return new CartItemDomain({
      id: cartItem.id,
      cartId: cartItem.cartId,
      quantity: Quantity.unsafeCreate(cartItem.quantity),
      product: {
        id: cartItem.productId,
        name: 'unknown',
        price: 0,
      },
    });
  }

  static toPersistence({
    id,
    props: { cartId, quantity, product },
  }: CartItemDomain): CartItem {
    return {
      id: id.toString(),
      cartId,
      quantity: quantity.props.value,
      productId: product.id,
    };
  }
}
