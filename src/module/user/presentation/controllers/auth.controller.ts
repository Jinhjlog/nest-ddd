import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() dto: any): Promise<void> {
    throw new Error('Method not implemented.');
  }

  @Post('logout')
  logout(@Body() dto: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
