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
import { Send } from "lucide-react";

interface SendEmailDialogProps {
    title: string;
    content: string;
    imageUrl: string;
    url: string;
}

// Simular envío de correo
const sendTestEmail = async (email: string, html: string) => {
    // Simulación de envío (en una app real, esto conectaría con un servicio como Resend, SendGrid, etc.)
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Sending email to ${email} with HTML content:`, html);
            resolve({ success: true });
        }, 1500);
    });
};

export function SendEmailDialog({ title, content, imageUrl, url }: SendEmailDialogProps) {
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSend = async () => {
        if (!email) {
            toast({
                title: "Error",
                description: "Please enter an email address.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const html = render(
                <NewsletterEmail
                    title={title}
                    content={content}
                    imageUrl={imageUrl}
                    url={url}
                />
            );

            await sendTestEmail(email, html);

            toast({
                title: "Email Sent",
                description: `Test email sent to ${email} successfully!`,
            });

            setOpen(false);
            setEmail("");
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send the test email. Please try again.",
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
                    <Send className="w-4 h-4 mr-2" />
                    Send Test Email
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Send Test Email</DialogTitle>
                    <DialogDescription>
                        Send a test email to verify how your newsletter looks in an email
                        client.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={handleSend}
                        disabled={isLoading}
                    >
                        {isLoading ? "Sending..." : "Send Test Email"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 