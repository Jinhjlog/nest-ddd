import { Injectable } from '@nestjs/common';
import { CartRepository } from '../../domain/repositories/cart.repository';
import { CartDto } from '../dtos';
import { err, ok, Result } from 'neverthrow';
import { ProductRefRepository } from '../../domain/repositories/product-ref.repository';

const NotFoundCartError = '장바구니를 찾을 수 없습니다.';

type GetCartError = typeof NotFoundCartError;

@Injectable()
export class GetCartUseCase {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRefrepository: ProductRefRepository,
  ) {}

  async execute(customerId: string): Promise<Result<CartDto, GetCartError>> {
    const cart = await this.cartRepository.findByCustomerId(customerId);

    if (!cart) {
      return err(NotFoundCartError);
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
