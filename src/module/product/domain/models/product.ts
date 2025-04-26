import { AggregateRoot, UniqueEntityId } from '@lib/domain';
import { ProductCategory } from './product-category';
import { Price } from './price';

export class ProductProps {
  id?: string;
  name: string;
  price: Price;
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
