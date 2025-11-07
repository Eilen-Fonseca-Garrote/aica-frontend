"use client";

import { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import AicaLogo from "public/img/aica-logo.jpg";
import NoProfilePic from "public/img/nofoto.jpg";
import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <html lang="es">
      <body>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <div className="flex flex-1">
            {/* Sidebar */}
            <aside
              className={`bg-[#0B1A20] text-white flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
                collapsed ? "w-0" : "w-72"
              }`}
            >
              {/* Sidebar Content Wrapper */}
              <div
                className={`transition-opacity duration-200 ease-in-out ${
                  collapsed ? "opacity-0 invisible" : "opacity-100 visible"
                }`}
              >
                <div className="flex items-center gap-3 p-4">
                  <Image
                    src={AicaLogo}
                    alt="logo"
                    width={50}
                    height={50}
                    className="rounded"
                  />
                  <span className="text-base font-medium whitespace-nowrap">
                    <Link href={"/"}>Sistema de Personal AICA</Link>
                  </span>
                </div>

                {/* User Profile */}
                <div className="p-4 border-b border-gray-600">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={NoProfilePic} alt="avatar" />
                      <AvatarFallback className="bg-gray-500">AL</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium">Usuario</span>
                        <span className="text-xs text-gray-300">
                          Sistema de Personal de Aica
                        </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1" />

                {/* Sidebar Menu Items */}
                <Link  href={"/listarTrabajadores"}>
                  <nav className="flex-1 p-4 hover:bg-[#263037]">Listar Trabajadores</nav>
                </Link>
                <Link href={"/promedio"}>
                  <nav className="flex-1 p-4 hover:bg-[#263037]">Promedio Trabajadores</nav>
                </Link>
                <Link href={"/interruptos"}>
                  <nav className="flex-1 p-4 hover:bg-[#263037]">Trabajadores Interruptos</nav>
                </Link>
                <Link href={"/ausentismo"}>
                  <nav className="flex-1 p-4 hover:bg-[#263037]">Claves de Ausentismo</nav>
                </Link>
                <Link href={"/modeloRL4"}>
                  <nav className="flex-1 p-4 hover:bg-[#263037]">Modelos</nav>
                </Link>
                {/* Logout */}
                <div className="p-4">
                  <Button className="w-full justify-start text-white hover:bg-gray-600 transition-all duration-300">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span className="whitespace-nowrap">Cerrar sesión</span>
                  </Button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
              <header className="flex items-center justify-between text-gray-700 px-4 py-3 border-b border-gray-600">
                <button
                  className="text-gray-700 hover:bg-gray-700 hover:text-white p-2 rounded transition-colors"
                  onClick={() => setCollapsed((prev) => !prev)}
                  title="Toggle Menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </header>

              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
