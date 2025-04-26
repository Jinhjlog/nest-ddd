import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common';
import {
  CreateCustomerUseCase,
  EmailAlreadyExistsError,
} from '../../application/usecases/create-customer.usecase';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { CreateCustomerRequestDto } from '../dtos/request/create-customer.request.dto';
import { CustomerResponseDto } from '../dtos/response/customer.response.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly createCustomerUseCase: CreateCustomerUseCase) {}

  @ApiOperation({
    summary: 'Customer 생성',
    description: 'Customer를 생성합니다.',
  })
  @ApiCreatedResponse({
    description: 'Customer 생성 성공',
    type: CustomerResponseDto,
  })
  @Post()
  async createCustomer(
    @Body() dto: CreateCustomerRequestDto,
  ): Promise<CustomerResponseDto> {
    const result = await this.createCustomerUseCase.execute(dto);

    return result.match(
      // 성공 케이스
      (customerResult) => {
        return customerResult;
      },
      // 에러 케이스
      (error) => {
        switch (error) {
          case EmailAlreadyExistsError:
            throw new ConflictException(error);
          default:
            throw new BadRequestException(error);
        }
      },
    );
  }
}
