import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/lib/prisma.service';

@Module({
  providers: [PrismaService, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
