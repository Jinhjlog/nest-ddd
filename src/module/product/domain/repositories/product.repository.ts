import { Product } from '../models';

export abstract class ProductRepository {
  abstract save(product: Product): Promise<void>;
}
