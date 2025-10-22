"use client"
/* Página desplegada de Trabajadores Interruptos*/
import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Download, Minus, ArrowLeft } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"

export default function TrabajadoresInterruptos() {
  const router = useRouter()
  const [direccion, setDireccion] = useState("LIORAD")
  const [fecha, setFecha] = useState("09-2022")

  const data = [
    {
      direccion: "UEB LIORAD",
      covid: 0,
      reubicacion: 0,
      produccion100: 98,
      produccion60: 0,
    },
    {
      direccion: "Total Femenino",
      covid: 0,
      reubicacion: 0,
      produccion100: 62,
      produccion60: 0,
    },
    {
      direccion: "Total Masculino",
      covid: 0,
      reubicacion: 0,
      produccion100: 36,
      produccion60: 0,
    },
    {
      direccion: "Total",
      covid: 0,
      reubicacion: 0,
      produccion100: 98,
      produccion60: 0,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between rounded-t-lg bg-[#28a745] px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              className="ghost text-white hover:bg-green-600 hover:text-white text-sm"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-medium text-white">Trabajadores interruptos</h1>
          </div>
          <button className="text-white hover:text-gray-200" title="Minimize">
            <Minus className="h-5 w-5" />
          </button>
        </div>

        {/* Filters and Actions */}
        <div className="mb-6 rounded-b-lg bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-4">
            <Select value={direccion} onValueChange={setDireccion}>
              <SelectTrigger className="w-[280px]" onClickAction={() => {}}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent isOpen={true}>
                <SelectItem value="LIORAD" onSelectAction={() => {}}>LIORAD</SelectItem>
                <SelectItem value="UEB1" onSelectAction={() => {}}>UEB1</SelectItem>
                <SelectItem value="UEB2" onSelectAction={() => {}}>UEB2</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="text"
              value={fecha}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFecha(e.target.value)}
              className="w-[200px]"
              placeholder="MM-YYYY"
            />
          </div>

          <div className="flex items-center justify-between">
            <Button className="bg-[#28a745] hover:bg-[#218838]">Calcular</Button>
            <Button className="bg-[#dc3545] hover:bg-[#c82333]">
              Descargar PDF <Download className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-lg bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Dirección</TableHead>
                <TableHead className="font-semibold text-gray-700">Interruptos por Covid</TableHead>
                <TableHead className="font-semibold text-gray-700">Interruptos por Reubicación</TableHead>
                <TableHead className="font-semibold text-gray-700">Interruptos de Producción 100%</TableHead>
                <TableHead className="font-semibold text-gray-700">Interruptos de Producción 60%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index} className={row.direccion === "Total" ? "font-semibold" : ""}>
                  <TableCell>{row.direccion}</TableCell>
                  <TableCell>{row.covid}</TableCell>
                  <TableCell>{row.reubicacion}</TableCell>
                  <TableCell>{row.produccion100}</TableCell>
                  <TableCell>{row.produccion60}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}