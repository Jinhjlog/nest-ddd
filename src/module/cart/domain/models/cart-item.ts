import { EntityClass, UniqueEntityId } from '@lib/domain';
import { Quantity } from './quantity';
import { ProductReference } from './product-reperence';

export interface CartItemProps {
  id?: string;
  cartId: string;
  quantity: Quantity;
  product: ProductReference;
}

export class CartItem extends EntityClass<CartItemProps> {
  constructor(props: CartItemProps) {
    super(props, new UniqueEntityId(props.id));
  }

  updateQuantity(quantity: Quantity): void {
    this.props.quantity = quantity;
  }

  updateProduct(product: ProductReference): void {
    this.props.product = product;
  }
}
