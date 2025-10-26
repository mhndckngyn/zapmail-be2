import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { prisma } from 'src/lib/db';
import { LoginDto, SignUpDto, UserDto } from './auth.types';
import { EnvSchema } from 'src/lib/env';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService<EnvSchema>) {}

  async signUp({ address, name, password }: SignUpDto): Promise<boolean> {
    try {
      const hashed = await argon2.hash(password);

      const externalResponse = await fetch(
        'https://zapmail.io.vn/api/mail-create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.configService.get('API_KEY'),
          },
          body: JSON.stringify({ name, address, password }),
        },
      );

      if (!externalResponse.ok) {
        console.error(externalResponse.status, await externalResponse.text());
        return false;
      }

      await prisma.user.create({
        data: {
          name,
          address,
          password: hashed,
        },
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async login({ address, password }: LoginDto): Promise<string | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { address },
      });
      if (!user) return null;

      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) return null;

      const token = jwt.sign(
        { id: user.id, address: user.address },
        this.configService.get('JWT_SECRET'),
        { expiresIn: '7d' },
      );

      return token;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getMe(token: string): Promise<UserDto | null> {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET ?? 'default-secret',
      ) as {
        id: string;
        address: string;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, address: true },
      });

      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
