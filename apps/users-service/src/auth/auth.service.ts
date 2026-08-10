import { createHash, randomBytes } from 'node:crypto';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type {
  AuthSessionDto,
  AuthTokensDto,
  UserMeDto,
} from '@retail/contracts';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import type { LoginDto, RegisterDto } from './dto/auth.dto';

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const BCRYPT_ROUNDS = 12;
const INVALID_CREDENTIALS = 'Correo o contraseña incorrectos';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthSessionDto> {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Ya existe una cuenta con este correo');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        profile: {
          create: {
            firstName: dto.firstName?.trim() || null,
            lastName: dto.lastName?.trim() || null,
          },
        },
      },
      include: { profile: true },
    });

    const tokens = await this.issueTokens(user.id, user.email);
    return { user: this.toUserMe(user), tokens };
  }

  async login(dto: LoginDto): Promise<AuthSessionDto> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const tokens = await this.issueTokens(user.id, user.email);
    return { user: this.toUserMe(user), tokens };
  }

  async refresh(refreshToken: string): Promise<AuthTokensDto> {
    const payload = await this.verifyRefreshToken(refreshToken);
    const tokenHash = this.hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (
      !stored ||
      stored.revokedAt ||
      stored.expiresAt.getTime() <= Date.now() ||
      stored.userId !== payload.sub
    ) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    return this.issueTokens(user.id, user.email);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        tokenHash: this.hashToken(refreshToken),
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  async getMe(userId: string): Promise<UserMeDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Sesión no válida');
    }

    return this.toUserMe(user);
  }

  async issueTokens(userId: string, email: string): Promise<AuthTokensDto> {
    const accessSecret = this.config.getOrThrow<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.config.getOrThrow<string>('JWT_REFRESH_SECRET');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        { sub: userId, email },
        { secret: accessSecret, expiresIn: ACCESS_TOKEN_TTL_SECONDS },
      ),
      this.jwt.signAsync(
        { sub: userId, nonce: randomBytes(16).toString('hex') },
        { secret: refreshSecret, expiresIn: '7d' },
      ),
    ]);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: this.hashToken(refreshToken),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    };
  }

  private async verifyRefreshToken(
    refreshToken: string,
  ): Promise<{ sub: string }> {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string }>(
        refreshToken,
        {
          secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        },
      );

      if (!payload.sub) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private toUserMe(user: {
    id: string;
    email: string;
    emailVerifiedAt: Date | null;
    profile: {
      firstName: string | null;
      lastName: string | null;
    } | null;
  }): UserMeDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.profile?.firstName ?? null,
      lastName: user.profile?.lastName ?? null,
      emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
    };
  }
}
