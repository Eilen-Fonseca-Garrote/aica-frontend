  export const downloadFile = async (file: Blob, fileName: string) => {
    try {
    if (!file) throw new Error('Error al descargar el PDF')
    const urlBlob = window.URL.createObjectURL(file)

    const link = document.createElement('a')
    link.href = urlBlob
    link.download = fileName
    document.body.appendChild(link)
    link.click()

    link.remove()
    window.URL.revokeObjectURL(urlBlob)
  } catch (err) {
    console.error('Error descargando el PDF:', err)
    alert('No se pudo descargar el PDF. Inténtelo de nuevo más tarde.')
  }
  }