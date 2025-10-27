import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { SignUpDto } from 'src/auth/auth.types';
import { prisma } from 'src/lib/db';

@Injectable()
export class UsersService {
  async findByAddress(address: string) {
    return await prisma.user.findUnique({
      where: { address },
    });
  }

  async findById(id: string) {
    return await prisma.user.findUnique({ where: { id } });
  }

  async createUser({ address, name, password }: SignUpDto) {
    const hashed = await argon2.hash(password);
    await prisma.user.create({
      data: {
        name,
        address,
        password: hashed,
      },
    });
  }
}
