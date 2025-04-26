export interface CreateCartItemDto {
  productId: string;
  quantity: number;
}

export interface CreateCartDto {
  customerId: string;
  items: CreateCartItemDto[];
}
