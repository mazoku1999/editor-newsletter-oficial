"use client"

import { useEffect, useState } from "react"
import { Search, ChevronUpSquare, ChevronDownSquare, X, Replace, RotateCw } from "lucide-react"
import { Editor } from "@tiptap/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function SearchAndReplaceToolbar({ editor }: { editor: Editor }) {
    const [searchText, setSearchText] = useState("")
    const [replaceText, setReplaceText] = useState("")
    const [caseSensitive, setCaseSensitive] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleSearch = () => {
        editor.commands.setSearchTerm(searchText)
        editor.commands.find()
    }

    const handleReplace = () => {
        if (!editor.isActive("search")) {
            return
        }

        editor.commands.setReplaceTerm(replaceText)
        editor.commands.replace()
        editor.commands.find()
    }

    const handleReplaceAll = () => {
        if (!searchText) {
            return
        }

        editor.commands.setSearchTerm(searchText)
        editor.commands.setReplaceTerm(replaceText)
        editor.commands.replaceAll()
    }

    const handleCaseSensitiveToggle = () => {
        setCaseSensitive(!caseSensitive)
        editor.commands.setCaseSensitive(!caseSensitive)
        if (searchText) {
            editor.commands.find()
        }
    }

    const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value)
        editor.commands.setSearchTerm(e.target.value)
        if (e.target.value) {
            editor.commands.find()
        }
    }

    const handleReplaceTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReplaceText(e.target.value)
        editor.commands.setReplaceTerm(e.target.value)
    }

    const handleClearSearch = () => {
        setSearchText("")
        editor.commands.setSearchTerm("")
    }

    useEffect(() => {
        // Define CSS para destacar las búsquedas
        const style = document.createElement("style")
        style.textContent = `
      .search-result {
        background-color: rgba(255, 213, 0, 0.4);
        border-radius: 0.125rem;
      }
    `
        document.head.appendChild(style)

        return () => {
            document.head.removeChild(style)
        }
    }, [])

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 border rounded-full"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <Search className="h-4 w-4" />
                            <span className="sr-only">Buscar y reemplazar</span>
                        </Button>
                    </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">Buscar y reemplazar</TooltipContent>
            </Tooltip>
            <PopoverContent side="bottom" align="end" className="w-80">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="search">Buscar</Label>
                            <div className="ml-auto flex items-center gap-1">
                                <Toggle
                                    size="sm"
                                    aria-label="Distinguir mayúsculas y minúsculas"
                                    className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                                    pressed={caseSensitive}
                                    onPressedChange={handleCaseSensitiveToggle}
                                >
                                    Aa
                                </Toggle>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Input
                                    id="search"
                                    placeholder="Buscar texto..."
                                    className="pr-8"
                                    value={searchText}
                                    onChange={handleSearchTextChange}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleSearch()
                                        }
                                    }}
                                />
                                {searchText && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full aspect-square p-0"
                                        onClick={handleClearSearch}
                                    >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Borrar búsqueda</span>
                                    </Button>
                                )}
                            </div>
                            <div className="flex gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={handleSearch}
                                            disabled={!searchText}
                                        >
                                            <RotateCw className="h-4 w-4" />
                                            <span className="sr-only">Volver a buscar</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Volver a buscar</TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Replace className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="replace">Reemplazar</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                id="replace"
                                placeholder="Reemplazar con..."
                                value={replaceText}
                                onChange={handleReplaceTextChange}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleReplace()
                                    }
                                }}
                            />
                            <div className="flex gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleReplace}
                                            disabled={!searchText}
                                        >
                                            Reemplazar
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Reemplazar la selección actual</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleReplaceAll}
                                            disabled={!searchText}
                                        >
                                            Reemplazar todo
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Reemplazar todas las coincidencias</TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
} 