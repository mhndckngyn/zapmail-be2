import argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import { SignUpDto } from './types';
import { prisma } from 'src/lib/db';

@Injectable()
export class AuthService {
  async signUp({ address, name, password }: SignUpDto): Promise<boolean> {
    const hashed = await argon2.hash(password);

    try {
      await prisma.user.create({
        data: {
          name: name,
          address: address,
          password: hashed,
        },
      });
    } catch {
      return false;
    }

    return true;
  }
}
