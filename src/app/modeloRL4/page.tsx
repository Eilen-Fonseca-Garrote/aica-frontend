import Link from "next/link"
import { Download, Minus, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import ModeloRl4Form from "./exportarExcel"

export default function ModeloRl4Page() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Menú Principal
          </Button>
        </Link>

        <ModeloRl4Form />
      </div>
    </div>
  )
}
