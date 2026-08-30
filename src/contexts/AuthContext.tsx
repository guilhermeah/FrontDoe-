import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AuthContextType, LoginRequest, RegisterRequest, User } from '../types/auth.types'
import { AuthService } from '../services/AuthService'

const AuthContext = createContext<AuthContextType | null>(null)

const TOKEN_KEY = '@doemais:token'
const USER_KEY = '@doemais:user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (data: LoginRequest) => {
    const response = await AuthService.login(data)
    localStorage.setItem(TOKEN_KEY, response.token)
    localStorage.setItem(USER_KEY, JSON.stringify(response.user))
    setToken(response.token)
    setUser(response.user)
  }

  const register = async (data: RegisterRequest) => {
    const response = await AuthService.register(data)
    localStorage.setItem(TOKEN_KEY, response.token)
    localStorage.setItem(USER_KEY, JSON.stringify(response.user))
    setToken(response.token)
    setUser(response.user)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }

  const updateUser = (partial: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      const cleaned = Object.fromEntries(
        Object.entries(partial).filter(([, v]) => v !== undefined && v !== null)
      ) as Partial<User>
      const updated = { ...prev, ...cleaned }
      localStorage.setItem(USER_KEY, JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
