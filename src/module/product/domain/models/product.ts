import { AggregateRoot, UniqueEntityId } from '@lib/domain';
import { ProductCategory } from './product-category';

export class ProductProps {
  id?: string;
  name: string;
  price: number;
  categories: ProductCategory[];
}

export class Product extends AggregateRoot<ProductProps> {
  constructor(props: ProductProps) {
    super(props, new UniqueEntityId(props.id));
  }

  addBulkCategory(categories: ProductCategory[]): void {
    this.props.categories.push(...categories);
  }
}
