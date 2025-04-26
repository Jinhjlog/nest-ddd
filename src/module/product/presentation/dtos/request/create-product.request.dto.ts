import { ApiProperty } from '@nestjs/swagger';

export class CreateProductCategoryRequestDto {
  @ApiProperty({ description: '카테고리 이름', example: '전자기기' })
  name: string;

  @ApiProperty({
    description: '카테고리 설명',
    example: '모든 전자기기 제품',
    required: false,
  })
  description?: string;
}

export class CreateProductRequestDto {
  @ApiProperty({ description: '상품 이름', example: '스마트폰' })
  name: string;

  @ApiProperty({ description: '상품 가격', example: 1000000 })
  price: number;

  @ApiProperty({
    description: '상품 카테고리 목록',
    type: [CreateProductCategoryRequestDto],
    example: [{ name: '전자기기', description: '모든 전자기기 제품' }],
  })
  categories: CreateProductCategoryRequestDto[];
}
