/**
 * Extrae el primer título (h1, h2, h3) del contenido HTML
 */
export function extractFirstTitle(content: string): string | null {
    // Buscar primero un h1
    const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match) {
        return h1Match[1].replace(/<[^>]*>/g, '');
    }

    // Si no hay h1, buscar h2
    const h2Match = content.match(/<h2[^>]*>(.*?)<\/h2>/i);
    if (h2Match) {
        return h2Match[1].replace(/<[^>]*>/g, '');
    }

    // Si no hay h2, buscar h3
    const h3Match = content.match(/<h3[^>]*>(.*?)<\/h3>/i);
    if (h3Match) {
        return h3Match[1].replace(/<[^>]*>/g, '');
    }

    // Si no hay ningún encabezado, buscar el primer párrafo
    const pMatch = content.match(/<p[^>]*>(.*?)<\/p>/i);
    if (pMatch) {
        const text = pMatch[1].replace(/<[^>]*>/g, '');
        // Limitar a 50 caracteres si es más largo
        return text.length > 50 ? text.substring(0, 47) + '...' : text;
    }

    return null;
}

/**
 * Extrae la primera imagen del contenido HTML
 * 
 * Esta función mejorada busca imágenes en formato img con src
 * y maneja múltiples formatos posibles de etiquetas de imagen
 */
export function extractFirstImage(content: string): string | null {
    // Buscar imágenes con src entre comillas dobles
    const doubleQuoteMatch = content.match(/<img[^>]*src="([^"]*)"[^>]*>/i);
    if (doubleQuoteMatch && doubleQuoteMatch[1]) {
        return doubleQuoteMatch[1];
    }

    // Buscar imágenes con src entre comillas simples
    const singleQuoteMatch = content.match(/<img[^>]*src='([^']*)'[^>]*>/i);
    if (singleQuoteMatch && singleQuoteMatch[1]) {
        return singleQuoteMatch[1];
    }

    // Buscar imágenes con src sin comillas (menos común pero posible)
    const noQuoteMatch = content.match(/<img[^>]*src=([^ >]*)[^>]*>/i);
    if (noQuoteMatch && noQuoteMatch[1]) {
        return noQuoteMatch[1];
    }

    // Verificar si hay una imagen en formato figura - usando expresión regular compatible
    const figurePattern = /<figure[^>]*>[\s\S]*?<img[^>]*src=["']([^"']*)["'][^>]*>[\s\S]*?<\/figure>/i;
    const figureMatch = content.match(figurePattern);
    if (figureMatch && figureMatch[1]) {
        return figureMatch[1];
    }

    return null;
} 