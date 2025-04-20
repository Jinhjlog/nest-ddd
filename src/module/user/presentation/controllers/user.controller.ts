import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common';
import {
  CreateUserUseCase,
  EmailAlreadyExistsError,
  PhoneAlreadyExistsError,
  UsernameAlreadyExistsError,
} from '../../application/usecases';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateUserRequestDto, UserResponseDto } from '../dtos';

@Controller('user')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @ApiOperation({
    summary: 'User 생성',
    description: 'User를 생성합니다.',
  })
  @ApiCreatedResponse({
    type: UserResponseDto,
    description: 'User 생성 성공',
  })
  @ApiBadRequestResponse({
    description: '유효성 검사에 실패한 경우',
  })
  @ApiConflictResponse({
    description: 'username, email, phone이 중복된 경우',
  })
  @Post()
  async create(@Body() dto: CreateUserRequestDto): Promise<UserResponseDto> {
    const result = await this.createUserUseCase.execute(dto);

    return result.match(
      // 성공 케이스
      (userResult) => {
        return userResult;
      },
      // 에러 케이스
      (error) => {
        switch (error) {
          case UsernameAlreadyExistsError:
          case PhoneAlreadyExistsError:
          case EmailAlreadyExistsError:
            throw new ConflictException(error);
          default:
            throw new BadRequestException(error);
        }
      },
    );
  }
}
