import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/module/core/auth/auth.service';

@Injectable()
export class LoginUseCase {
  constructor(private readonly authService: AuthService) {}

  execute() {}
}
