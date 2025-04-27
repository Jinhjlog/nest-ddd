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

export class CartItemResponseDto {
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
