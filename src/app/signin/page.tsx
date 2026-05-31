'use client';

import { signIn } from 'next-auth/react';
import { useEffect } from 'react';

const SignInPage = () => {
  useEffect(() => {
    signIn('identity-server', { callbackUrl: '/' });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirigiendo al login...</p>
      </div>
    </div>
  );
}

export default SignInPage
