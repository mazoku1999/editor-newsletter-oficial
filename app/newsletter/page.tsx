"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { UnlayerEmailEditor } from "@/components/email-editor/email-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";

export default function NewsletterPage() {
    const [lastSavedDesign, setLastSavedDesign] = useState<any>(null);
    const [defaultTemplate, setDefaultTemplate] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Cargar la plantilla predeterminada al inicializar
    useEffect(() => {
        async function loadDefaultTemplate() {
            try {
                const response = await fetch('/templates/default-template.json');
                if (!response.ok) {
                    throw new Error(`Error cargando plantilla: ${response.status}`);
                }
                const templateData = await response.json();
                setDefaultTemplate(templateData);
                console.log("Plantilla cargada correctamente");
            } catch (error) {
                console.error("Error al cargar la plantilla:", error);
                toast({
                    title: "Error al cargar plantilla",
                    description: "No se pudo cargar la plantilla predeterminada.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        }

        loadDefaultTemplate();
    }, []);

    const handleSave = (html: string, design: any) => {
        setLastSavedDesign(design);
        // Aquí podrías guardar el diseño en una base de datos
        console.log("Diseño guardado:", design);
        toast({
            title: "Newsletter guardado",
            description: "Tu newsletter ha sido guardado exitosamente.",
        });
    };

    const handleSend = (html: string, design: any) => {
        // Aquí podrías implementar la lógica para enviar el newsletter
        console.log("Enviando newsletter:", html);
        toast({
            title: "Newsletter enviado",
            description: "Tu newsletter ha sido enviado exitosamente a todos los suscriptores.",
        });
    };

    // Determinar qué diseño usar: el último guardado o la plantilla predeterminada
    const initialDesign = lastSavedDesign || defaultTemplate;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <Card>
                    <CardContent className="p-4">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-[70vh]">
                                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                                <p className="text-lg text-muted-foreground">Cargando plantilla...</p>
                            </div>
                        ) : (
                            <UnlayerEmailEditor
                                onSave={handleSave}
                                onSend={handleSend}
                                initialDesign={initialDesign}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
            <Toaster />
        </DashboardLayout>
    );
} 