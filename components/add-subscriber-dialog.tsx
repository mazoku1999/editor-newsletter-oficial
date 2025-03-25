"use client";

import { useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AddSubscriberDialogProps {
    onSuccess?: () => void;
}

export function AddSubscriberDialog({ onSuccess }: AddSubscriberDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const nombreInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setNombre("");
        setEmail("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validations
        if (!nombre.trim()) {
            toast({
                title: "Name required",
                description: "Please enter the subscriber's name",
                variant: "destructive"
            });
            nombreInputRef.current?.focus();
            return;
        }

        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast({
                title: "Invalid email",
                description: "Please enter a valid email",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/subscribers/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: nombre.trim(),
                    email: email.trim()
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error adding the subscriber');
            }

            toast({
                title: "Subscriber added",
                description: "The subscriber has been added successfully"
            });

            resetForm();
            setOpen(false);

            // Call the callback if it exists
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error adding subscriber:', error);
            toast({
                title: "Error",
                description: error instanceof Error
                    ? error.message
                    : "An error occurred while adding the subscriber",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            setOpen(newOpen);
            if (!newOpen) resetForm();
        }}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Subscriber</DialogTitle>
                    <DialogDescription>
                        Enter the new subscriber's details to add them to your list.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="nombre">Name</Label>
                        <Input
                            id="nombre"
                            ref={nombreInputRef}
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="John Doe"
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            disabled={loading}
                        />
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Subscriber"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 