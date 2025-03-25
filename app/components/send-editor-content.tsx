"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { render } from "@react-email/render";
import { NewsletterEmail } from "../emails/newsletter";
import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { extractFirstTitle, extractFirstImage } from "../../lib/editor-utils";
import { Switch } from "@/components/ui/switch";

interface SendEditorContentProps {
    content: string;
}

export function SendEditorContent({ content }: SendEditorContentProps) {
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [url, setUrl] = useState("https://example.com");
    const [subtitle, setSubtitle] = useState("");
    const [showHeader, setShowHeader] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    // Extraer título e imagen del contenido
    const title = extractFirstTitle(content) || "Newsletter at Texas A&M University";
    const imageUrl = extractFirstImage(content) || "";

    const emailHtml = render(
        <NewsletterEmail
            title={title}
            content={content}
            imageUrl={imageUrl}
            url={url}
            subtitle={subtitle}
            showHeader={showHeader}
        />
    );

    const handleSend = async () => {
        if (!email) {
            toast({
                title: "Error",
                description: "Por favor, introduce una dirección de email.",
                variant: "destructive",
            });
            return;
        }

        if (!subject) {
            toast({
                title: "Error",
                description: "Por favor, introduce un asunto para el email.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Llamar a nuestra API para enviar el email
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    subject,
                    html: emailHtml,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al enviar el email');
            }

            toast({
                title: "Email Enviado",
                description: `Email enviado a ${email} correctamente!`,
            });

            setOpen(false);
            setShowPreview(false);
            setEmail("");
            setSubject("");
            setSubtitle("");
        } catch (error) {
            console.error('Error sending email:', error);
            toast({
                title: "Error",
                description: error instanceof Error
                    ? error.message
                    : "No se pudo enviar el email. Por favor, inténtalo de nuevo.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar por Email
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Enviar Contenido por Email</DialogTitle>
                    <DialogDescription>
                        Envía el contenido de tu editor como un email.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Destinatario
                        </Label>
                        <Input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">
                            Asunto
                        </Label>
                        <Input
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Asunto del email"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subtitle" className="text-right">
                            Subtítulo
                        </Label>
                        <Input
                            id="subtitle"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            placeholder="Subtítulo opcional para el email"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="url" className="text-right">
                            URL
                        </Label>
                        <Input
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="showHeader" className="text-right">
                            Mostrar cabecera
                        </Label>
                        <div className="flex items-center space-x-2 col-span-3">
                            <Switch
                                id="showHeader"
                                checked={showHeader}
                                onCheckedChange={setShowHeader}
                            />
                            <Label htmlFor="showHeader" className="text-sm text-muted-foreground">
                                {showHeader ? "Mostrando cabecera con título" : "Solo contenido (sin cabecera)"}
                            </Label>
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex justify-between sm:justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setShowPreview(!showPreview)}
                    >
                        {showPreview ? "Ocultar Vista Previa" : "Ver Vista Previa"}
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSend}
                        disabled={isLoading}
                    >
                        {isLoading ? "Enviando..." : "Enviar Email"}
                    </Button>
                </DialogFooter>

                {showPreview && (
                    <div className="mt-4 border rounded-md overflow-hidden max-h-[300px] overflow-y-auto">
                        <div dangerouslySetInnerHTML={{ __html: emailHtml }} />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
} 