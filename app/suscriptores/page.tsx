"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuscriptoresPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirige a la versión en inglés
        router.push("/subscribers");
    }, [router]);

    // Mostramos un div vacío mientras se produce la redirección
    return <div></div>;
} 