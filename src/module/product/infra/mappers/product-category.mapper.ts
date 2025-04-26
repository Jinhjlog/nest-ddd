import { ProductCategory } from '@prisma/client';
import { ProductCategory as ProductCategoryDomain } from '../../domain/models';

export class ProductCategoryMapper {
  static toDomain({
    id,
    productId,
    name,
    description,
  }: ProductCategory): ProductCategoryDomain {
    return new ProductCategoryDomain({
      id,
      productId,
      name,
      description: description || undefined,
    });
  }

  static toPersistence({
    id,
    props: { productId, name, description },
  }: ProductCategoryDomain): ProductCategory {
    return {
      id: id.toString(),
      productId,
      name,
      description: description || null,
    };
  }
}
