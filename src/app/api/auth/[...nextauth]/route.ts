import NextAuth, { NextAuthOptions, type User as NextAuthUser } from 'next-auth';
import { RoleEnum } from '@/app/lib/api/role.enum';

// Función para obtener el rol
const getRol = (groups: string[]): RoleEnum => {
  if (groups.includes('Internal/p_gestor_empresa')) {
    return RoleEnum.ADMIN_ENTERPRISE;
  }
  if (groups.includes('Internal/p_gestor_ueb')) {
    return RoleEnum.ADMIN_UEB;
  }
  return RoleEnum.USER;
};

// Función para obtener el UEB ID
const getUebId = (groups: string[]): number => {
  if (groups.includes('Internal/p_gestor_aica')) {
    return 16;
  }
  if (groups.includes('Internal/p_gestor_liorad')) {
    return 25;
  }
  if (groups.includes('Internal/p_gestor_jt')) {
    return 55;
  }
  if (groups.includes('Internal/p_gestor_citox')) {
    return 100;
  }
  if (groups.includes('Internal/p_gestor_sh')) {
    return 57;
  }
  return 0;
};

// Interfaz para el profile de WSO2
interface WSO2Profile {
  sub: string;
  name?: string;
  preferred_username?: string;
  email?: string;
  groups?: string[];
}

// Interfaz para nuestro User extendido
interface CustomUser extends NextAuthUser {
  username: string;
  fullName: string;
  role: RoleEnum;
  enterpriseId: number;
  uebId: number;
  ci: string;
  policies: string;
}

// Interfaz para el token personalizado
interface CustomJWT {
  accessToken: string;
  user: CustomUser;
}

const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'identity-server',
      name: 'WSO2IS',
      clientId: process.env.WSO2IS_CLIENT_ID!,
      clientSecret: process.env.WSO2IS_CLIENT_SECRET!,
      type: 'oauth' as const,
      wellKnown:
        process.env.WSO2IS_HOST +
        '/t/' +
        process.env.WSO2IS_TENANT_NAME +
        '/oauth2/token/.well-known/openid-configuration',
      authorization: {
        params: {
          scope: 'openid profile email groups',
        },
      },
      profile(profile: WSO2Profile): CustomUser {
        console.log('Profile received:', profile);
        const groups = profile.groups || [];
        
        return {
          // Propiedades base requeridas por NextAuth
          id: profile.sub,
          name: profile.name || '',
          email: profile.email || '',
          image: null,
          
          // Nuestras propiedades extendidas
          username: profile.sub,
          fullName: profile.preferred_username || profile.name || '',
          role: getRol(groups),
          enterpriseId: 1,
          uebId: getUebId(groups),
          ci: '',
          policies: '',
        };
      },
      httpOptions: {
        timeout: 10000,
      },
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const customProfile = profile as WSO2Profile;
        const customToken = token as CustomJWT;
        
        customToken.accessToken = account.access_token!;
        customToken.user = {
          // Propiedades base
          id: customProfile.sub,
          name: customProfile.name || '',
          email: customProfile.email || '',
          image: null,
          
          // Propiedades extendidas
          username: customProfile.sub,
          fullName: customProfile.preferred_username || customProfile.name || '',
          role: getRol(customProfile.groups || []),
          enterpriseId: 1,
          uebId: getUebId(customProfile.groups || []),
          ci: '',
          policies: '',
        };
      }
      return token;
    },

    async session({ session, token }) {
      const customToken = token as CustomJWT;
      
      session.accessToken = customToken.accessToken;
      session.user = customToken.user;
      
      return session;
    },
  },
  debug: process.env.NODE_ENV !== 'production',
};

export const { GET, POST } = NextAuth(authOptions);
