import type {
  AuthSessionDto,
  AuthTokensDto,
  LoginRequestDto,
  RegisterRequestDto,
  UserMeDto,
} from '@retail/contracts'
import { getApi, postApi } from '../lib/http'

export function login(
  data: LoginRequestDto,
  signal?: AbortSignal,
): Promise<AuthSessionDto> {
  return postApi<AuthSessionDto>('/api/v1/auth/login', data, { signal })
}

export function register(
  data: RegisterRequestDto,
  signal?: AbortSignal,
): Promise<AuthSessionDto> {
  return postApi<AuthSessionDto>('/api/v1/auth/register', data, { signal })
}

export function refreshTokens(
  refreshToken: string,
  signal?: AbortSignal,
): Promise<AuthTokensDto> {
  return postApi<AuthTokensDto>(
    '/api/v1/auth/refresh',
    { refreshToken },
    { signal },
  )
}

export function logout(
  refreshToken: string,
  signal?: AbortSignal,
): Promise<{ ok: true }> {
  return postApi<{ ok: true }>(
    '/api/v1/auth/logout',
    { refreshToken },
    { signal },
  )
}

export function getMe(
  accessToken: string,
  signal?: AbortSignal,
): Promise<UserMeDto> {
  return getApi<UserMeDto>('/api/v1/auth/me', { signal, accessToken })
}
