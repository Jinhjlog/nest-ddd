import { ApiProperty } from '@nestjs/swagger';

export class CustomerAddressResponseDto {
  @ApiProperty({
    description: '주소 ID',
    example: '01HRPT0GJ8V7QHS3XS4RFJMPP8',
  })
  id: string;

  @ApiProperty({ description: '주소', example: '서울특별시 강남구' })
  address: string;
}

export class CustomerResponseDto {
  @ApiProperty({
    description: '고객 ID',
    example: '01HRPT0GJ8V7QHS3XS4RFJMPP8',
  })
  id: string;

  @ApiProperty({ description: '고객 이름', example: '홍길동' })
  name: string;

  @ApiProperty({ description: '고객 이메일', example: 'test@gmail.com' })
  email: string;

  @ApiProperty({
    type: [CustomerAddressResponseDto],
    description: '고객 주소 목록',
  })
  addresses: CustomerAddressResponseDto[];
}
