import { ApiProperty } from '@nestjs/swagger';

class ProductRefResponseDto {
  @ApiProperty({
    description: '상품 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: '상품 이름',
    example: 'Sample Product',
  })
  name: string;

  @ApiProperty({
    description: '상품 가격',
    example: 10000,
  })
  price: number;
}

class CartItemResponseDto {
  @ApiProperty({
    description: '장바구니 항목 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: '상품 수량',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    description: '상품 정보',
    type: ProductRefResponseDto,
  })
  product: ProductRefResponseDto;
}

export class CartResponseDto {
  @ApiProperty({
    description: '장바구니 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: '고객 ID (없으면 비회원 장바구니)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  customerId?: string;

  @ApiProperty({
    description: '장바구니 항목 목록',
    type: [CartItemResponseDto],
  })
  items: CartItemResponseDto[];
}
