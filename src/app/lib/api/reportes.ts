import { apiClient } from "./client"

export const downloadModelo14BXls = async () => {
    const url = `/export/excel/model14b`
    const res = await apiClient.get<Blob>(url, { responseType: 'blob' })

    return res.data
}