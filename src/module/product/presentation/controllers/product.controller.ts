import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProductUseCase } from '../../application/usecases/create-product.usecase';
import { CreateProductRequestDto, ProductResponseDto } from '../dtos';

@ApiTags('상품')
@Controller('products')
export class ProductController {
  constructor(private readonly createProductUseCase: CreateProductUseCase) {}

  @Post()
  @ApiOperation({
    summary: '상품 생성',
    description: '새로운 상품을 생성합니다.',
  })
  @ApiCreatedResponse({
    description: '상품이 성공적으로 생성되었습니다.',
    type: ProductResponseDto,
  })
  async createProduct(
    @Body() dto: CreateProductRequestDto,
  ): Promise<ProductResponseDto> {
    const result = await this.createProductUseCase.execute(dto);

    return result.match(
      (productResult) => {
        return productResult;
      },
      (error) => {
        throw new BadRequestException(error);
      },
    );
  }
}
