import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCartUseCase } from '../../application/usecases/create-cart.usecase';
import { CreateCartRequestDto } from '../dtos/request/create-cart.request.dto';
import { CartResponseDto } from '../dtos/response/cart.response.dto';

@ApiTags('장바구니')
@Controller('carts')
export class CartController {
  constructor(private readonly createCartUseCase: CreateCartUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '장바구니 생성',
    description:
      '새로운 장바구니를 생성하고 상품을 추가합니다. 로그인 상태에서는 고객 ID가 필요하며, 비로그인 상태에서는 생략 가능합니다.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '장바구니 생성 성공',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 입력 값(수량 등)',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '서버 오류',
  })
  async createCart(
    @Body() dto: CreateCartRequestDto,
  ): Promise<CartResponseDto> {
    const result = await this.createCartUseCase.execute(dto);

    return result.match(
      (cartResult) => {
        return cartResult;
      },
      (error) => {
        throw new BadRequestException(error);
      },
    );
  }
}
