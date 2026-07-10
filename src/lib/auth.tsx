import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'

// Demo auth: email-only "magic link" simulation backed by
// localStorage so the conference demo works with zero infra and
// no network. Swap for Firebase Auth post-conference.

interface AuthState {
  user: { email: string; name: string } | null
  signIn: (email: string, name: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthState>({
  user: null,
  signIn: () => {},
  signOut: () => {},
})

const KEY = 'catlab:user'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as { email: string; name: string }) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(load)

  const signIn = useCallback((email: string, name: string) => {
    const u = { email, name }
    localStorage.setItem(KEY, JSON.stringify(u))
    setUser(u)
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem(KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
