import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { LoginDto } from '../auth.types';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'address' });
  }

  // hàm này được GỌI TRƯỚC route login, sau khi hàm này return user thì user sẽ được gán vào req.user. Trong route login ta gọi authService.login(req.user) để tạo jwt
  async validate(address: string, password: string): Promise<LoginDto> {
    const user = await this.authService.validateUser(address, password);
    if (!user) {
      throw new UnauthorizedException('Thông tin đăng nhập không đúng.');
    }
    return user;
  }
}
