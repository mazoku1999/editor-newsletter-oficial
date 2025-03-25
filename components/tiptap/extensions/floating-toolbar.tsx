"use client"

import { BubbleMenu, type Editor } from "@tiptap/react"
import { ToolbarProvider } from "../toolbars/toolbar-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useMediaQuery } from "@/hooks/use-media-querry"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { LinkToolbar } from "../toolbars/link"
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Link2Off,
    Code,
    ImageIcon,
    TextQuote,
    ListOrdered,
    List,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Heading1,
    Heading2,
    Highlighter,
    Palette,
} from "lucide-react"
import { useEffect } from "react"

export function FloatingToolbar({ editor }: { editor: Editor | null }) {
    if (!editor) {
        return null
    }

    const isMobile = useMediaQuery("(max-width: 640px)")

    const unsetLink = () => {
        if (editor.isActive('link')) {
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
        }
    }

    const addImage = () => {
        const url = window.prompt("URL de la imagen")
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    return (
        <TooltipProvider>
            <BubbleMenu
                editor={editor}
                className="z-50 bg-background rounded-md border shadow-md overflow-hidden"
                tippyOptions={{
                    duration: 100,
                    placement: "top",
                }}
            >
                <ToolbarProvider editor={editor}>
                    <ScrollArea className="h-fit py-0.5">
                        <div className="flex items-center px-1.5 gap-0.5">
                            <div className="flex items-center gap-0.5 p-1">
                                {/* Formato básico */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => editor.chain().focus().toggleBold().run()}
                                            className={cn("h-8 w-8", editor.isActive("bold") && "bg-accent")}
                                        >
                                            <Bold className="h-4 w-4" />
                                            <span className="sr-only">Negrita</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Negrita</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => editor.chain().focus().toggleItalic().run()}
                                            className={cn("h-8 w-8", editor.isActive("italic") && "bg-accent")}
                                        >
                                            <Italic className="h-4 w-4" />
                                            <span className="sr-only">Cursiva</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Cursiva</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                                            className={cn("h-8 w-8", editor.isActive("underline") && "bg-accent")}
                                        >
                                            <Underline className="h-4 w-4" />
                                            <span className="sr-only">Subrayado</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Subrayado</TooltipContent>
                                </Tooltip>

                                <Separator orientation="vertical" className="h-6 mx-1" />

                                {/* Encabezados */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                            className={cn("h-8 w-8", editor.isActive("heading", { level: 1 }) && "bg-accent")}
                                        >
                                            <Heading1 className="h-4 w-4" />
                                            <span className="sr-only">Título 1</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Título 1</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                            className={cn("h-8 w-8", editor.isActive("heading", { level: 2 }) && "bg-accent")}
                                        >
                                            <Heading2 className="h-4 w-4" />
                                            <span className="sr-only">Título 2</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Título 2</TooltipContent>
                                </Tooltip>

                                <Separator orientation="vertical" className="h-6 mx-1" />

                                {/* Listas */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                                            className={cn("h-8 w-8", editor.isActive("bulletList") && "bg-accent")}
                                        >
                                            <List className="h-4 w-4" />
                                            <span className="sr-only">Lista de viñetas</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Lista de viñetas</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                            className={cn("h-8 w-8", editor.isActive("orderedList") && "bg-accent")}
                                        >
                                            <ListOrdered className="h-4 w-4" />
                                            <span className="sr-only">Lista numerada</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Lista numerada</TooltipContent>
                                </Tooltip>

                                <Separator orientation="vertical" className="h-6 mx-1" />

                                {/* Enlaces */}
                                <LinkToolbar />

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={unsetLink}
                                            disabled={!editor.isActive("link")}
                                            className="h-8 w-8"
                                        >
                                            <Link2Off className="h-4 w-4" />
                                            <span className="sr-only">Quitar enlace</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Quitar enlace</TooltipContent>
                                </Tooltip>


                            </div>
                        </div>
                        <ScrollBar className="h-0.5" orientation="horizontal" />
                    </ScrollArea>
                </ToolbarProvider>
            </BubbleMenu>
        </TooltipProvider>
    )
} 