import { RoleEnum } from '@/app/lib/api/role.enum'
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    username: string
    fullName: string
    role: RoleEnum
    enterpriseId: number
    uebId: number
    ci: string
    policies: string
  }

  interface Session {
    accessToken: string
    idToken: string // ← NUEVO
    user: User
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string
    idToken: string // ← NUEVO
    user: User
  }
}