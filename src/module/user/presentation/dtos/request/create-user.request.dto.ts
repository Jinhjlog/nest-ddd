import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequestDto {
  @ApiProperty({
    description: '사용자 아이디',
    example: 'user123',
    required: true,
  })
  username: string;

  @ApiProperty({
    description: '사용자 비밀번호',
    example: 'password!123',
    required: true,
  })
  password: string;

  @ApiProperty({
    description: '사용자 전화번호',
    example: '010-1234-5678',
    required: true,
  })
  phone: string;

  @ApiProperty({
    description: '사용자 이메일',
    example: 'test@example.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
    required: true,
  })
  realname: string;
}
