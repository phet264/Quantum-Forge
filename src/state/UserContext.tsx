import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type UserRole = 'student' | 'instructor'

export interface User {
  id: string
  name: string
  role: UserRole
  avatarUrl?: string
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  setRole: (role: UserRole) => void
}

const mockUser: User = {
  id: 'u-12345',
  name: 'Alex Researcher',
  role: 'student',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUpTNFyTtX-ykkJM1IBInvASQl47LfGBd4633afYz-AUtbS0pOMsiBf5r6mVjy9dMFRckzM9vxlGw3itD0CAqqXgOp912SGynd2Xxrr7cvJM8-MpDxxZUd1ay-pytzfH6HF33ulNB4bAPtONL7045sbL3BdGZhA_xm8xj1ooTBOfXJiKRTmy4FXInkBtQdGyvwVuQOZHVk63DGCLpn0d_J7lMnu1RL6972bYU8ZivOXP9mv5vXiyVg'
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUser)

  const setRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role })
    }
  }

  return (
    <UserContext.Provider value={{ user, isLoading: false, setRole }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
