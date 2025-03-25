"use client"

import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { Decoration, DecorationSet } from "@tiptap/pm/view"

export interface SearchAndReplaceOptions {
    searchResultClass: string
    findText: string
    replaceText: string
    caseSensitive: boolean
}

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        search: {
            setSearchTerm: (searchTerm: string) => ReturnType
            setReplaceTerm: (replaceTerm: string) => ReturnType
            find: () => ReturnType
            replace: () => ReturnType
            replaceAll: () => ReturnType
            setCaseSensitive: (value: boolean) => ReturnType
        }
    }
}

const SearchAndReplace = Extension.create<SearchAndReplaceOptions>({
    name: "search",

    addOptions() {
        return {
            searchResultClass: "search-result",
            findText: "",
            replaceText: "",
            caseSensitive: false,
        }
    },

    addCommands() {
        return {
            setSearchTerm:
                (findText) =>
                    ({ editor }) => {
                        editor.storage.search.findText = findText
                        this.options.findText = findText
                        editor.view.dispatch(editor.state.tr)
                        return true
                    },
            setReplaceTerm:
                (replaceText) =>
                    ({ editor }) => {
                        editor.storage.search.replaceText = replaceText
                        this.options.replaceText = replaceText
                        return true
                    },
            find:
                () =>
                    ({ editor }) => {
                        const { state, dispatch } = editor.view
                        const { doc } = state
                        const { findText, caseSensitive } = editor.storage.search
                        const decorations: Decoration[] = []
                        const regex = caseSensitive ? new RegExp(findText, "g") : new RegExp(findText, "gi")

                        doc.descendants((node, pos) => {
                            if (!node.isText) return

                            const { text } = node
                            let match

                            if (text) {
                                while ((match = regex.exec(text)) !== null) {
                                    const start = pos + match.index
                                    const end = start + match[0].length

                                    decorations.push(
                                        Decoration.inline(start, end, {
                                            class: this.options.searchResultClass,
                                        })
                                    )
                                }
                            }
                        })

                        dispatch(state.tr.setMeta("search", { decorations }))
                        return true
                    },
            replace:
                () =>
                    ({ editor }) => {
                        const { state, dispatch } = editor.view
                        const { findText, replaceText, caseSensitive } = editor.storage.search
                        const regex = caseSensitive ? new RegExp(findText) : new RegExp(findText, "i")
                        const { tr } = state
                        const { selection } = tr
                        const { from, to } = selection
                        const selectedText = state.doc.textBetween(from, to)

                        if (regex.test(selectedText)) {
                            tr.insertText(replaceText, from, to)
                            dispatch(tr)
                            return true
                        }

                        return false
                    },
            replaceAll:
                () =>
                    ({ editor }) => {
                        const { state, dispatch } = editor.view
                        const { findText, replaceText, caseSensitive } = editor.storage.search
                        const regex = caseSensitive ? new RegExp(findText, "g") : new RegExp(findText, "gi")
                        const { tr } = state
                        const { doc } = tr

                        const textReplacements: { from: number; to: number; text: string }[] = []

                        doc.descendants((node, pos) => {
                            if (!node.isText) return

                            const { text } = node
                            let match
                            if (text) {
                                while ((match = regex.exec(text)) !== null) {
                                    const from = pos + match.index
                                    const to = from + match[0].length
                                    textReplacements.push({ from, to, text: replaceText })
                                }
                            }
                        })

                        for (let i = textReplacements.length - 1; i >= 0; i--) {
                            const { from, to, text } = textReplacements[i]
                            tr.insertText(text, from, to)
                        }

                        dispatch(tr)
                        return true
                    },
            setCaseSensitive:
                (value) =>
                    ({ editor }) => {
                        editor.storage.search.caseSensitive = value
                        this.options.caseSensitive = value
                        return true
                    },
        }
    },

    addStorage() {
        return {
            findText: this.options.findText,
            replaceText: this.options.replaceText,
            caseSensitive: this.options.caseSensitive,
        }
    },

    addProseMirrorPlugins() {
        const key = new PluginKey("search-and-replace")

        return [
            new Plugin({
                key,
                state: {
                    init() {
                        return DecorationSet.empty
                    },
                    apply(tr, searchDecorations) {
                        searchDecorations = searchDecorations.map(tr.mapping, tr.doc)
                        const meta = tr.getMeta("search")
                        if (meta) {
                            const { decorations } = meta
                            if (decorations) {
                                return DecorationSet.create(tr.doc, decorations)
                            }
                        }
                        return searchDecorations
                    },
                },
                props: {
                    decorations(state) {
                        return key.getState(state)
                    },
                },
            }),
        ]
    },
})

export default SearchAndReplace 