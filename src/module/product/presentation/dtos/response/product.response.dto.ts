import { ApiProperty } from '@nestjs/swagger';

export class ProductCategoryResponseDto {
  @ApiProperty({
    description: '카테고리 ID',
    example: '01HRPT0GJ8V7QHS3XS4RFJMPP8',
  })
  id: string;

  @ApiProperty({ description: '카테고리 이름', example: '전자기기' })
  name: string;

  @ApiProperty({
    description: '카테고리 설명',
    example: '모든 전자기기 제품',
    required: false,
  })
  description?: string;
}

export class ProductResponseDto {
  @ApiProperty({
    description: '상품 ID',
    example: '01HRPT0GJ8V7QHS3XS4RFJMPP8',
  })
  id: string;

  @ApiProperty({ description: '상품 이름', example: '스마트폰' })
  name: string;

  @ApiProperty({ description: '상품 가격', example: 1000000 })
  price: number;

  @ApiProperty({
    type: [ProductCategoryResponseDto],
    description: '상품 카테고리 목록',
  })
  categories: ProductCategoryResponseDto[];
}
