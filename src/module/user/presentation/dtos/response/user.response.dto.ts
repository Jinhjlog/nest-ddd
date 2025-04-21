import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: '사용자 아이디',
    example: 'user123',
  })
  username: string;

  @ApiProperty({
    description: '사용자 전화번호',
    example: '010-1234-5678',
  })
  phone: string;

  @ApiProperty({
    description: '사용자 이메일',
    example: 'test@example.com',
  })
  email: string;

  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
  })
  realname: string;
}
