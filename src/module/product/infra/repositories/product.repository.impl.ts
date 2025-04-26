import { PrismaService } from 'src/module/core/database/prisma.service';
import { Product } from '../../domain/models';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { ProductCategoryMapper, ProductMapper } from '../mappers';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(product: Product): Promise<void> {
    const productData = ProductMapper.toPersistence(product);
    await this.prisma.$transaction(async (tx) => {
      await tx.product.upsert({
        where: { id: productData.id },
        create: productData,
        update: productData,
      });

      const currentCategoryIds = product.props.categories.map((category) =>
        category.id.toString(),
      );

      await tx.productCategory.deleteMany({
        where: {
          productId: productData.id,
          id: { notIn: currentCategoryIds },
        },
      });

      if (product.props.categories.length > 0) {
        await Promise.all(
          product.props.categories.map((category) => {
            const categoryData = ProductCategoryMapper.toPersistence(category);

            return tx.productCategory.upsert({
              where: { id: categoryData.id },
              create: categoryData,
              update: categoryData,
            });
          }),
        );
      }
    });
  }
}
