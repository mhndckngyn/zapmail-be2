import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';

@Injectable()
export class ThreadsService {
  constructor(private prisma: PrismaService) {}

  private async authorizeUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  private getTabFilter(tab: string) {
    if (tab === 'inbox') return { inboxStatus: true };
    if (tab === 'sent') return { sentStatus: true };
    if (tab === 'drafts') return { draftStatus: true };
    return {};
  }

  async getThreads({
    userId,
    tab,
    done,
  }: {
    userId: string;
    tab: string;
    done: boolean;
  }) {
    await this.authorizeUser(userId);

    const filter = {
      userId,
      ...this.getTabFilter(tab),
      done: { equals: done },
    };

    return await this.prisma.thread.findMany({
      where: filter,
      include: {
        emails: {
          orderBy: { sentAt: 'asc' },
          select: {
            id: true,
            subject: true,
            sentAt: true,
            from: { select: { name: true, address: true } },
            to: { select: { name: true, address: true } },
            bodySnippet: true,
          },
        },
      },
      take: 15,
      orderBy: { lastMessageDate: 'desc' },
    });
  }
}
