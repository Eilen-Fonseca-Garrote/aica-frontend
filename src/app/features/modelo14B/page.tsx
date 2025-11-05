'use client'

const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL

const downloadModelo14B = async () => {
  try {
    
    const url = `${apiBase}/export/excel/model14b`

    const response = await fetch(url, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Error al descargar el Modelo 14B')
    }

    const blob = await response.blob()

    // In case the backend doesn’t provide a filename, define a fallback.
    const fileName = 'Modelo14B.xlsx'

    // Create an object URL for the Blob.
    const blobUrl = window.URL.createObjectURL(blob)

    // Use the File System API to trigger the download without touching the DOM.
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = fileName
    a.click()

    // Clean up the blob URL to free memory.
    window.URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('Error descargando el Modelo 14B:', error)
    alert('No se pudo descargar el Modelo 14B. Intente de nuevo más tarde.')
  }
}

export default function Modelo14BPage() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b px-4 py-3 font-semibold text-gray-700">
          Modelo 14B
        </div>
        <div className="p-4">
          <button
            type="button"
            onClick={downloadModelo14B}
            className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            Exportar Modelo 14B
          </button>
        </div>
      </div>
    </div>
  )
}
