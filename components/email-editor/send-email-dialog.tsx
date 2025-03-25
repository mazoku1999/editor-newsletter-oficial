"use client";

import { useState, useEffect } from "react";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Define the interface for a subscriber
interface Subscriber {
    Id: number;
    Nombre: string;
    Email: string;
    Status: string;
    Fecha_Alta: string;
}

interface SendEmailDialogProps {
    htmlContent: string;
    subject: string;
    onSend: (recipients: string[]) => Promise<void>;
}

export function SendEmailDialog({ htmlContent, subject, onSend }: SendEmailDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedSubscribers, setSelectedSubscribers] = useState<number[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load subscribers when the dialog opens
    useEffect(() => {
        if (open) {
            fetchSubscribers();
        }
    }, [open]);

    // Function to get subscribers from the API
    const fetchSubscribers = async () => {
        setLoading(true);
        setError(null);

        try {
            // Get only active subscribers
            const response = await fetch('/api/subscribers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    activeOnly: true
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error getting subscribers');
            }

            if (data.success && Array.isArray(data.subscribers)) {
                setSubscribers(data.subscribers);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching subscribers:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
            toast({
                title: "Error loading subscribers",
                description: error instanceof Error ? error.message : 'Unknown error',
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredSubscribers = subscribers.filter(
        subscriber =>
            subscriber.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subscriber.Email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectAll = () => {
        if (selectedSubscribers.length === filteredSubscribers.length) {
            setSelectedSubscribers([]);
        } else {
            setSelectedSubscribers(filteredSubscribers.map(subscriber => subscriber.Id));
        }
    };

    const handleSelectSubscriber = (subscriberId: number) => {
        setSelectedSubscribers(prev =>
            prev.includes(subscriberId)
                ? prev.filter(id => id !== subscriberId)
                : [...prev, subscriberId]
        );
    };

    const handleSendEmail = async () => {
        if (selectedSubscribers.length === 0) {
            toast({
                title: "No recipients selected",
                description: "Please select at least one recipient to send the email",
                variant: "destructive"
            });
            return;
        }

        setIsSending(true);

        try {
            const recipients = selectedSubscribers
                .map(id => {
                    const subscriber = subscribers.find(s => s.Id === id);
                    return subscriber ? subscriber.Email : null;
                })
                .filter(Boolean) as string[];

            await onSend(recipients);

            toast({
                title: "Email sent successfully",
                description: `Newsletter sent to ${recipients.length} recipients`
            });

            setOpen(false);
            setSelectedSubscribers([]);
        } catch (error) {
            toast({
                title: "Failed to send email",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive"
            });
        } finally {
            setIsSending(false);
        }
    };

    const renderSubscribersList = () => {
        if (loading) {
            return (
                <TableRow>
                    <TableCell colSpan={3} className="text-center py-16">
                        <div className="flex flex-col items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                            <span>Loading subscribers...</span>
                        </div>
                    </TableCell>
                </TableRow>
            );
        }

        if (error) {
            return (
                <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-destructive">
                        <div className="flex flex-col items-center justify-center">
                            <span className="font-semibold">Error loading subscribers</span>
                            <span className="text-sm">{error}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={fetchSubscribers}
                            >
                                Retry
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>
            );
        }

        if (filteredSubscribers.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                        {searchTerm
                            ? "No subscribers found matching your search"
                            : "No active subscribers available"}
                    </TableCell>
                </TableRow>
            );
        }

        return filteredSubscribers.map((subscriber) => (
            <TableRow key={subscriber.Id}>
                <TableCell>
                    <Checkbox
                        checked={selectedSubscribers.includes(subscriber.Id)}
                        onCheckedChange={() => handleSelectSubscriber(subscriber.Id)}
                        aria-label={`Select ${subscriber.Nombre}`}
                    />
                </TableCell>
                <TableCell>{subscriber.Nombre}</TableCell>
                <TableCell>{subscriber.Email}</TableCell>
            </TableRow>
        ));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Send Newsletter</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Send Newsletter</DialogTitle>
                    <DialogDescription>
                        Select the subscribers you want to send this newsletter to.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative mb-4">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search subscribers..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={
                                            filteredSubscribers.length > 0 &&
                                            selectedSubscribers.length === filteredSubscribers.length
                                        }
                                        onCheckedChange={handleSelectAll}
                                        aria-label="Select all"
                                    />
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {renderSubscribersList()}
                        </TableBody>
                    </Table>
                </div>

                <DialogFooter className="mt-4 gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleSendEmail}
                        disabled={selectedSubscribers.length === 0 || isSending}
                    >
                        {isSending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            `Send to ${selectedSubscribers.length} recipient${selectedSubscribers.length !== 1 ? 's' : ''}`
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 