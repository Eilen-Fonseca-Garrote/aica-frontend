'use client';

/* eslint-disable @next/next/no-img-element */
import { signOut, useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { LogOut, Menu, Settings } from "lucide-react";
import NoProfilePic from "public/img/nofoto.jpg";
import Link from "next/link";
import { AUTH_DISABLED_IN_DEV } from "@/app/lib/auth-config";
import { redirect } from "next/navigation";
import { getResourceUrl } from "@/app/lib/api/systemInterface";
import {
  SystemInterfaceProvider,
  useSystemInterfaceConfig,
} from "@/app/lib/system-interface-context";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SystemInterfaceProvider>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </SystemInterfaceProvider>
  );
}

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { data: session, status } = useSession();
  const { config } = useSystemInterfaceConfig();
  const logoSrc = useMemo(() => getResourceUrl(config.logo), [config.logo]);

  if (!AUTH_DISABLED_IN_DEV) {
    if (status === 'loading') return null;
    if (status === 'unauthenticated') return redirect('/signin');
  }

  const handleSignOut = async () => {
    if (AUTH_DISABLED_IN_DEV) {
      alert('AUTH_DISABLED_IN_DEV=true');
      return;
    }

    await signOut({ redirect: true, callbackUrl: "/signin" });
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
      session?.user?.email || "Sistema de Personal de Aica"
    );
  };

  return (
    <div className="flex flex-col bg-gray-100">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`text-white flex flex-col transition-all duration-300 max-h-screen ease-in-out overflow-y-auto ${
            collapsed ? "w-0" : "w-72"
          }`}
          style={{ backgroundColor: config.sidebarColor }}
        >
          {/* Sidebar Content Wrapper */}
          <div
            className={`flex flex-col h-full transition-opacity duration-200 ease-in-out ${
              collapsed ? "opacity-0 invisible" : "opacity-100 visible"
            }`}
          >
            {/* Logo y nombre */}
            <div className="app-sidebar-divider flex items-center gap-3 p-4 border-b">
              <img
                src={logoSrc}
                alt="logo AICA"
                className="h-12 w-12 rounded object-contain bg-white/95 p-1"
                onError={(event) => {
                  event.currentTarget.src = "/img/aica-logo.jpg";
                }}
              />
              <span className="text-base font-medium whitespace-nowrap">
                <Link href={"/"} className="hover:text-gray-300 transition-colors">
                  Sistema de Personal AICA
                </Link>
              </span>
            </div>

            {/* User Profile */}
            <div className="app-sidebar-divider p-4 border-b">
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
                  {session?.user?.uebId ? (
                    <span className="text-xs text-gray-400">
                      UEB: {session.user.uebId}
                    </span>
                  ): null}
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 py-4">
              <Link href={"/listarTrabajadores"}>
                <div className="app-sidebar-link p-4 cursor-pointer transition-colors border-l-4 border-transparent">
                  Listar Trabajadores
                </div>
              </Link>
              <Link href={"/promedio"}>
                <div className="app-sidebar-link p-4 cursor-pointer transition-colors border-l-4 border-transparent">
                  Promedio Trabajadores
                </div>
              </Link>
              <Link href={"/interruptos"}>
                <div className="app-sidebar-link p-4 cursor-pointer transition-colors border-l-4 border-transparent">
                  Trabajadores Interruptos
                </div>
              </Link>
              <Link href={"/ausentismo"}>
                <div className="app-sidebar-link p-4 cursor-pointer transition-colors border-l-4 border-transparent">
                  Claves de Ausentismo
                </div>
              </Link>
              <Link href={"/modelos"}>
                <div className="app-sidebar-link p-4 cursor-pointer transition-colors border-l-4 border-transparent">
                  Modelos
                </div>
              </Link>
              <Link href={"/configuracion/interfaz-del-sistema"}>
                <div className="app-sidebar-link flex items-center gap-2 p-4 cursor-pointer transition-colors border-l-4 border-transparent">
                  <Settings className="h-4 w-4" />
                  Configuracion
                </div>
              </Link>
            </nav>

            {/* Logout */}
            {!AUTH_DISABLED_IN_DEV && (
              <div className="app-sidebar-divider p-4 border-t mt-auto">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-[var(--app-sidebar-hover)] hover:text-white transition-all duration-300"
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
              {AUTH_DISABLED_IN_DEV && (
                <span className="text-sm text-amber-700 bg-amber-100 px-2 py-1 rounded">
                  Desarrollo sin autenticacion
                </span>
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

export default Layout
