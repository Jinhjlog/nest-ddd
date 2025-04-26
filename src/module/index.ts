import { Type } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CoreModule } from './core/core.module';
import { ProductModule } from './product/product.module';
import { CustomerModule } from './customer/customer.module';

export const modules: Type<any>[] = [
  CoreModule,
  UserModule,
  ProductModule,
  CustomerModule,
];
