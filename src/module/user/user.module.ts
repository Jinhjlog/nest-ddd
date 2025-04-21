import { Module, Provider } from '@nestjs/common';
import { UserController } from './presentation/controllers/user.controller';
import { CreateUserUseCase, LoginUseCase } from './application/usecases';
import { UserRepository } from './domain/repositories';
import { UserRepositoryImpl } from './infra/repositories';
import { AuthController } from './presentation/controllers/auth.controller';

const usecases: Provider[] = [CreateUserUseCase, LoginUseCase];

@Module({
  controllers: [AuthController, UserController],
  providers: [
    ...usecases,
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
  ],
})
export class UserModule {}
