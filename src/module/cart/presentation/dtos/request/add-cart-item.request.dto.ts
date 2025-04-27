import { ApiProperty } from '@nestjs/swagger';

export class AddCartItemRequestDto {
  @ApiProperty({
    description: '상품 ID',
    example: '01HRPT0GJ8V7QHS3XS4RFJMPP8',
  })
  productId: string;

  @ApiProperty({
    description: '상품 수량',
    example: 1,
  })
  quantity: number;
}
