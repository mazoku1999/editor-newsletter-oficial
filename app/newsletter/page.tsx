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

    // Load the default template on initialization
    useEffect(() => {
        async function loadDefaultTemplate() {
            try {
                const response = await fetch('/templates/default-template.json');
                if (!response.ok) {
                    throw new Error(`Error loading template: ${response.status}`);
                }
                const templateData = await response.json();
                setDefaultTemplate(templateData);
                console.log("Template loaded successfully");
            } catch (error) {
                console.error("Error loading template:", error);
                toast({
                    title: "Error loading template",
                    description: "Could not load the default template.",
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
        // Here you could save the design to a database
        console.log("Design saved:", design);
        toast({
            title: "Newsletter saved",
            description: "Your newsletter has been saved successfully.",
        });
    };

    const handleSend = (html: string, design: any) => {
        // Here you could implement the logic to send the newsletter
        console.log("Sending newsletter:", html);
        toast({
            title: "Newsletter sent",
            description: "Your newsletter has been sent successfully to all subscribers.",
        });
    };

    // Determine which design to use: the last saved one or the default template
    const initialDesign = lastSavedDesign || defaultTemplate;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <Card>
                    <CardContent className="p-4">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-[70vh]">
                                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                                <p className="text-lg text-muted-foreground">Loading template...</p>
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