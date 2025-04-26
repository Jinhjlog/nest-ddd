import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerRequestDto {
  @ApiProperty({
    description: '고객 이름',
    example: '홍길동',
  })
  name: string;

  @ApiProperty({
    description: '고객 이메일',
    example: 'test@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: '고객 주소',
    example: '010-1234-5678',
  })
  address: string;
}
