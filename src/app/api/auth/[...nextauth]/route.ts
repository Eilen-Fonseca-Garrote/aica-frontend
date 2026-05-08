// api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, type User as NextAuthUser } from 'next-auth';
import { RoleEnum } from '@/app/lib/api/role.enum';

const getRol = (groups: string[]): RoleEnum => {
  if (groups.includes('Internal/p_gestor_empresa')) return RoleEnum.ADMIN_ENTERPRISE;
  if (groups.includes('Internal/p_gestor_ueb')) return RoleEnum.ADMIN_UEB;
  return RoleEnum.USER;
};

const getUebId = (groups: string[]): number => {
  if (groups.includes('Internal/p_gestor_aica')) return 16;
  if (groups.includes('Internal/p_gestor_liorad')) return 25;
  if (groups.includes('Internal/p_gestor_jt')) return 55;
  if (groups.includes('Internal/p_gestor_citox')) return 100;
  if (groups.includes('Internal/p_gestor_sh')) return 57;
  return 0;
};

interface WSO2Profile {
  sub: string;
  name?: string;
  preferred_username?: string;
  email?: string;
  groups?: string[];
}

interface CustomUser extends NextAuthUser {
  username: string;
  fullName: string;
  role: RoleEnum;
  enterpriseId: number;
  uebId: number;
  ci: string;
  policies: string;
}

interface CustomJWT {
  accessToken: string;
  idToken: string; // ← NUEVO: necesario para el logout de WSO2
  user: CustomUser;
}

const nextAuth = NextAuth({
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
      profile(profile: WSO2Profile): CustomUser {
        const groups = profile.groups || [];
        return {
          id: profile.sub,
          name: profile.name || '',
          email: profile.email || '',
          image: null,
          username: profile.sub,
          fullName: profile.preferred_username || profile.name || '',
          role: getRol(groups),
          enterpriseId: 1,
          uebId: getUebId(groups),
          ci: '',
          policies: '',
        };
      },
      httpOptions: { timeout: 10000 },
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const customProfile = profile as WSO2Profile;
        const customToken = token as CustomJWT;

        customToken.accessToken = account.access_token!;
        customToken.idToken = account.id_token!; // ← NUEVO: guardar id_token en el JWT
        customToken.user = {
          id: customProfile.sub,
          name: customProfile.name || '',
          email: customProfile.email || '',
          image: null,
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

  // ← NUEVO: redirigir al endpoint de logout de WSO2IS al cerrar sesión
  events: {
    async signOut({ token }) {
      const customToken = token as CustomJWT;
      const idToken = customToken?.idToken;

      if (idToken) {
        const wso2Host = process.env.WSO2IS_HOST;
        const tenantName = process.env.WSO2IS_TENANT_NAME;
        const postLogoutUri = encodeURIComponent(
          process.env.NEXTAUTH_URL + '/api/auth/signout'
        );

        // Construir la URL de logout de WSO2IS con id_token_hint
        // Esto invalida la sesión SSO en el servidor de identidad
        const logoutUrl =
          `${wso2Host}/t/${tenantName}/oidc/logout` +
          `?id_token_hint=${idToken}` +
          `&post_logout_redirect_uri=${postLogoutUri}` +
          `&state=sign_out_confirm`;

        try {
          await fetch(logoutUrl, { method: 'GET' });
        } catch (e) {
          console.error('Error al cerrar sesión en WSO2IS:', e);
        }
      }
    },
  },

  debug: process.env.NODE_ENV !== 'production',
});

export const GET = nextAuth;
export const POST = nextAuth;