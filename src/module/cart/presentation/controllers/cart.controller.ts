import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('장바구니')
@Controller('carts')
export class CartController {}
