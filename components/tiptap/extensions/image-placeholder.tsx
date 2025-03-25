"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { isValidUrl } from "@/lib/tiptap-utils"
import { Extension } from "@tiptap/core"
import { Image, X } from "lucide-react"
import { type FormEvent, useState } from "react"
import { cn } from "@/lib/utils"
import { PopoverClose } from "@radix-ui/react-popover"
import { Editor } from "@tiptap/core"

interface ImageButtonProps {
    editor: Editor
}

export function ImageButton({ editor }: ImageButtonProps) {
    const [url, setUrl] = useState("")
    const [altText, setAltText] = useState("")
    const [urlError, setUrlError] = useState(false)

    const handleInsertImage = (e: FormEvent) => {
        e.preventDefault()
        const valid = isValidUrl(url)
        if (!valid) {
            setUrlError(true)
            return
        }
        if (url) {
            editor.chain().focus().setImage({ src: url, alt: altText }).run()
            setUrl("")
            setAltText("")
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                >
                    <Image className="h-4 w-4" />
                    <span className="sr-only">Imagen</span>
                </Button>
            </PopoverTrigger>

            <PopoverContent
                onCloseAutoFocus={(e) => {
                    e.preventDefault()
                }}
                className="w-72"
            >
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Insertar imagen</h4>
                        <p className="text-sm text-muted-foreground">
                            Ingresa la URL de la imagen que deseas insertar
                        </p>
                    </div>
                    <form onSubmit={handleInsertImage} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                id="url"
                                value={url}
                                onChange={(e) => {
                                    setUrl(e.target.value)
                                    setUrlError(false)
                                }}
                                className={cn(urlError && "border-destructive")}
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                            {urlError && <p className="text-xs text-destructive">Por favor, introduce una URL válida.</p>}
                        </div>
                        <div className="space-y-2">
                            <Input
                                id="alt"
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                placeholder="Texto alternativo (opcional)"
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Insertar imagen
                        </Button>
                    </form>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export const ImagePlaceholder = Extension.create({
    name: "image-placeholder",

    addOptions() {
        return {}
    },

    addProseMirrorPlugins() {
        return []
    },
}) 