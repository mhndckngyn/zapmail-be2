import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { EnvSchema } from 'src/lib/env';
import { UsersService } from 'src/users/users.service';
import { SignUpDto, UserDto, LoginDto } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService<EnvSchema>,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp({ address, name, password }: SignUpDto) {
    const externalResponse = await fetch(
      'https://zapmail.io.vn/api/mail-create',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.configService.get('API_KEY'),
        },
        body: JSON.stringify({ name, address, password }),
      },
    );

    if (!externalResponse.ok) {
      const text = await externalResponse.text();
      throw new HttpException('user.create-failed', 500, { cause: text });
    }

    await this.userService.createUser({ address, name, password });
  }

  // [Passport]
  login(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const payload = { sub: user.id, address: user.address };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getMe(token: string) {
    try {
      const decoded = jwt.verify(
        token,
        this.configService.get('JWT_SECRET'),
      ) as {
        id: string;
        address: string;
      };

      const user = (await this.userService.findById(decoded.id)) as UserDto;
      return user;
    } catch {
      throw new UnauthorizedException();
    }
  }

  // [Passport] Validate user
  async validateUser(address: string, password: string) {
    const user = (await this.userService.findByAddress(address)) as LoginDto;
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!user || !isPasswordValid) {
      return null;
    }

    return user;
  }
}
