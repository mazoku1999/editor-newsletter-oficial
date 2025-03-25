import { useEffect, useState } from "react"

/**
 * Hook que permite detectar si un media query coincide con el tamaño de pantalla actual
 * 
 * @param query La media query a comprobar (por ejemplo, "(max-width: 768px)")
 * @returns Boolean indicando si la media query coincide
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(false)

    useEffect(() => {
        if (typeof window === "undefined") return

        const media = window.matchMedia(query)

        // Establecer el valor inicial
        setMatches(media.matches)

        // Definir un listener para actualizar el valor cuando cambie
        const listener = (e: MediaQueryListEvent) => {
            setMatches(e.matches)
        }

        // Añadir el listener
        media.addEventListener("change", listener)

        // Limpiar el listener cuando el componente se desmonte
        return () => {
            media.removeEventListener("change", listener)
        }
    }, [query])

    return matches
} 