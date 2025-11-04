import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { SignUpDto } from 'src/auth/auth.types';
import { PrismaService } from 'src/lib/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByAddress(address: string) {
    return await this.prisma.user.findUnique({
      where: { address },
    });
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async createUser({ address, name, password }: SignUpDto) {
    const hashed = await argon2.hash(password);
    await this.prisma.user.create({
      data: {
        name,
        address,
        password: hashed,
      },
    });
  }
}
