import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { validateConfig } from './lib/env';
import { UsersModule } from './users/users.module';
import { ThreadsModule } from './thread/threads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validate: validateConfig, isGlobal: true }),
    AuthModule,
    UsersModule,
    ThreadsModule,
  ],
})
export class AppModule {}
