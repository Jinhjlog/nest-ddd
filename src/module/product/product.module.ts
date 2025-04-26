import { Module } from '@nestjs/common';
import { ProductController } from './presentation/controllers/product.controller';
import { CreateProductUseCase } from './application/usecases/create-product.usecase';
import { ProductRepository } from './domain/repositories/product.repository';
import { ProductRepositoryImpl } from './infra/repositories/product.repository.impl';

@Module({
  controllers: [ProductController],
  providers: [
    CreateProductUseCase,
    {
      provide: ProductRepository,
      useClass: ProductRepositoryImpl,
    },
  ],
})
export class ProductModule {}
