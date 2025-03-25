"use client";

import { useState } from "react";
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
import { Search, Mail, Users, Activity, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Datos simulados de suscriptores
const mockSubscribers = [
    {
        id: 1,
        email: "maria.garcia@example.com",
        name: "María García",
        status: "active",
        subscriptionDate: "2024-03-15",
        lastOpen: "2024-03-20",
        openRate: 85,
        location: "España",
    },
    {
        id: 2,
        email: "juan.perez@example.com",
        name: "Juan Pérez",
        status: "active",
        subscriptionDate: "2024-03-10",
        lastOpen: "2024-03-19",
        openRate: 92,
        location: "México",
    },
    {
        id: 3,
        email: "ana.martinez@example.com",
        name: "Ana Martínez",
        status: "inactive",
        subscriptionDate: "2024-02-28",
        lastOpen: "2024-03-01",
        openRate: 45,
        location: "Argentina",
    },
    // Añadir más suscriptores simulados aquí...
];

export function SubscriberList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Filtrar suscriptores
    const filteredSubscribers = mockSubscribers.filter((subscriber) => {
        const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subscriber.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || subscriber.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Estadísticas
    const totalSubscribers = mockSubscribers.length;
    const activeSubscribers = mockSubscribers.filter(s => s.status === "active").length;
    const averageOpenRate = mockSubscribers.reduce((acc, curr) => acc + curr.openRate, 0) / totalSubscribers;

    return (
        <div className="space-y-6">
            {/* Tarjetas de estadísticas */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Suscriptores</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSubscribers}</div>
                        <p className="text-xs text-muted-foreground">
                            +12% desde el mes pasado
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Suscriptores Activos</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeSubscribers}</div>
                        <p className="text-xs text-muted-foreground">
                            {((activeSubscribers / totalSubscribers) * 100).toFixed(1)}% tasa de retención
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tasa de Apertura Promedio</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{averageOpenRate.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground">
                            +5% desde el mes pasado
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros y búsqueda */}
            <Card>
                <CardHeader>
                    <CardTitle>Suscriptores</CardTitle>
                    <CardDescription>
                        Gestiona tus suscriptores y analiza su comportamiento
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por email o nombre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filtrar por estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="active">Activos</SelectItem>
                                <SelectItem value="inactive">Inactivos</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button>Exportar Lista</Button>
                    </div>

                    {/* Tabla de suscriptores */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Fecha de Suscripción</TableHead>
                                    <TableHead>Última Apertura</TableHead>
                                    <TableHead>Tasa de Apertura</TableHead>
                                    <TableHead>Ubicación</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSubscribers.map((subscriber) => (
                                    <TableRow key={subscriber.id}>
                                        <TableCell className="font-medium">{subscriber.name}</TableCell>
                                        <TableCell>{subscriber.email}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={subscriber.status === "active" ? "default" : "secondary"}
                                            >
                                                {subscriber.status === "active" ? "Activo" : "Inactivo"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(subscriber.subscriptionDate), "PPP", { locale: es })}
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(subscriber.lastOpen), "PPP", { locale: es })}
                                        </TableCell>
                                        <TableCell>{subscriber.openRate}%</TableCell>
                                        <TableCell>{subscriber.location}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm">
                                                Editar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 