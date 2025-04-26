import { ProductReference } from '../models';

export abstract class ProductRefRepository {
  abstract findById(id: string): Promise<ProductReference | null>;
}
