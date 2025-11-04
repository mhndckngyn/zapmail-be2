import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import type { Request } from 'express';
import { ApiResponse } from 'src/lib/response';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './auth.types';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiBody({ type: SignUpDto })
  async signup(@Body() body: SignUpDto) {
    await this.authService.signUp(body);
    return {
      success: true,
      message: 'auth:signup.success',
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
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
