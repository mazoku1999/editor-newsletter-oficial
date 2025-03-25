"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Users, Activity, Calendar, RefreshCw, Loader2, MoreHorizontal, BarChart3, ArrowUpRight } from "lucide-react";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "@/components/ui/use-toast";
import { AddSubscriberDialog } from "@/components/add-subscriber-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Definimos la interfaz para un suscriptor
interface Subscriber {
    Id: number;
    Nombre: string;
    Email: string;
    Status: string;
    Fecha_Alta: string;
}

export function SubscriberList() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [estimatedOpenRate, setEstimatedOpenRate] = useState(65); // Valor inicial constante

    useEffect(() => {
        // Generar el valor aleatorio solo en el cliente
        setEstimatedOpenRate(65 + Math.floor(Math.random() * 20));
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

    const filteredSubscribers = subscribers.filter((subscriber) => {
        const matchesSearch = subscriber.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subscriber.Email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || subscriber.Status.toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Estadísticas
    const totalSubscribers = subscribers.length;
    const activeSubscribers = subscribers.filter(s => s.Status.toLowerCase() === "active").length;
    const inactiveSubscribers = subscribers.filter(s => s.Status.toLowerCase() === "inactive").length;
    const unsubscribedCount = subscribers.filter(s => s.Status.toLowerCase() === "unsubscribed").length;

    // Calcular cuántos suscriptores nuevos (simulados - últimos 30 días)
    const thirtyDaysAgo = subDays(new Date(), 30);
    const newSubscribersCount = subscribers.filter(s => {
        try {
            return new Date(s.Fecha_Alta) >= thirtyDaysAgo;
        } catch (e) {
            return false;
        }
    }).length;

    // Tasa de retención simulada
    const retentionRate = totalSubscribers > 0 ? (activeSubscribers / totalSubscribers) * 100 : 0;

    // Formatear la fecha para mostrarla legible
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
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
        <div className="space-y-6">
            {/* Estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Suscriptores</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSubscribers}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-500 font-medium">+{newSubscribersCount}</span>
                            <span className="ml-1">en los últimos 30 días</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Suscriptores Activos</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeSubscribers}</div>
                        <div className="text-xs text-muted-foreground">
                            {retentionRate.toFixed(1)}% tasa de retención
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tasa de Apertura</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{estimatedOpenRate}%</div>
                        <div className="text-xs text-muted-foreground">
                            Promedio estimado
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bajas</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{unsubscribedCount}</div>
                        <div className="text-xs text-muted-foreground">
                            {totalSubscribers > 0 ? (unsubscribedCount / totalSubscribers * 100).toFixed(1) : 0}% tasa de cancelación
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabla de suscriptores */}
            <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle>Lista de Suscriptores</CardTitle>
                    <CardDescription>
                        {filteredSubscribers.length} suscriptores encontrados
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="px-6 py-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar suscriptores..."
                                className="pl-8 w-full sm:w-[300px]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Filtrar por estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="active">Activos</SelectItem>
                                    <SelectItem value="inactive">Inactivos</SelectItem>
                                    <SelectItem value="unsubscribed">Dados de baja</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchSubscribers}
                                disabled={loading}
                                className="flex items-center"
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="h-4 w-4" />
                                )}
                                <span className="ml-2 hidden sm:inline">Refrescar</span>
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-md overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Fecha de Alta</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-40">
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                                                <p className="text-sm text-muted-foreground">Cargando suscriptores...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : error ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-40 text-center">
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <div className="text-destructive font-medium mb-1">Error al cargar suscriptores</div>
                                                <p className="text-sm text-muted-foreground mb-3">{error}</p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={fetchSubscribers}
                                                >
                                                    Reintentar
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredSubscribers.length > 0 ? (
                                    filteredSubscribers.map((subscriber) => (
                                        <TableRow key={subscriber.Id} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">{subscriber.Nombre}</TableCell>
                                            <TableCell className="text-muted-foreground">{subscriber.Email}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusBadgeVariant(subscriber.Status) as any}>
                                                    {subscriber.Status === 'Active' ? 'Activo' :
                                                        subscriber.Status === 'Inactive' ? 'Inactivo' :
                                                            subscriber.Status === 'Unsubscribed' ? 'Dado de baja' :
                                                                subscriber.Status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {formatDate(subscriber.Fecha_Alta)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                        <DropdownMenuItem>Editar suscriptor</DropdownMenuItem>
                                                        <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive">
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-40 text-center">
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <p className="text-muted-foreground mb-1">
                                                    {searchTerm || statusFilter !== "all"
                                                        ? "No se encontraron suscriptores que coincidan con los filtros"
                                                        : "No hay suscriptores disponibles"}
                                                </p>
                                                {(searchTerm || statusFilter !== "all") && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="mt-2"
                                                        onClick={() => {
                                                            setSearchTerm("");
                                                            setStatusFilter("all");
                                                        }}
                                                    >
                                                        Limpiar filtros
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 