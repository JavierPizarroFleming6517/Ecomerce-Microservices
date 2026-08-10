import { useContext } from 'react'
import { AuthContext } from './auth-context-instance'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
