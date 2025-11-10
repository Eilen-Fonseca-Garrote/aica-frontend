import NextAuth from 'next-auth';
import { RoleEnum } from '@/app/lib/api/role.enum';

// Función para obtener el rol
const getRol = (groups: string[]) => {
  if (groups.includes('Internal/p_gestor_empresa')) {
    return RoleEnum.ADMIN_ENTERPRISE;
  }
  if (groups.includes('Internal/p_gestor_ueb')) {
    return RoleEnum.ADMIN_UEB;
  }
  return RoleEnum.USER;
};

// Función para obtener el UEB ID
const getUebId = (groups: string[]) => {
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

// Define el tipo para el profile
interface Profile {
  sub?: string;
  name?: string;
  preferred_username?: string;
  email?: string;
  groups?: string[];
}

const authOptions = {
  providers: [
    {
      id: 'identity-server',
      name: 'WSO2IS',
      clientId: process.env.WSO2IS_CLIENT_ID!,
      clientSecret: process.env.WSO2IS_CLIENT_SECRET!,
      type: 'oauth',
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
      profile(profile: Profile) {
        console.log('Profile received:', profile);
        return {
          id: profile.sub,
          username: profile.preferred_username,
          name: profile.name,
          email: profile.email,
          groups: profile.groups || [],
        };
      },
      httpOptions: {
        timeout: 10000,
      },
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }: { token: any; account: any; profile?: Profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.user = {
          sub: profile.sub || '',
          name: profile.name || '',
          preferred_username: profile.preferred_username || '',
          email: profile.email || '',
          groups: profile.groups || [],
        };
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      if (token.user) {
        session.accessToken = token.accessToken;
        session.user = {
          username: token.user.sub,
          name: token.user.name,
          fullName: token.user.preferred_username,
          email: token.user.email,
          role: getRol(token.user.groups || []),
          enterpriseId: 1,
          uebId: getUebId(token.user.groups || []),
          ci: '',
          policies: '',
        };
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV !== 'production',
};

// Para App Router, exportamos los handlers como GET y POST
//const handler = NextAuth(authOptions);

//export { handler as GET, handler as POST };
