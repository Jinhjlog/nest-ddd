import { Module } from '@nestjs/common';
import { modules } from './index';

@Module({
  imports: [...modules],
})
export class AppModule {}
