import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { validateConfig } from './lib/env';

@Module({
  imports: [
    ConfigModule.forRoot({ validate: validateConfig, isGlobal: true }),
    AuthModule,
  ],
})
export class AppModule {}
