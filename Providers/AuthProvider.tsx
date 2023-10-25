'use client'
import { useRouter } from 'next/navigation'
import { PropsWithChildren, createContext, useContext, useState } from 'react'

interface AuthContextType {
  accessToken: string
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>({
  accessToken: '',
  login: () => {},
  logout: () => {}
})

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [accessToken, setAccessToken] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken') || ''
    }
    return ''
  })
  const router = useRouter()

  const login = (token: string) => {
    localStorage.setItem('accessToken', token)
    setAccessToken(token)
    router.replace('/dashboard')
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    setAccessToken('false')
    router.replace('/auth')
  }

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
