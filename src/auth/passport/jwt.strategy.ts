import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvSchema } from 'src/lib/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService<EnvSchema>) {
    // lấy và kiểm tra lại jwt. nếu hợp lệ, nó gọi hàm validate ở dưới, nếu không hợp lệ thì từ chối truy cập getme (hoặc các route được bảo vệ)
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // nếu file jwt hợp lệ, nó sẽ đưa data đã lưu trong jwt vào hàm này. phần return trong hàm này sẽ được gán vào req.user
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    return { userId: payload.sub, address: payload.address };
  }
}
