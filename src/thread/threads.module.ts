import { Module } from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { ThreadsController } from './threads.controller';
import { PrismaService } from 'src/lib/prisma.service';

@Module({
  providers: [ThreadsService, PrismaService],
  controllers: [ThreadsController],
})
export class ThreadsModule {}
