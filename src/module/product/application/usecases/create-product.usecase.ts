import { Injectable } from '@nestjs/common';
import {
  Price,
  PriceError,
  Product,
  ProductCategory,
} from '../../domain/models';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { CreateProductDto, ProductDto } from '../dtos';
import { err, ok, Result } from 'neverthrow';

export type CreateProductError = (typeof PriceError)[keyof typeof PriceError];

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(
    dto: CreateProductDto,
  ): Promise<Result<ProductDto, CreateProductError>> {
    const priceOrError = Price.create(dto.price);

    const propsOrError = Result.combine([priceOrError]);

    if (propsOrError.isErr()) {
      return err(propsOrError.error);
    }

    const [price] = propsOrError.value;

    const product = new Product({
      name: dto.name,
      price,
      categories: [],
    });

    const categories = dto.categories.map(
      (category) =>
        new ProductCategory({
          productId: product.id.toString(),
          name: category.name,
          description: category.description,
        }),
    );

    product.addBulkCategory(categories);
    await this.productRepository.save(product);

    return ok({
      id: product.id.toString(),
      name: product.props.name,
      price: product.props.price.props.value,
      categories: product.props.categories.map((category) => ({
        id: category.id.toString(),
        name: category.props.name,
        description: category.props.description,
      })),
    });
  }
}
