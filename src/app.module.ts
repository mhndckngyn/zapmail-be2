import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { validateConfig } from './lib/env';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validate: validateConfig, isGlobal: true }),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
