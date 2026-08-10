export interface LoginRequestDto {
  email: string
  password: string
}

export interface RegisterRequestDto {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface RefreshRequestDto {
  refreshToken: string
}

export interface LogoutRequestDto {
  refreshToken: string
}

export interface AuthTokensDto {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface UserMeDto {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  emailVerifiedAt: string | null
}

export interface AuthSessionDto {
  user: UserMeDto
  tokens: AuthTokensDto
}
