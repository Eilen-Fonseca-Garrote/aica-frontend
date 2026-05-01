"use client";

import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import AicaLogo from "public/img/aica-logo.jpg";
import NoProfilePic from "public/img/nofoto.jpg";
import "./globals.css";
import Link from "next/link";
import AuthProvider from "./api/auth/auth.provider";
import { AUTH_DISABLED_IN_DEV } from "@/app/lib/auth-config";

// Componente separado para el contenido del layout que usa useSession
function LayoutContent({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { data: session } = useSession();

  const handleSignOut = async () => {
    if (AUTH_DISABLED_IN_DEV) {
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
    }

    await signOut({ redirect: true, callbackUrl: "/" });
  };

  // Funcion para obtener iniciales del usuario
  const getUserInitials = () => {
    if (session?.user?.name) {
      return session.user.name
        .split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .toUpperCase();
    }
    return "U";
  };

  // Funcion para obtener el nombre para mostrar
  const getDisplayName = () => {
    return session?.user?.name || session?.user?.fullName || "Usuario";
  };

  // Funcion para obtener el email o rol para mostrar
  const getDisplaySubtitle = () => {
    return (
      session?.user?.email ||
      (session?.user?.role
        ? session.user.role.replace("_", " ")
        : "Sistema de Personal de Aica")
    );
  };

  return (
    <div className="flex flex-col bg-gray-100">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`bg-[#0B1A20] text-white flex flex-col transition-all duration-300 max-h-screen ease-in-out overflow-y-auto ${
            collapsed ? "w-0" : "w-72"
          }`}
        >
          {/* Sidebar Content Wrapper */}
          <div
            className={`flex flex-col h-full transition-opacity duration-200 ease-in-out ${
              collapsed ? "opacity-0 invisible" : "opacity-100 visible"
            }`}
          >
            {/* Logo y nombre */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-600">
              <Image
                src={AicaLogo}
                alt="logo AICA"
                width={50}
                height={50}
                className="rounded"
                priority
              />
              <span className="text-base font-medium whitespace-nowrap">
                <Link href={"/"} className="hover:text-gray-300 transition-colors">
                  Sistema de Personal AICA
                </Link>
              </span>
            </div>

            {/* User Profile */}
            <div className="p-4 border-b border-gray-600">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={NoProfilePic.src} alt="avatar usuario" />
                  <AvatarFallback className="bg-gray-500 text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium truncate">
                    {getDisplayName()}
                  </span>
                  <span className="text-xs text-gray-300 truncate">
                    {getDisplaySubtitle()}
                  </span>
                  {session?.user?.uebId && (
                    <span className="text-xs text-gray-400">
                      UEB: {session.user.uebId}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 py-4">
              <Link href={"/listarTrabajadores"}>
                <div className="p-4 hover:bg-[#263037] cursor-pointer transition-colors border-l-4 border-transparent hover:border-blue-400">
                  Listar Trabajadores
                </div>
              </Link>
              <Link href={"/promedio"}>
                <div className="p-4 hover:bg-[#263037] cursor-pointer transition-colors border-l-4 border-transparent hover:border-blue-400">
                  Promedio Trabajadores
                </div>
              </Link>
              <Link href={"/interruptos"}>
                <div className="p-4 hover:bg-[#263037] cursor-pointer transition-colors border-l-4 border-transparent hover:border-blue-400">
                  Trabajadores Interruptos
                </div>
              </Link>
              <Link href={"/ausentismo"}>
                <div className="p-4 hover:bg-[#263037] cursor-pointer transition-colors border-l-4 border-transparent hover:border-blue-400">
                  Claves de Ausentismo
                </div>
              </Link>
              <Link href={"/modelos"}>
                <div className="p-4 hover:bg-[#263037] cursor-pointer transition-colors border-l-4 border-transparent hover:border-blue-400">
                  Modelos
                </div>
              </Link>
            </nav>

            {/* Logout */}
            {!AUTH_DISABLED_IN_DEV && (
              <div className="p-4 border-t border-gray-600 mt-auto">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-[#263037] hover:text-white transition-all duration-300"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="whitespace-nowrap">Cerrar sesion</span>
                </Button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-auto max-h-screen min-h-screen">
          <header className="flex items-center justify-between bg-white text-gray-700 px-4 py-3 border-b border-gray-200 shadow-sm">
            <button
              className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 p-2 rounded transition-colors"
              onClick={() => setCollapsed((prev) => !prev)}
              title={collapsed ? "Expandir menu" : "Contraer menu"}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Informacion adicional del usuario */}
            <div className="flex items-center space-x-4">
              {AUTH_DISABLED_IN_DEV ? (
                <span className="text-sm text-amber-700 bg-amber-100 px-2 py-1 rounded">
                  Desarrollo sin autenticacion
                </span>
              ) : (
                session?.user && (
                  <>
                    <span className="text-sm text-gray-600 hidden md:inline">
                      {session.user.email}
                    </span>
                    {session.user.uebId && (
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        UEB ID: {session.user.uebId}
                      </span>
                    )}
                    <span className="text-sm text-gray-600 bg-blue-100 px-2 py-1 rounded capitalize">
                      {session.user.role?.replace("_", " ") || "user"}
                    </span>
                  </>
                )
              )}
            </div>
          </header>

          {/* Contenido principal con scroll */}
          <div className="flex-1 overflow-auto bg-white">{children}</div>
        </main>
      </div>
    </div>
  );
}

// Layout principal que envuelve con los providers necesarios
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="bg-white">
      <body className="h-screen">
        <SessionProvider>
          <AuthProvider>
            <LayoutContent>{children}</LayoutContent>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
