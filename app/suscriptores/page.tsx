"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    UserPlus,
    RefreshCw,
    Loader2
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { AddSubscriberDialog } from "@/components/add-subscriber-dialog";

// Definimos la interfaz para un suscriptor
interface Subscriber {
    Id: number;
    Nombre: string;
    Email: string;
    Status: string;
    Fecha_Alta: string;
}

export default function SubscribersPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/subscribers');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al obtener los suscriptores');
            }

            if (data.success && Array.isArray(data.subscribers)) {
                setSubscribers(data.subscribers);
            } else {
                throw new Error('Formato de respuesta inválido');
            }
        } catch (error) {
            console.error('Error fetching subscribers:', error);
            setError(error instanceof Error ? error.message : 'Error desconocido');
            toast({
                title: "Error al cargar suscriptores",
                description: error instanceof Error ? error.message : 'Error desconocido',
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

    // Formatear la fecha para mostrarla legible
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return format(date, 'dd/MM/yyyy HH:mm');
        } catch (error) {
            return dateString;
        }
    };

    // Obtener el color de la insignia según el estado
    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return "success";
            case 'inactive':
                return "secondary";
            case 'unsubscribed':
                return "destructive";
            default:
                return "outline";
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Suscriptores</h1>
                <p className="text-muted-foreground">
                    Administra los suscriptores de tus newsletters.
                </p>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle>Lista de Suscriptores</CardTitle>
                            <CardDescription>
                                {filteredSubscribers.length} suscriptores en total
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchSubscribers}
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="h-4 w-4" />
                                )}
                                <span className="ml-2 hidden sm:inline">Actualizar</span>
                            </Button>
                            <AddSubscriberDialog onSuccess={fetchSubscribers} />
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="relative mb-4">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar suscriptores..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-destructive">
                            <div className="font-semibold">Error al cargar suscriptores</div>
                            <div className="text-sm">{error}</div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={fetchSubscribers}
                            >
                                Reintentar
                            </Button>
                        </div>
                    ) : (
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Fecha de Alta</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSubscribers.length > 0 ? (
                                        filteredSubscribers.map((subscriber) => (
                                            <TableRow key={subscriber.Id}>
                                                <TableCell className="font-medium">
                                                    {subscriber.Nombre}
                                                </TableCell>
                                                <TableCell>{subscriber.Email}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusBadgeVariant(subscriber.Status) as any}>
                                                        {subscriber.Status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(subscriber.Fecha_Alta)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8">
                                                {searchTerm
                                                    ? "No se encontraron suscriptores que coincidan con la búsqueda"
                                                    : "No hay suscriptores disponibles"}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 