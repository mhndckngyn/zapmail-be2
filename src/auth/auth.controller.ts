import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { SignUpDto } from './auth.types';
import { LocalAuthGuard } from './local-auth.guard';
import type { Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiResponse } from 'src/lib/response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignUpDto) {
    await this.authService.signUp(body);
    return {
      success: true,
      message: 'auth:signup.success',
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  login(@Req() req: Request) {
    // xem giải thích trong file src/auth/passport/local.strategy.ts
    const access_token = this.authService.login(req.user);
    const response: ApiResponse = {
      success: true,
      message: 'auth:login.success',
      content: { access_token },
      statusCode: 200,
    };

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    const response: ApiResponse = {
      success: true,
      message: 'auth:getme.success',
      content: req.user,
      statusCode: 200,
    };

    return response;
  }
}
