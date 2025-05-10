import { Module, Provider } from '@nestjs/common';
import { CreateUserUseCase } from './application/usecases';
import { UserRepository } from './domain/repositories';
import { UserRepositoryImpl } from './infra/repositories';

const usecases: Provider[] = [CreateUserUseCase];

@Module({
  providers: [
    ...usecases,
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
  ],
})
export class UserModule {}
