"use client";

import React, { useRef, useState, useEffect } from 'react';
import EmailEditor, { EditorRef, EmailEditorProps, UnlayerDesign, ExportData } from 'react-email-editor';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, Download, Upload, Mail, Users } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { SendEmailDialog } from "./send-email-dialog";
import Link from "next/link";
import juice from 'juice';

interface UnlayerEmailEditorProps {
    onSave?: (html: string, design: any) => void;
    onSend?: (html: string, design: any) => void;
    initialDesign?: any;
}

export function UnlayerEmailEditor({ onSave, onSend, initialDesign }: UnlayerEmailEditorProps) {
    const emailEditorRef = useRef<EditorRef>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [html, setHtml] = useState<string>("");
    const [design, setDesign] = useState<any>(null);
    const [title, setTitle] = useState<string>("Newsletter");

    useEffect(() => {
        // Load initial design if it exists
        if (initialDesign && emailEditorRef.current?.editor) {
            emailEditorRef.current.editor.loadDesign(initialDesign);
        }
    }, [initialDesign, emailEditorRef.current?.editor]);

    const exportHtml = () => {
        if (emailEditorRef.current?.editor) {
            emailEditorRef.current.editor.exportHtml((data) => {
                const { design: exportedDesign, html: exportedHtml } = data;
                setHtml(exportedHtml);
                setDesign(exportedDesign);
                return { html: exportedHtml, design: exportedDesign };
            });
        }
    };

    const handleSave = () => {
        if (emailEditorRef.current?.editor) {
            emailEditorRef.current.editor.exportHtml((data) => {
                const { design: exportedDesign, html: exportedHtml } = data;
                setHtml(exportedHtml);
                setDesign(exportedDesign);

                if (onSave) {
                    onSave(exportedHtml, exportedDesign);
                    toast({
                        title: "Newsletter saved",
                        description: "Your newsletter has been saved successfully"
                    });
                }
            });
        }
    };

    // Function to export the design as a JSON file
    const handleExportDesign = () => {
        if (emailEditorRef.current?.editor) {
            emailEditorRef.current.editor.saveDesign((design) => {
                const fileName = `${title.replace(/\s+/g, '-').toLowerCase()}-design.json`;
                const json = JSON.stringify(design);
                const blob = new Blob([json], { type: 'application/json' });
                const href = URL.createObjectURL(blob);

                // Create download link
                const link = document.createElement('a');
                link.href = href;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();

                // Cleanup
                document.body.removeChild(link);
                URL.revokeObjectURL(href);

                toast({
                    title: "Design exported",
                    description: `Saved as ${fileName}`
                });
            });
        }
    };

    // Function to load the file input when clicking the import button
    const handleImportClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Function to handle importing the design from a JSON file
    const handleImportDesign = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const designJSON = JSON.parse(e.target?.result as string);

                if (emailEditorRef.current?.editor) {
                    emailEditorRef.current.editor.loadDesign(designJSON);

                    toast({
                        title: "Design imported",
                        description: "The newsletter design has been imported successfully"
                    });
                }
            } catch (error) {
                console.error("Error importing design:", error);
                toast({
                    title: "Import failed",
                    description: "The file is not a valid newsletter design",
                    variant: "destructive"
                });
            }
        };

        reader.readAsText(file);

        // Clear the input to allow uploading the same file again
        if (event.target) {
            event.target.value = '';
        }
    };

    const handleSendEmail = async (recipients: string[]) => {
        if (!html) {
            // If HTML is not ready, export it first
            if (emailEditorRef.current?.editor) {
                emailEditorRef.current.editor.exportHtml(async (data) => {
                    const { design: exportedDesign, html: exportedHtml } = data;
                    setHtml(exportedHtml);
                    setDesign(exportedDesign);
                    await sendEmail(exportedHtml, recipients);
                });
            } else {
                throw new Error("No content to send. Please design your newsletter first.");
            }
        } else {
            // If we already have the HTML, send it directly
            await sendEmail(html, recipients);
        }
    };

    const sendEmail = async (htmlContent: string, recipients: string[]) => {
        try {
            // 1. Reemplazar las referencias a Montserrat con fuentes fallback adecuadas
            const htmlWithFallbacks = htmlContent.replace(
                /font-family:\s*['"]Montserrat['"],\s*sans-serif/gi,
                "font-family: 'Montserrat', Arial, 'Helvetica Neue', Helvetica, sans-serif"
            );

            // Reemplazo para otras fuentes populares que podrían estar siendo usadas
            const htmlWithAllFallbacks = htmlWithFallbacks
                .replace(
                    /font-family:\s*['"]Open Sans['"],\s*sans-serif/gi,
                    "font-family: 'Open Sans', Arial, 'Helvetica Neue', Helvetica, sans-serif"
                )
                .replace(
                    /font-family:\s*['"]Lato['"],\s*sans-serif/gi,
                    "font-family: 'Lato', 'Helvetica Neue', Arial, Helvetica, sans-serif"
                )
                .replace(
                    /font-family:\s*['"]Raleway['"],\s*sans-serif/gi,
                    "font-family: 'Raleway', 'Helvetica Neue', Arial, Helvetica, sans-serif"
                );

            // 2. Convertir CSS a inline (mejora significativamente la compatibilidad)
            const processedHtml = juice(htmlWithAllFallbacks, {
                removeStyleTags: false,
                preserveImportant: true,
                preserveMediaQueries: true,
                preserveFontFaces: true
            });

            // 3. Añadir aviso de fuentes web para Gmail que soporta <link> en el head
            const finalHtml = processedHtml.replace(
                '</head>',
                `<link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet">
                <style>
                    /* Fallback para clientes que ignoran CSS externo pero procesan style tags */
                    @import url('https://fonts.googleapis.com/css?family=Montserrat:400,700');
                </style>
                </head>`
            );

            // 4. Enviar el HTML procesado
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    html: finalHtml,
                    subject: title || 'Newsletter',
                    recipients: recipients,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || result.details || 'Error sending email');
            }

            // Notify the parent component if callback exists
            if (onSend) {
                onSend(htmlContent, design);
            }

            console.log('Email sent successfully:', result);
            return result;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    };

    const onReady: EmailEditorProps['onReady'] = (unlayer) => {
        // Extract newsletter title if available
        unlayer.addEventListener('design:updated', () => {
            unlayer.exportHtml((data: ExportData) => {
                const { design: updatedDesign } = data;

                if (updatedDesign?.counters?.u_column && updatedDesign.counters.u_column > 0) {
                    // Try to extract title from design
                    try {
                        if (updatedDesign.body && updatedDesign.body.rows && updatedDesign.body.rows.length > 0) {
                            const firstBlock = updatedDesign.body.rows[0];
                            // Verify that properties exist and have the correct type
                            if (firstBlock?.cells &&
                                Array.isArray(firstBlock.cells) &&
                                firstBlock.cells[0] &&
                                typeof firstBlock.cells[0] === 'object' &&
                                'elements' in firstBlock.cells[0] &&
                                Array.isArray(firstBlock.cells[0].elements) &&
                                firstBlock.cells[0].elements[0] &&
                                typeof firstBlock.cells[0].elements[0] === 'object' &&
                                'content' in firstBlock.cells[0].elements[0] &&
                                firstBlock.cells[0].elements[0].content &&
                                typeof firstBlock.cells[0].elements[0].content === 'object' &&
                                'text' in firstBlock.cells[0].elements[0].content) {

                                const text = firstBlock.cells[0].elements[0].content.text;
                                if (text) {
                                    // Extract plain text from HTML
                                    const div = document.createElement('div');
                                    div.innerHTML = text;
                                    const extractedTitle = div.textContent || "";
                                    if (extractedTitle) {
                                        setTitle(extractedTitle.substring(0, 50));
                                    }
                                }
                            }
                        }
                    } catch (e) {
                        console.log('Could not extract title', e);
                    }
                }
            });
        });

        // Load initial design if it exists
        if (initialDesign) {
            unlayer.loadDesign(initialDesign);
        }
    };

    const editorOptions = {
        appearance: {
            theme: 'light' as const,
            panels: {
                tools: {
                    dock: 'left' as 'left'
                }
            }
        },
        projectId: 1234, // Replace with your projectId if you have one
        tools: {
            // You can customize available tools
        },
        customCSS: [
            `body { font-family: 'Poppins', sans-serif; }`,
            `.blockbuilder-preferences-tabs button { color: #333; background-color: #f8f9fa; }`,
            `.blockbuilder-preferences-tabs button.active { color: #4F46E5; background-color: #ffffff; }`,
        ]
    };

    return (
        <div className="w-full space-y-6 pt-4">
            {/* Main header with description */}
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Newsletter</h1>
                    <p className="text-muted-foreground">
                        Create and send newsletters to your subscribers with this drag-and-drop visual editor.
                    </p>
                </div>

            </div>

            {/* Editor Card with Header and Content */}
            <Card className="border rounded-md overflow-hidden">
                {/* Card Header with buttons */}
                <div className="border-b p-4 bg-muted/30">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <h2 className="text-xl font-semibold">Email Newsletter Editor</h2>

                        <div className="flex flex-wrap items-center gap-2">
                            {/* Hidden file input for importing designs */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleImportDesign}
                                style={{ display: 'none' }}
                            />

                            {/* Secondary buttons group */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleImportClick}
                                    className="flex items-center gap-1.5"
                                >
                                    <Upload className="h-4 w-4" />
                                    Import
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleExportDesign}
                                    className="flex items-center gap-1.5"
                                >
                                    <Download className="h-4 w-4" />
                                    Export
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSave}
                                    className="flex items-center gap-1.5"
                                >
                                    <Save className="h-4 w-4" />
                                    Save
                                </Button>
                            </div>

                            {/* Main featured button */}
                            <SendEmailDialog
                                htmlContent={html}
                                subject={title}
                                onSend={handleSendEmail}
                            />
                        </div>
                    </div>
                </div>

                {/* The editor itself */}
                <div className="p-0">
                    <div style={{ height: '70vh' }}>
                        <EmailEditor
                            ref={emailEditorRef}
                            onReady={onReady}
                            options={editorOptions}
                            minHeight="70vh"
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
} 