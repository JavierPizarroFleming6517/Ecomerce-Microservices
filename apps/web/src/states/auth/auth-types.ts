import type { AuthTokensDto, UserMeDto } from '@retail/contracts'

export interface StoredAuthSession {
  tokens: AuthTokensDto
  user: UserMeDto | null
}
