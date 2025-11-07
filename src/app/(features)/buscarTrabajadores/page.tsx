"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Card from "@/app/(features)/uiLibrary/Card"
import { Search } from "lucide-react"

export default function BuscarTrabajador() {
  const [form, setForm] = useState({
    ueb: "",
    ci: "",
    name: "",
    allCat: false,
    family: false,
    labor: false,
    studies: false,
    mision: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching:", form)
  }

  return (
    <div className="max-w-5xl mx-auto">
        <Card className="p-6 bg-white">
        <form onSubmit={handleSubmit}>
            {/* UEB, CI, Nombre */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
                <select
                name="ueb"
                value={form.ueb}
                onChange={handleChange}
                className="w-full border rounded p-2"
                >
                <option value="">Seleccionar UEB...</option>
                <option value="16">AICA</option>
                <option value="25">LIORAD</option>
                <option value="100">CITOX</option>
                <option value="55">JULIO TRIGO</option>
                <option value="57">SH+</option>
                </select>
            </div>

            <div>
                <input
                type="number"
                name="ci"
                placeholder="Buscar por CI"
                value={form.ci}
                onChange={handleChange}
                className="w-full border rounded p-2"
                />
            </div>

            <div>
                <input
                type="text"
                name="name"
                placeholder="Buscar por Nombre y Apellidos"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded p-2"
                />
            </div>
            </div>

            <h5 className="font-medium text-gray-700">Categorías a mostrar</h5>
            <hr className="my-2" />

            <div className="mb-3">
            <label className="inline-flex items-center space-x-2">
                <input
                type="checkbox"
                name="allCat"
                checked={form.allCat}
                onChange={handleChange}
                className="form-checkbox h-4 w-4"
                />
                <span>Todos</span>
            </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="flex items-center gap-2">
                <input type="checkbox" checked readOnly className="form-checkbox h-4 w-4" />
                <span>Información General</span>
                </label>

                <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="family"
                    checked={form.family}
                    onChange={handleChange}
                    className="form-checkbox h-4 w-4"
                />
                <span>Información Familiar</span>
                </label>

                <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="labor"
                    checked={form.labor}
                    onChange={handleChange}
                    className="form-checkbox h-4 w-4"
                />
                <span>Información Laboral</span>
                </label>
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="studies"
                    checked={form.studies}
                    onChange={handleChange}
                    className="form-checkbox h-4 w-4"
                />
                <span>Estudios</span>
                </label>

                <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="mision"
                    checked={form.mision}
                    onChange={handleChange}
                    className="form-checkbox h-4 w-4"
                />
                <span>Condecoraciones y Misiones</span>
                </label>
            </div>
            </div>

            <hr className="my-4" />

            <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Buscar <Search className="ml-2 h-4 w-4" />
            </Button>
            </div>
        </form>
        </Card>
    </div>
  )
}
