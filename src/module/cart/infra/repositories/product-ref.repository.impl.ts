import { PrismaService } from 'src/module/core/database/prisma.service';
import { ProductReference } from '../../domain/models';
import { ProductRefRepository } from '../../domain/repositories/product-ref.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductRefRepositoryImpl implements ProductRefRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ProductReference | null> {
    const productRef = await this.prisma.product.findUnique({
      where: { id },
      select: {
        name: true,
        price: true,
      },
    });

    if (!productRef) {
      return null;
    }

    return {
      id,
      name: productRef.name,
      price: productRef.price,
    };
  }
}
