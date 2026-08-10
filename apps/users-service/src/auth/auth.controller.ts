import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { AuthSessionDto, AuthTokensDto, UserMeDto } from '@retail/contracts';
import { AuthService } from './auth.service';
import {
  LogoutDto,
  LoginDto,
  RefreshDto,
  RegisterDto,
} from './dto/auth.dto';
import {
  JwtAuthGuard,
  type AuthenticatedRequest,
} from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto): Promise<AuthSessionDto> {
    return this.auth.register(body);
  }

  @Post('login')
  login(@Body() body: LoginDto): Promise<AuthSessionDto> {
    return this.auth.login(body);
  }

  @Post('refresh')
  refresh(@Body() body: RefreshDto): Promise<AuthTokensDto> {
    return this.auth.refresh(body.refreshToken);
  }

  @Post('logout')
  async logout(@Body() body: LogoutDto): Promise<{ ok: true }> {
    await this.auth.logout(body.refreshToken);
    return { ok: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() request: AuthenticatedRequest): Promise<UserMeDto> {
    return this.auth.getMe(request.user!.userId);
  }
}
