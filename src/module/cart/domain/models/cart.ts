import { AggregateRoot, UniqueEntityId } from '@lib/domain';
import { CartItem } from './cart-item';

export interface CartProps {
  id?: string;
  customerId: string;
  items: CartItem[];
}

export class Cart extends AggregateRoot<CartProps> {
  constructor(props: CartProps) {
    super(props, new UniqueEntityId(props.id));
  }

  addItem(item: CartItem): void {
    // 이미 같은 상품이 있는지 확인
    const existingItemIndex = this.props.items.findIndex(
      (i) => i.props.product.id === item.props.product.id,
    );

    if (existingItemIndex > -1) {
      const existingItem = this.props.items[existingItemIndex];
      const newQuantity = existingItem.props.quantity.plus(item.props.quantity);

      // 새로운 수량으로 기존 항목 업데이트
      existingItem.updateQuantity(newQuantity);
      existingItem.updateProduct(item.props.product);
    } else {
      // 새로운 항목 추가
      this.props.items.push(item);
    }
  }

  removeItem(productId: string): void {
    this.props.items = this.props.items.filter(
      (item) => item.props.product.id !== productId,
    );
  }

  // 장바구니에 있는 특정 상품 찾기
  findItem(productId: string): CartItem | undefined {
    return this.props.items.find((item) => item.props.product.id === productId);
  }
}
