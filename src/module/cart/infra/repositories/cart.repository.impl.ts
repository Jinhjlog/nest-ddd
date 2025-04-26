import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/module/core/database/prisma.service';
import { CartRepository } from '../../domain/repositories/cart.repository';
import { Cart } from '../../domain/models';
import { CartItemMapper, CartMapper } from '../mappers';

@Injectable()
export class CartRepositoryImpl implements CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(cart: Cart): Promise<void> {
    const cartData = CartMapper.toPersistence(cart);

    await this.prisma.$transaction(async (tx) => {
      // 장바구니 저장 (없으면 생성, 있으면 업데이트)
      await tx.cart.upsert({
        where: { id: cartData.id },
        create: cartData,
        update: cartData,
      });

      // 기존 장바구니 항목들의 ID 목록을 가져옴
      const currentItemIds = cart.props.items.map((item) => item.id.toString());

      // 장바구니에서 삭제된 항목들을 DB에서 삭제
      if (currentItemIds.length > 0) {
        await tx.cartItem.deleteMany({
          where: {
            cartId: cartData.id,
            id: { notIn: currentItemIds },
          },
        });
      }

      // 장바구니 항목 저장
      if (cart.props.items.length > 0) {
        await Promise.all(
          cart.props.items.map((item) => {
            const itemData = CartItemMapper.toPersistence(item);
            return tx.cartItem.upsert({
              where: { id: itemData.id },
              create: itemData,
              update: itemData,
            });
          }),
        );
      }
    });
  }

  async findById(id: string): Promise<Cart | null> {
    const cart = await this.prisma.cart.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!cart) {
      return null;
    }

    const cartItems = cart.items.map((item) => CartItemMapper.toDomain(item));

    return CartMapper.toDomain(cart, cartItems);
  }

  async findByCustomerId(customerId: string): Promise<Cart | null> {
    const cart = await this.prisma.cart.findUnique({
      where: { customerId },
      include: { items: true },
    });

    if (!cart) {
      return null;
    }

    const cartItems = cart.items.map((item) => CartItemMapper.toDomain(item));

    return CartMapper.toDomain(cart, cartItems);
  }
}
