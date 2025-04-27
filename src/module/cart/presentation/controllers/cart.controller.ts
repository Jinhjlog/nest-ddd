import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartItemResponseDto } from '../dtos/response/cart-item.response.dto';
import { GetCartUseCase } from '../../application/usecases/get-cart.usecase';
import { CartTransformer } from '../transformers/cart.transformer';
import { AddCartItemRequestDto } from '../dtos/request/add-cart-item.request.dto';
import {
  AddCartItemUseCase,
  NotFoundCartError,
  NotFoundProductError,
} from '../../application/usecases/add-cart-item.usecase';

@ApiTags('장바구니')
@Controller('carts')
export class CartController {
  constructor(
    private readonly getCartUseCase: GetCartUseCase,
    private readonly addCartItemUseCase: AddCartItemUseCase,
  ) {}

  @ApiOperation({ summary: '현재 사용자의 장바구니 아이템 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '장바구니 아이템 목록 반환',
    type: [CartItemResponseDto],
  })
  @Get('items')
  async getCartItems(): Promise<CartItemResponseDto[]> {
    // 테스트 용도로 임시 아이디를 사용하여 장바구니 아이템 목록을 조회합니다.
    const tempCustomerId = '01JSS9B63XFK02ACKNCCKS1Y5H';

    const result = await this.getCartUseCase.execute(tempCustomerId);

    return result.match(
      (cartResult) => {
        return CartTransformer.toItemsResponse(cartResult);
      },
      (error) => {
        throw new BadRequestException(error);
      },
    );
  }

  @ApiOperation({ summary: '장바구니에 아이템 추가' })
  @ApiResponse({
    status: 200,
    description: '장바구니에 아이템 추가 성공',
    type: CartItemResponseDto,
  })
  @Post('items')
  async addCartItem(
    @Body() dto: AddCartItemRequestDto,
  ): Promise<CartItemResponseDto[]> {
    const tempCustomerId = '01JSS9B63XFK02ACKNCCKS1Y5H';
    const result = await this.addCartItemUseCase.execute({
      customerId: tempCustomerId,
      ...dto,
    });

    return result.match(
      (cartResult) => {
        return CartTransformer.toItemsResponse(cartResult);
      },
      (error) => {
        switch (error) {
          case NotFoundCartError:
          case NotFoundProductError:
            throw new NotFoundException(error);
          default:
            throw new BadRequestException(error);
        }
      },
    );
  }
}
