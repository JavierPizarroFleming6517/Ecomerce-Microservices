import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  AuthSessionDto,
  AuthTokensDto,
  LoginRequestDto,
  RegisterRequestDto,
  UserMeDto,
} from '@retail/contracts'
import * as authApi from '../../api/auth'
import { AuthContext, type AuthContextValue } from './auth-context-instance'
import type { StoredAuthSession } from './auth-types'

const STORAGE_KEY = 'retail.auth.v1'

function readStoredSession(): StoredAuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw) as StoredAuthSession
    if (!parsed?.tokens?.accessToken || !parsed?.tokens?.refreshToken) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeStoredSession(session: StoredAuthSession | null): void {
  if (!session) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<AuthTokensDto | null>(
    () => readStoredSession()?.tokens ?? null,
  )
  const [user, setUser] = useState<UserMeDto | null>(
    () => readStoredSession()?.user ?? null,
  )
  const [isBootstrapping, setIsBootstrapping] = useState(
    () => Boolean(readStoredSession()?.tokens.accessToken),
  )

  const persist = useCallback(
    (nextTokens: AuthTokensDto | null, nextUser: UserMeDto | null) => {
      setTokens(nextTokens)
      setUser(nextUser)
      writeStoredSession(
        nextTokens
          ? {
              tokens: nextTokens,
              user: nextUser,
            }
          : null,
      )
    },
    [],
  )

  const applySession = useCallback(
    (session: AuthSessionDto) => {
      persist(session.tokens, session.user)
    },
    [persist],
  )

  const refreshSession = useCallback(async (): Promise<boolean> => {
    const current = readStoredSession()
    if (!current?.tokens.refreshToken) {
      persist(null, null)
      return false
    }

    try {
      const nextTokens = await authApi.refreshTokens(current.tokens.refreshToken)
      const nextUser = await authApi.getMe(nextTokens.accessToken)
      persist(nextTokens, nextUser)
      return true
    } catch {
      persist(null, null)
      return false
    }
  }, [persist])

  useEffect(() => {
    const stored = readStoredSession()
    if (!stored?.tokens.accessToken) {
      return
    }

    const controller = new AbortController()
    const accessToken = stored.tokens.accessToken

    void authApi
      .getMe(accessToken, controller.signal)
      .then((nextUser) => {
        if (controller.signal.aborted) {
          return
        }
        persist(stored.tokens, nextUser)
        setIsBootstrapping(false)
      })
      .catch(async () => {
        if (controller.signal.aborted) {
          return
        }
        const refreshed = await refreshSession()
        if (!controller.signal.aborted) {
          if (!refreshed) {
            persist(null, null)
          }
          setIsBootstrapping(false)
        }
      })

    return () => controller.abort()
    // Bootstrap session once from localStorage on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = useCallback(
    async (data: LoginRequestDto) => {
      const session = await authApi.login(data)
      applySession(session)
      return session
    },
    [applySession],
  )

  const register = useCallback(
    async (data: RegisterRequestDto) => {
      const session = await authApi.register(data)
      applySession(session)
      return session
    },
    [applySession],
  )

  const logout = useCallback(async () => {
    const currentRefresh = tokens?.refreshToken
    persist(null, null)
    if (currentRefresh) {
      try {
        await authApi.logout(currentRefresh)
      } catch {
        // local session already cleared
      }
    }
  }, [persist, tokens?.refreshToken])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken: tokens?.accessToken ?? null,
      isAuthenticated: Boolean(tokens?.accessToken && user),
      isBootstrapping,
      login,
      register,
      logout,
      refreshSession,
    }),
    [
      isBootstrapping,
      login,
      logout,
      refreshSession,
      register,
      tokens?.accessToken,
      user,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
