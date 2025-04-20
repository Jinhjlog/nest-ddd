import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import environmentConfig from './config/environment.config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [environmentConfig],
      isGlobal: true,
      cache: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    DatabaseModule,
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class CoreModule {}
