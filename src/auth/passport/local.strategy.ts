import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from 'generated/prisma';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'address' });
  }

  async validate(address: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(address, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
