import { useCallback, useEffect, useRef, useState } from "react"

interface UseImageUploadProps {
    onUpload?: (url: string) => void
}

export function useImageUpload({ onUpload }: UseImageUploadProps = {}) {
    const previewRef = useRef<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Función de carga que simula un retraso y devuelve la URL local de previsualización
    // En un escenario real, aquí se haría la carga a un servicio de almacenamiento como Cloudinary, AWS S3, etc.
    const dummyUpload = async (file: File, localUrl: string): Promise<string> => {
        try {
            setUploading(true)
            // Simular retraso de red
            await new Promise((resolve) => setTimeout(resolve, 1500))

            // Simular errores aleatorios (20% de probabilidad)
            if (Math.random() < 0.2) {
                throw new Error("Error de carga - Este es un error de demostración")
            }

            setError(null)
            // En una implementación real, esta sería la URL del servidor
            return localUrl
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Falló la carga"
            setError(errorMessage)
            throw new Error(errorMessage)
        } finally {
            setUploading(false)
        }
    }

    const handleThumbnailClick = useCallback(() => {
        fileInputRef.current?.click()
    }, [])

    const handleFileChange = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0]
            if (file) {
                setFileName(file.name)
                const localUrl = URL.createObjectURL(file)
                setPreviewUrl(localUrl)
                previewRef.current = localUrl

                try {
                    const uploadedUrl = await dummyUpload(file, localUrl)
                    onUpload?.(uploadedUrl)
                } catch (err) {
                    URL.revokeObjectURL(localUrl)
                    setPreviewUrl(null)
                    setFileName(null)
                    return console.error(err)
                }
            }
        },
        [onUpload],
    )

    const handleRemove = useCallback(() => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
        }
        setPreviewUrl(null)
        setFileName(null)
        previewRef.current = null
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
        setError(null)
    }, [previewUrl])

    useEffect(() => {
        return () => {
            if (previewRef.current) {
                URL.revokeObjectURL(previewRef.current)
            }
        }
    }, [])

    return {
        previewUrl,
        fileName,
        fileInputRef,
        handleThumbnailClick,
        handleFileChange,
        handleRemove,
        uploading,
        error,
    }
} 