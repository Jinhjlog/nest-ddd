import { CartDto } from '../../application/dtos';
import { CartItemResponseDto } from '../dtos/response/cart-item.response.dto';

export class CartTransformer {
  static toItemsResponse(cartDto: CartDto): CartItemResponseDto[] {
    return cartDto.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
      },
    }));
  }
}
