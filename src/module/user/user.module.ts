import { Module, Provider } from '@nestjs/common';
import { UserController } from './presentation/controllers/user.controller';
import { CreateUserUseCase } from './application/usecases';
import { UserRepository } from './domain/repositories';
import { UserRepositoryImpl } from './infra/repositories';

const usecases: Provider[] = [CreateUserUseCase];

@Module({
  controllers: [UserController],
  providers: [
    ...usecases,
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
  ],
})
export class UserModule {}
