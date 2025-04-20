import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RedisAuthService } from './redis-auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentConfig } from '../config/environment.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => {
        const jwtConfig = ConfigService.get<EnvironmentConfig['jwt']>('jwt');

        if (!jwtConfig) {
          throw new Error('JWT 설정이 누락되었습니다.');
        }

        return {
          global: true,
          secret: jwtConfig.secret,
          signOptions: {
            expiresIn: jwtConfig.accessTokenExpiresIn,
          },
        };
      },
    }),
  ],
  providers: [
    {
      provide: AuthService,
      useClass: RedisAuthService,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
