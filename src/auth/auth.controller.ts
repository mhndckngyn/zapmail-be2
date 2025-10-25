import { Body, Controller, Post, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { SignUpDto, LoginDto } from './auth.types';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignUpDto) {
    const result = await this.authService.signUp(body);

    if (result) {
      return {
        success: true,
        message: 'auth:signup.success',
      };
    }

    return {
      success: false,
      message: 'auth:signup.failed',
    };
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const token = await this.authService.login(body);

    if (!token) {
      return {
        success: false,
        message: 'auth:login.wrong-information',
      };
    }

    return {
      success: true,
      message: 'auth:login.success',
      token,
    };
  }

  @Get('me')
  async getMe(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return {
        success: false,
        message: 'auth:token.missing',
      };
    }

    const token = authHeader.replace('Bearer ', '');
    const user = await this.authService.getMe(token);

    if (!user) {
      return {
        success: false,
        message: 'auth:token.invalid-or-expired',
      };
    }

    return {
      success: true,
      message: 'auth:me.success',
      user,
    };
  }
}
