import { EntityClass, UniqueEntityId } from '@lib/domain';

export interface ProductCategoryProps {
  id?: string;
  productId: string;
  name: string;
  description?: string;
}

export class ProductCategory extends EntityClass<ProductCategoryProps> {
  constructor(props: ProductCategoryProps) {
    super(props, new UniqueEntityId(props.id));
  }
}
