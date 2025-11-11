import { RoleEnum } from '@/app/lib/api/role.enum';
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    username: string
    name: string
    fullName: string
    email: string
    role: RoleEnum
    enterpriseId: number
    uebId: number
    ci: string
    policies: string
  }

  interface Session {
    accessToken: string
    user: User
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string
    user: {
      sub: string
      name: string
      preferred_username: string
      email: string
      groups: string[]
    }
  }
}






/*
declare module 'next-auth' {
  interface User {
    username: string
    name: string
    fullName: string
    email: string
    role: RoleEnum
    enterpriseId: number
    uebId: number
    ci: string
    policies: string
  }

  interface Session {
    accessToken: string
    user: User
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string
    user: {
      sub: string
      name: string
      preferred_username: string
      email: string
      groups: string[]
    }
  }
}  */