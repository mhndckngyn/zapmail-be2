import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { type SignUpDto } from './types';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async signup(@Body() body: SignUpDto) {
    const result = await this.authService.signUp(body);
    if (result === true) {
      return { success: true };
    } else {
      return { success: false };
    }
  }
}
