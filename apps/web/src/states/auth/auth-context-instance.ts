import { createContext } from 'react'
import type {
  AuthSessionDto,
  LoginRequestDto,
  RegisterRequestDto,
  UserMeDto,
} from '@retail/contracts'

export interface AuthContextValue {
  user: UserMeDto | null
  accessToken: string | null
  isAuthenticated: boolean
  isBootstrapping: boolean
  login: (data: LoginRequestDto) => Promise<AuthSessionDto>
  register: (data: RegisterRequestDto) => Promise<AuthSessionDto>
  logout: () => Promise<void>
  refreshSession: () => Promise<boolean>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
