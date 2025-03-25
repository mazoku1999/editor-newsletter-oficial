"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { SubscriberList } from "@/components/dashboard/subscriber-list";
import { Button } from "@/components/ui/button";
import { Plus, Users, Download } from "lucide-react";
import { AddSubscriberDialog } from "@/components/add-subscriber-dialog";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SubscribersPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Users className="h-8 w-8 text-primary" />
                            <h1 className="text-3xl font-bold tracking-tight">Subscribers</h1>
                        </div>
                        <p className="text-muted-foreground mt-1">
                            Manage your subscriber base and analyze their behavior
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="hidden md:flex">
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                        <AddSubscriberDialog />
                    </div>
                </div>

                <Separator className="my-6" />

                {/* Subscriber list */}
                <Card className="border-none shadow-none">
                    <CardContent className="p-0">
                        <SubscriberList />
                    </CardContent>
                </Card>
            </div>
            <Toaster />
        </DashboardLayout>
    );
} 