"use client"

import { createContext, useContext } from "react"
import type { Editor } from "@tiptap/core"

interface ToolbarContextType {
    editor: Editor
}

const ToolbarContext = createContext<ToolbarContextType | null>(null)

export function ToolbarProvider({
    editor,
    children,
}: {
    editor: Editor
    children: React.ReactNode
}) {
    return (
        <ToolbarContext.Provider value={{ editor }}>
            {children}
        </ToolbarContext.Provider>
    )
}

export function useToolbar() {
    const context = useContext(ToolbarContext)

    if (!context) {
        throw new Error("useToolbar must be used within a ToolbarProvider")
    }

    return context
} 