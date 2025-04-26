import { Module } from '@nestjs/common';
import { CustomerController } from './presentation/controllers/customer.controller';
import { CustomerRepository } from './domain/repositories/customer.repository';
import { CustomerRepositoryImpl } from './infra/repositories/customer.repository.impl';
import { CreateCustomerUseCase } from './application/usecases/create-customer.usecase';

@Module({
  controllers: [CustomerController],
  providers: [
    CreateCustomerUseCase,
    {
      provide: CustomerRepository,
      useClass: CustomerRepositoryImpl,
    },
  ],
})
export class CustomerModule {}
