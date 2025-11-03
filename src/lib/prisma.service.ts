import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // optional — if you leave it out, Prisma will connect lazily on its first call to the database.
    await this.$connect();
  }
}
