import { ApiProperty } from '@nestjs/swagger';

export class CreateCartItemRequestDto {
  @ApiProperty({
    description: '상품 ID',
  })
  productId: string;

  @ApiProperty({
    description: '상품 수량 (1-100)',
    example: 2,
    minimum: 1,
    maximum: 100,
  })
  quantity: number;
}

export class CreateCartRequestDto {
  @ApiProperty({
    description: '고객 ID (없으면 비회원 장바구니)',
  })
  customerId: string;

  @ApiProperty({
    description: '장바구니 항목 목록',
    type: [CreateCartItemRequestDto],
  })
  items: CreateCartItemRequestDto[];
}
