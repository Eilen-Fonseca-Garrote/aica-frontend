'use client';

import { FC, ReactNode } from 'react';
import { signIn, useSession } from 'next-auth/react';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn('identity-server');
    },
  });

  if (status === 'loading') {
    return <p>Cargando...</p>;
  }
  return <>{children}</>;
};

export default AuthProvider;
