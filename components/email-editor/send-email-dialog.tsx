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
import { Search, Loader2, Plus, Mail } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define the interface for a subscriber
interface Subscriber {
    Id: number;
    Name: string;
    Email: string;
    Status: string;
    JoinDate: string;
}

// Interface for temporary non-subscribed recipients
interface TempRecipient {
    id: string;
    email: string;
}

interface SendEmailDialogProps {
    htmlContent: string;
    subject: string;
    onSend: (recipients: string[]) => Promise<void>;
}

export function SendEmailDialog({ htmlContent, subject, onSend }: SendEmailDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedSubscribers, setSelectedSubscribers] = useState<number[]>([]);
    const [tempRecipients, setTempRecipients] = useState<TempRecipient[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load subscribers when the dialog opens
    useEffect(() => {
        if (open) {
            fetchSubscribers();
            // Clear temp recipients when dialog opens
            setTempRecipients([]);
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
                // Map the Spanish field names to English field names
                const mappedSubscribers = data.subscribers.map((sub: any) => ({
                    Id: sub.Id,
                    Name: sub.Nombre,
                    Email: sub.Email,
                    Status: sub.Status,
                    JoinDate: sub.Fecha_Alta
                }));
                setSubscribers(mappedSubscribers);
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

    // Helper function to validate email format
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Check if the search term is a valid email that doesn't exist in subscribers
    const isNewValidEmail = isValidEmail(searchTerm) &&
        !subscribers.some(sub => sub.Email.toLowerCase() === searchTerm.toLowerCase()) &&
        !tempRecipients.some(temp => temp.email.toLowerCase() === searchTerm.toLowerCase());

    const filteredSubscribers = subscribers.filter(
        subscriber =>
            subscriber.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subscriber.Email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Add a temporary recipient
    const addTempRecipient = () => {
        if (isValidEmail(searchTerm)) {
            const newTempRecipient: TempRecipient = {
                id: `temp-${Date.now()}`,
                email: searchTerm
            };
            setTempRecipients([...tempRecipients, newTempRecipient]);
            setSearchTerm(''); // Clear search term after adding
            toast({
                title: "Recipient added",
                description: `${searchTerm} added to recipients list`
            });
        }
    };

    // Remove a temporary recipient
    const removeTempRecipient = (id: string) => {
        setTempRecipients(tempRecipients.filter(temp => temp.id !== id));
    };

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
        // Get recipients from both selected subscribers and temp recipients
        const subscriberEmails = selectedSubscribers
            .map(id => {
                const subscriber = subscribers.find(s => s.Id === id);
                return subscriber ? subscriber.Email : null;
            })
            .filter(Boolean) as string[];

        const tempEmails = tempRecipients.map(temp => temp.email);
        const allRecipients = [...subscriberEmails, ...tempEmails];

        if (allRecipients.length === 0) {
            toast({
                title: "No recipients selected",
                description: "Please select at least one recipient to send the email",
                variant: "destructive"
            });
            return;
        }

        setIsSending(true);

        try {
            await onSend(allRecipients);

            toast({
                title: "Email sent successfully",
                description: `Newsletter sent to ${allRecipients.length} recipients`
            });

            setOpen(false);
            setSelectedSubscribers([]);
            setTempRecipients([]);
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

        return (
            <>
                {/* Render temporary recipients first */}
                {tempRecipients.map((recipient) => (
                    <TableRow key={recipient.id} className="bg-muted/40">
                        <TableCell>
                            {/* Temp recipients are always selected */}
                            <Checkbox
                                checked={true}
                                disabled
                                aria-label={`Recipient ${recipient.email}`}
                            />
                        </TableCell>
                        <TableCell className="text-muted-foreground italic">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>Non-subscribed</span>
                            </div>
                        </TableCell>
                        <TableCell className="flex justify-between items-center">
                            {recipient.email}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTempRecipient(recipient.id)}
                            >
                                Remove
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}

                {/* Then show regular subscribers */}
                {filteredSubscribers.length === 0 && tempRecipients.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center py-8">
                            {searchTerm
                                ? "No subscribers found matching your search"
                                : "No active subscribers available"}
                        </TableCell>
                    </TableRow>
                ) : (
                    filteredSubscribers.map((subscriber) => (
                        <TableRow key={subscriber.Id}>
                            <TableCell>
                                <Checkbox
                                    checked={selectedSubscribers.includes(subscriber.Id)}
                                    onCheckedChange={() => handleSelectSubscriber(subscriber.Id)}
                                    aria-label={`Select ${subscriber.Name}`}
                                />
                            </TableCell>
                            <TableCell>{subscriber.Name}</TableCell>
                            <TableCell>{subscriber.Email}</TableCell>
                        </TableRow>
                    ))
                )}
            </>
        );
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
                        placeholder="Search subscribers or enter email address..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {isNewValidEmail && (
                        <div className="mt-2">
                            <Alert className="py-2 border-primary">
                                <AlertDescription className="flex items-center justify-between">
                                    <span className="text-sm">Add <strong>{searchTerm}</strong> as a recipient?</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={addTempRecipient}
                                        className="ml-2"
                                    >
                                        <Plus className="h-4 w-4 mr-1" /> Add
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}
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
                                        aria-label="Select all subscribers"
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
                        disabled={(selectedSubscribers.length === 0 && tempRecipients.length === 0) || isSending}
                    >
                        {isSending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            `Send to ${selectedSubscribers.length + tempRecipients.length} recipient${(selectedSubscribers.length + tempRecipients.length) !== 1 ? 's' : ''}`
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 