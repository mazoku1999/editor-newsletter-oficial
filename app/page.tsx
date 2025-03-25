"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { SubscriberList } from "@/components/dashboard/subscriber-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Encabezado */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido a tu panel de control. Aquí podrás gestionar tu newsletter y tus suscriptores.
          </p>
        </div>

        {/* Acciones rápidas */}
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/newsletter">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Crear Newsletter</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+</div>
                <p className="text-xs text-muted-foreground">
                  Diseña y envía tu próximo newsletter
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/subscribers">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gestionar Suscriptores</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  Total de suscriptores activos
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Lista de suscriptores recientes */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Suscriptores Recientes</h2>
          <SubscriberList />
        </div>
      </div>
    </DashboardLayout>
  );
}