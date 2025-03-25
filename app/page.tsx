"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  useEffect(() => {
    // Redirige a la página de newsletter
    router.push("/newsletter");
  }, [router]);

  // Mostramos un div vacío mientras se produce la redirección
  return <div></div>;
}