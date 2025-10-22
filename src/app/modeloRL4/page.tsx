import Link from "next/link"
import { Download, Minus, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import ModeloRl4Form from "./exportarExcel"

export default function ModeloRl4Page() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button className="ghost text-white hover:bg-green-600 hover:text-white text-sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Menú Principal
          </Button>
        </Link>

        <ModeloRl4Form />
      </div>
    </div>

    //className="ghost text-white hover:bg-green-600 hover:text-white text-sm"
  )
}
