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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;


// anterior auth.provider.tsx por si acaso 

/*'use client';

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

export default AuthProvider; */
