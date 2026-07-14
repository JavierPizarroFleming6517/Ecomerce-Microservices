import { Injectable } from '@nestjs/common';
import { type Profile } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface ProfileInput {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
}

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { userId } });
  }

  upsert(userId: string, data: ProfileInput): Promise<Profile> {
    return this.prisma.profile.upsert({
      where: { userId },
      update: data,
      create: { ...data, user: { connect: { id: userId } } },
    });
  }
}
