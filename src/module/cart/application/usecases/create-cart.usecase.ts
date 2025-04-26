import { Injectable } from '@nestjs/common';
import { CartRepository } from '../../domain/repositories/cart.repository';
import { Cart, CartItem, Quantity, QuantityError } from '../../domain/models';
import { CartDto, CreateCartDto } from '../dtos';
import { err, ok, Result } from 'neverthrow';
import { ProductRefRepository } from '../../domain/repositories/product-ref.repository';

const NotFoundProduct = '장바구니에 추가하려는 상품을 찾을 수 없습니다.';

type CreateCartError =
  | (typeof QuantityError)[keyof typeof QuantityError]
  | typeof NotFoundProduct;

@Injectable()
export class CreateCartUseCase {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRefRepository: ProductRefRepository,
  ) {}

  async execute(dto: CreateCartDto): Promise<Result<CartDto, CreateCartError>> {
    let cart: Cart;

    // 기존에 장바구니가 존재하는지 확인
    const existingCart = await this.cartRepository.findByCustomerId(
      dto.customerId,
    );

    if (existingCart) {
      cart = existingCart;
    } else {
      cart = new Cart({
        customerId: dto.customerId,
        items: [],
      });
    }

    // 장바구니 항목 생성
    for (const itemDto of dto.items) {
      const quantityOrError = Quantity.create(itemDto.quantity);

      if (quantityOrError.isErr()) {
        return err(quantityOrError.error);
      }

      const productRef = await this.productRefRepository.findById(
        itemDto.productId,
      );

      if (!productRef) {
        return err(NotFoundProduct);
      }

      const cartItem = new CartItem({
        cartId: cart.id.toString(),
        quantity: quantityOrError.value,
        product: {
          id: productRef.id,
          name: productRef.name,
          price: productRef.price,
        },
      });

      cart.addItem(cartItem);
    }

    // 장바구니 저장
    await this.cartRepository.save(cart);

    // 결과 DTO 생성
    return ok({
      id: cart.id.toString(),
      customerId: cart.props.customerId,
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
