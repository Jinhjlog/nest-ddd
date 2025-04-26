import { Module } from '@nestjs/common';
import { CartController } from './presentation/controllers/cart.controller';
import { CreateCartUseCase } from './application/usecases/create-cart.usecase';
import { CartRepository } from './domain/repositories/cart.repository';
import { CartRepositoryImpl } from './infra/repositories/cart.repository.impl';
import { ProductRefRepository } from './domain/repositories/product-ref.repository';
import { ProductRefRepositoryImpl } from './infra/repositories/product-ref.repository.impl';
import { CartEventHandler } from './application/handlers/cart-event.handler';

@Module({
  controllers: [CartController],
  providers: [
    CartEventHandler,
    CreateCartUseCase,
    {
      provide: CartRepository,
      useClass: CartRepositoryImpl,
    },
    {
      provide: ProductRefRepository,
      useClass: ProductRefRepositoryImpl,
    },
  ],
})
export class CartModule {}
