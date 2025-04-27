import { Injectable } from '@nestjs/common';
import { CartRepository } from '../../domain/repositories/cart.repository';
import { ProductRefRepository } from '../../domain/repositories/product-ref.repository';
import { AddCartItemDto, CartDto } from '../dtos';
import { err, ok, Result } from 'neverthrow';
import { CartItem, Quantity, QuantityError } from '../../domain/models';

export const NotFoundCartError = '장바구니를 찾을 수 없습니다.';
export const NotFoundProductError = '상품을 찾을 수 없습니다.';

type CreateCartError =
  | (typeof QuantityError)[keyof typeof QuantityError]
  | typeof NotFoundCartError
  | typeof NotFoundProductError;

@Injectable()
export class AddCartItemUseCase {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRefrepository: ProductRefRepository,
  ) {}

  async execute(
    dto: AddCartItemDto,
  ): Promise<Result<CartDto, CreateCartError>> {
    const quantityOrError = Quantity.create(dto.quantity);

    if (quantityOrError.isErr()) {
      return err(quantityOrError.error);
    }
    const quantity = quantityOrError.value;

    const cart = await this.cartRepository.findByCustomerId(dto.customerId);

    if (!cart) {
      return err(NotFoundCartError);
    }

    const productRef = await this.productRefrepository.findById(dto.productId);

    if (!productRef) {
      return err(NotFoundProductError);
    }

    for (const item of cart.props.items) {
      const productRef = await this.productRefrepository.findById(
        item.props.product.id,
      );

      if (!productRef) {
        continue;
      }

      item.updateProduct(productRef);
    }

    const cartItem = new CartItem({
      cartId: cart.id.toString(),
      quantity,
      product: {
        id: productRef.id,
        name: productRef.name,
        price: productRef.price,
      },
    });

    cart.addItem(cartItem);

    await this.cartRepository.save(cart);

    return ok({
      id: cart.id.toString(),
      items: cart.props.items.map((item) => ({
        id: item.id.toString(),
        quantity: item.props.quantity.props.value,
        product: {
          id: item.props.product.id,
          name: item.props.product.name,
          price: item.props.product.price,
        },
      })),
    });
  }
}
