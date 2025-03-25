"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    LayoutDashboard,
    Mail,
    Users,
    Settings,
    BarChart,
    Menu,
    X,
    Bell,
    Search,
    ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Newsletter", href: "/dashboard/newsletter", icon: Mail },
    { name: "Suscriptores", href: "/dashboard/subscribers", icon: Users },
    { name: "Analíticas", href: "/dashboard/analytics", icon: BarChart },
    { name: "Configuración", href: "/dashboard/settings", icon: Settings },
];

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar móvil */}
            <div
                className={cn(
                    "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden",
                    sidebarOpen ? "block" : "hidden"
                )}
                onClick={() => setSidebarOpen(false)}
            >
                <div
                    className={cn(
                        "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out",
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <div className="flex h-16 items-center justify-between px-4 border-b">
                        <span className="text-xl font-semibold">Newsletter Pro</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <nav className="space-y-1 p-4">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted"
                                    )}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Sidebar desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                        <span className="text-xl font-semibold">Newsletter Pro</span>
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                                        isActive
                                                            ? "bg-primary text-primary-foreground"
                                                            : "hover:bg-muted"
                                                    )}
                                                >
                                                    <item.icon className="h-5 w-5" />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="lg:pl-64">
                {/* Header */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Separador */}
                    <div className="h-6 w-px bg-border lg:hidden" />

                    {/* Barra de búsqueda */}
                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="relative flex flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar..."
                                className="pl-8 w-full max-w-sm"
                            />
                        </div>
                    </div>

                    {/* Notificaciones y perfil */}
                    <div className="flex items-center gap-x-4 lg:gap-x-6">
                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5" />
                        </Button>

                        {/* Separador */}
                        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" />

                        {/* Perfil */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/avatars/01.png" alt="Usuario" />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">Usuario</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            usuario@ejemplo.com
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    Perfil
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Configuración
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                    Cerrar sesión
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Contenido principal */}
                <main className="py-10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
} 