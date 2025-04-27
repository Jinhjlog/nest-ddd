export interface CartItemDto {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

export interface CartDto {
  id: string;
  items: CartItemDto[];
}
