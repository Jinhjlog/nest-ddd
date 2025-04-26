import { Injectable } from '@nestjs/common';
import { Product, ProductCategory } from '../../domain/models';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { CreateProductDto, ProductDto } from '../dtos';

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(dto: CreateProductDto): Promise<ProductDto> {
    const product = new Product({
      name: dto.name,
      price: dto.price,
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

    return {
      id: product.id.toString(),
      name: product.props.name,
      price: product.props.price,
      categories: product.props.categories.map((category) => ({
        id: category.id.toString(),
        name: category.props.name,
        description: category.props.description,
      })),
    };
  }
}
