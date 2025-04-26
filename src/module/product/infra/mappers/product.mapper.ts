import { Product } from '@prisma/client';
import {
  ProductCategory as ProductCategoryDomain,
  Product as ProductDomain,
} from '../../domain/models';

export class ProductMapper {
  static toDomain(
    { id, name, price }: Product,
    categories: ProductCategoryDomain[],
  ): ProductDomain {
    return new ProductDomain({
      id,
      name,
      price,
      categories,
    });
  }

  static toPersistence({ id, props: { name, price } }: ProductDomain): Product {
    return {
      id: id.toString(),
      name,
      price,
    };
  }
}
