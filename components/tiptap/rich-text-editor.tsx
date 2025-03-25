"use client"

import "./tiptap.css"
import { cn } from "@/lib/utils"
import { ImageExtension } from "@/components/tiptap/extensions/image"
import { ImagePlaceholder } from "@/components/tiptap/extensions/image-placeholder"
import SearchAndReplace from "./extensions/search-and-replace"
import { Color } from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import TextAlign from "@tiptap/extension-text-align"
import TextStyle from "@tiptap/extension-text-style"
import Typography from "@tiptap/extension-typography"
import Underline from "@tiptap/extension-underline"
import { EditorContent, type Extension, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { TipTapFloatingMenu } from "@/components/tiptap/extensions/floating-menu"
import { FloatingToolbar } from "@/components/tiptap/extensions/floating-toolbar"
import { EditorToolbar } from "./toolbars/editor-toolbar"
import Placeholder from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import { useEffect } from "react"

const defaultContent = `
<h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Japanese Ship Pioneers At-Sea Green Hydrogen Production</h1>
<img src="https://images.unsplash.com/photo-1534294228306-bd54eb9a7ba8?q=80&w=1000&auto=format&fit=crop" 
     alt="Newsletter header" 
     style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 24px;">
<p>Mitsui O.S.K. Lines (MOL) has achieved a global milestone by successfully producing green hydrogen offshore using its innovative Winz Maru vessel and delivering it to land for energy applications. This marks the first-ever offshore production and transportation of green hydrogen, advancing sustainable energy innovation.</p>
<h2>Key Points:</h2>
<ul>
  <li>The Winz Maru uses wind power and underwater turbines to generate electricity and convert seawater into green hydrogen</li>
  <li>The vessel plans to produce approximately 200 liters of MCH in 2025</li>
  <li>Demonstrations in Omura Bay since 2023 have validated this process</li>
</ul>
<h2>Why It Matters:</h2>
<p>This pioneering development signifies a critical step in the global shift towards renewable energy.</p>`;

export interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

export function RichTextEditor({
    value,
    onChange,
    className,
    placeholder = "Write, type '/' for commands",
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                bulletList: {
                    HTMLAttributes: {
                        class: "list-disc",
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: "list-decimal",
                    },
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primary underline underline-offset-4",
                },
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "rounded-md mx-auto",
                },
            }),
            TextStyle,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            Superscript,
            Subscript,
            ImageExtension,
            ImagePlaceholder,
            HorizontalRule,
            SearchAndReplace,
            Placeholder.configure({
                emptyNodeClass: "is-editor-empty",
                placeholder: ({ node }) => {
                    switch (node.type.name) {
                        case "heading":
                            return `Heading ${node.attrs.level}`;
                        case "codeBlock":
                            return "";
                        default:
                            return placeholder;
                    }
                },
                includeChildren: false,
            }),
            Typography,
        ],
        content: value || defaultContent,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class:
                    "prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert focus:outline-none max-w-full tiptap",
            },
        },
    })

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || defaultContent)
        }
    }, [editor, value])

    if (!editor) return null

    return (
        <div className={cn("relative flex flex-col min-h-[500px]", className)}>
            {editor && <EditorToolbar editor={editor} />}
            <div className="flex-1 border rounded-md">
                <FloatingToolbar editor={editor} />
                <TipTapFloatingMenu editor={editor} />
                <EditorContent
                    editor={editor}
                    className="h-full px-4 py-3"
                />
            </div>
        </div>
    )
} 