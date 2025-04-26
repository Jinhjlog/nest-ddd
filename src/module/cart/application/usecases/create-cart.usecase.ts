import { Injectable } from '@nestjs/common';
import { CartRepository } from '../../domain/repositories/cart.repository';
import { Cart } from '../../domain/models';
import { UniqueEntityId } from '@lib/domain';

@Injectable()
export class CreateCartUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  async execute(customerId: UniqueEntityId): Promise<void> {
    const cart = new Cart({
      customerId: customerId.toString(),
      items: [],
    });

    await this.cartRepository.save(cart);
  }
}
