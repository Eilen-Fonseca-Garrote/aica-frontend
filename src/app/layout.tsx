'use client';

import { SessionProvider } from 'next-auth/react';
import './globals.css';

// Layout principal que envuelve con los providers necesarios
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="bg-white">
      <body className="h-screen">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
