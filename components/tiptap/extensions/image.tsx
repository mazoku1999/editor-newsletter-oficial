"use client"

import Image from "@tiptap/extension-image"
import { type NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Maximize,
    MoreVertical,
    Trash,
    Edit,
    ImageIcon,
    Loader2,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useImageUpload } from "@/hooks/use-image-upload"

export const ImageExtension = Image.extend({
    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            title: {
                default: null,
            },
            width: {
                default: "100%",
            },
            height: {
                default: null,
            },
            align: {
                default: "center",
            },
            caption: {
                default: "",
            },
            aspectRatio: {
                default: null,
            },
        }
    },

    addNodeView: () => {
        return ReactNodeViewRenderer(TiptapImage)
    },
})

function TiptapImage(props: NodeViewProps) {
    const { node, editor, selected, deleteNode, updateAttributes } = props
    const imageRef = useRef<HTMLImageElement | null>(null)
    const nodeRef = useRef<HTMLDivElement | null>(null)
    const [resizing, setResizing] = useState(false)
    const [resizingPosition, setResizingPosition] = useState<"left" | "right">("left")
    const [resizeInitialWidth, setResizeInitialWidth] = useState(0)
    const [resizeInitialMouseX, setResizeInitialMouseX] = useState(0)
    const [editingCaption, setEditingCaption] = useState(false)
    const [caption, setCaption] = useState(node.attrs.caption || "")
    const [openedMore, setOpenedMore] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const [altText, setAltText] = useState(node.attrs.alt || "")

    const { previewUrl, fileInputRef, handleFileChange, handleRemove, uploading, error } = useImageUpload({
        onUpload: (imageUrl) => {
            updateAttributes({
                src: imageUrl,
                alt: altText || fileInputRef.current?.files?.[0]?.name,
            })
            handleRemove()
            setOpenedMore(false)
        },
    })

    function handleResizingPosition({
        e,
        position,
    }: {
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
        position: "left" | "right"
    }) {
        startResize(e)
        setResizingPosition(position)
    }

    function startResize(event: React.MouseEvent<HTMLDivElement>) {
        event.preventDefault()
        setResizing(true)
        setResizeInitialMouseX(event.clientX)
        if (imageRef.current) {
            setResizeInitialWidth(imageRef.current.offsetWidth)
        }
    }

    function resize(event: MouseEvent) {
        if (!resizing) return

        let dx = event.clientX - resizeInitialMouseX
        if (resizingPosition === "left") {
            dx = resizeInitialMouseX - event.clientX
        }

        const newWidth = Math.max(resizeInitialWidth + dx, 150)
        const parentWidth = nodeRef.current?.parentElement?.offsetWidth ?? 0

        if (newWidth < parentWidth) {
            updateAttributes({
                width: newWidth,
            })
        }
    }

    function endResize() {
        setResizing(false)
        setResizeInitialMouseX(0)
        setResizeInitialWidth(0)
    }

    function handleTouchStart(event: React.TouchEvent, position: "left" | "right") {
        event.preventDefault()
        setResizing(true)
        setResizingPosition(position)
        setResizeInitialMouseX(event.touches[0]?.clientX ?? 0)
        if (imageRef.current) {
            setResizeInitialWidth(imageRef.current.offsetWidth)
        }
    }

    function handleTouchMove(event: TouchEvent) {
        if (!resizing) return

        let dx = (event.touches[0]?.clientX ?? resizeInitialMouseX) - resizeInitialMouseX
        if (resizingPosition === "left") {
            dx = resizeInitialMouseX - (event.touches[0]?.clientX ?? resizeInitialMouseX)
        }

        const newWidth = Math.max(resizeInitialWidth + dx, 150)
        const parentWidth = nodeRef.current?.parentElement?.offsetWidth ?? 0

        if (newWidth < parentWidth) {
            updateAttributes({
                width: newWidth,
            })
        }
    }

    function handleTouchEnd() {
        setResizing(false)
        setResizeInitialMouseX(0)
        setResizeInitialWidth(0)
    }

    function handleCaptionChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newCaption = e.target.value
        setCaption(newCaption)
    }

    function handleCaptionBlur() {
        updateAttributes({ caption })
        setEditingCaption(false)
    }

    function handleCaptionKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            handleCaptionBlur()
        }
    }

    const handleImageUrlSubmit = () => {
        if (imageUrl) {
            updateAttributes({
                src: imageUrl,
                alt: altText,
            })
            setImageUrl("")
            setAltText("")
            setOpenedMore(false)
        }
    }

    useEffect(() => {
        window.addEventListener("mousemove", resize)
        window.addEventListener("mouseup", endResize)
        window.addEventListener("touchmove", handleTouchMove)
        window.addEventListener("touchend", handleTouchEnd)
        return () => {
            window.removeEventListener("mousemove", resize)
            window.removeEventListener("mouseup", endResize)
            window.removeEventListener("touchmove", handleTouchMove)
            window.removeEventListener("touchend", handleTouchEnd)
        }
    }, [resizing, resizeInitialMouseX, resizeInitialWidth])

    return (
        <NodeViewWrapper
            ref={nodeRef}
            className={cn(
                "relative flex flex-col rounded-md border-2 border-transparent transition-all duration-200",
                selected ? "border-blue-300" : "",
                node.attrs.align === "left" && "left-0 -translate-x-0",
                node.attrs.align === "center" && "left-1/2 -translate-x-1/2",
                node.attrs.align === "right" && "left-full -translate-x-full",
            )}
            style={{ width: node.attrs.width }}
        >
            <div className={cn("group relative flex flex-col rounded-md", resizing && "")}>
                <figure className="relative m-0">
                    <img
                        ref={imageRef}
                        src={node.attrs.src}
                        alt={node.attrs.alt}
                        title={node.attrs.title}
                        className="rounded-lg transition-shadow duration-200 hover:shadow-lg"
                        onLoad={(e) => {
                            const img = e.currentTarget
                            const aspectRatio = img.naturalWidth / img.naturalHeight
                            updateAttributes({ aspectRatio })
                        }}
                    />
                    {editor?.isEditable && (
                        <>
                            <div
                                className="absolute inset-y-0 z-20 flex w-[25px] cursor-col-resize items-center justify-start p-2"
                                style={{ left: 0 }}
                                onMouseDown={(event) => {
                                    handleResizingPosition({ e: event, position: "left" })
                                }}
                                onTouchStart={(event) => handleTouchStart(event, "left")}
                            >
                                <div className="z-20 h-[70px] w-1 rounded-xl border bg-[rgba(0,0,0,0.65)] opacity-0 transition-all group-hover:opacity-100" />
                            </div>
                            <div
                                className="absolute inset-y-0 right-0 z-20 flex w-[25px] cursor-col-resize items-center justify-end p-2"
                                onMouseDown={(event) => {
                                    handleResizingPosition({ e: event, position: "right" })
                                }}
                                onTouchStart={(event) => handleTouchStart(event, "right")}
                            >
                                <div className="z-20 h-[70px] w-1 rounded-xl border bg-[rgba(0,0,0,0.65)] opacity-0 transition-all group-hover:opacity-100" />
                            </div>
                            <div className="absolute top-2 right-2 z-20 opacity-0 transition-opacity group-hover:opacity-100">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 bg-white transition-shadow hover:shadow-md dark:bg-gray-950"
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger className="flex items-center">
                                                <AlignLeft className="mr-2 h-4 w-4" />
                                                <span>Alineación</span>
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem
                                                    onClick={() => updateAttributes({ align: "left" })}
                                                    className={node.attrs.align === "left" ? "bg-accent" : ""}
                                                >
                                                    <AlignLeft className="mr-2 h-4 w-4" />
                                                    <span>Izquierda</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => updateAttributes({ align: "center" })}
                                                    className={node.attrs.align === "center" ? "bg-accent" : ""}
                                                >
                                                    <AlignCenter className="mr-2 h-4 w-4" />
                                                    <span>Centro</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => updateAttributes({ align: "right" })}
                                                    className={node.attrs.align === "right" ? "bg-accent" : ""}
                                                >
                                                    <AlignRight className="mr-2 h-4 w-4" />
                                                    <span>Derecha</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>
                                        <DropdownMenuItem onClick={() => setEditingCaption(!editingCaption)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            <span>Editar leyenda</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => updateAttributes({ width: "100%" })}>
                                            <Maximize className="mr-2 h-4 w-4" />
                                            <span>Tamaño completo</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => deleteNode()} className="text-red-600">
                                            <Trash className="mr-2 h-4 w-4" />
                                            <span>Eliminar</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </>
                    )}
                </figure>
                {editingCaption ? (
                    <Input
                        value={caption}
                        onChange={handleCaptionChange}
                        onBlur={handleCaptionBlur}
                        onKeyDown={handleCaptionKeyDown}
                        placeholder="Añadir leyenda..."
                        className="mt-2 bg-transparent text-center text-sm text-muted-foreground"
                        autoFocus
                    />
                ) : (
                    node.attrs.caption && (
                        <figcaption
                            className="mt-2 text-center text-sm text-muted-foreground"
                            onClick={() => editor?.isEditable && setEditingCaption(true)}
                        >
                            {node.attrs.caption}
                        </figcaption>
                    )
                )}
            </div>
        </NodeViewWrapper>
    )
} 