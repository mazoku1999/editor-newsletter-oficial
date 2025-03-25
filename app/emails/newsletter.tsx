import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Button,
  Column,
  Row,
  Img,
} from '@react-email/components';
import * as React from 'react';

interface NewsletterEmailProps {
  title: string;
  content: string;
  imageUrl?: string;
  url: string;
  subtitle?: string; // Permitir personalizar el subtítulo
  showHeader?: boolean; // Opción para mostrar u ocultar el header
}

// Colores del tema
const theme = {
  primary: '#4F46E5', // Indigo
  secondary: '#7C3AED', // Púrpura
  background: '#F9FAFB',
  cardBackground: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  accent: '#F59E0B', // Color acentuado para detalles
};

// Tipografías
const fonts = {
  heading: "'Lora', Georgia, serif",
  body: "'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  accent: "'Quicksand', 'Helvetica Neue', Helvetica, Arial, sans-serif",
};

const mainStyles = {
  backgroundColor: theme.background,
  fontFamily: fonts.body,
  padding: '0',
  margin: '0',
};

const containerStyles = {
  margin: '0 auto',
  padding: '0',
  backgroundColor: theme.cardBackground,
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
  maxWidth: '650px',
};

// Header más discreto y minimalista
const headerStyles = {
  backgroundColor: 'transparent', // Quitar el color de fondo
  borderBottom: `1px solid ${theme.border}`,
  padding: '0 0 10px', // Eliminar padding superior
  textAlign: 'center' as const,
};

const contentContainerStyles = {
  padding: '0 8px 15px',
  margin: '0',
};

const paragraphStyles = {
  color: theme.text,
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '16px',
};

const titleStyles = {
  color: theme.primary, // Cambiar color a primario en lugar de blanco
  fontSize: '24px', // Reducir tamaño
  fontWeight: 'bold',
  marginBottom: '10px',
  textAlign: 'center' as const,
  fontFamily: fonts.heading,
};

const subtitleStyles = {
  color: theme.textSecondary, // Cambiar color
  fontSize: '15px',
  marginBottom: '0',
  textAlign: 'center' as const,
  fontFamily: fonts.accent,
  letterSpacing: '0.5px',
};

const footerStyles = {
  backgroundColor: theme.background,
  padding: '20px',
  borderTop: `1px solid ${theme.border}`,
  borderBottomLeftRadius: '12px',
  borderBottomRightRadius: '12px',
};

const footerTextStyles = {
  color: theme.textSecondary,
  fontSize: '13px',
  lineHeight: '22px',
  textAlign: 'center' as const,
  margin: '8px 0',
  fontFamily: fonts.accent,
};

const socialButtonStyle = {
  display: 'inline-block',
  padding: '8px',
  backgroundColor: theme.cardBackground,
  borderRadius: '50%',
  margin: '0 8px',
};

// Función para aplicar estilos adicionales al HTML del contenido
const enhanceContentStyles = (htmlContent: string): string => {
  // Estas sustituciones son muy básicas y podrían mejorarse con una biblioteca de manipulación DOM
  // Pero para el propósito de este ejemplo, usaremos reemplazos de cadenas simples
  let enhancedContent = htmlContent;

  // Mejora los encabezados con tipografía elegante
  enhancedContent = enhancedContent.replace(
    /<h1([^>]*)>(.*?)<\/h1>/gi,
    `<h1 style="color:${theme.primary};font-size:28px;font-weight:700;margin-top:15px;margin-bottom:18px;font-family:${fonts.heading};line-height:1.3;letter-spacing:-0.02em;padding-left:25px;padding-right:25px;$1">$2</h1>`
  );

  enhancedContent = enhancedContent.replace(
    /<h2([^>]*)>(.*?)<\/h2>/gi,
    `<h2 style="color:${theme.text};font-size:22px;font-weight:700;margin-top:20px;margin-bottom:16px;font-family:${fonts.heading};line-height:1.3;letter-spacing:-0.01em;padding-left:25px;padding-right:25px;$1">$2</h2>`
  );

  enhancedContent = enhancedContent.replace(
    /<h3([^>]*)>(.*?)<\/h3>/gi,
    `<h3 style="color:${theme.text};font-size:18px;font-weight:700;margin-top:18px;margin-bottom:14px;font-family:${fonts.heading};line-height:1.3;padding-left:25px;padding-right:25px;$1">$2</h3>`
  );

  // Mejora los párrafos con mejor tipografía y espaciado
  enhancedContent = enhancedContent.replace(
    /<p([^>]*)>(.*?)<\/p>/gi,
    `<p style="color:${theme.text};font-size:16px;line-height:1.7;margin-top:12px;margin-bottom:16px;margin-left:0;margin-right:0;font-family:${fonts.body};padding-left:25px;padding-right:25px;$1">$2</p>`
  );

  // Añade un estilo especial para el primer párrafo (entrada)
  const firstParagraphRegex = /<p[^>]*>(.*?)<\/p>/i;
  const firstParagraphMatch = enhancedContent.match(firstParagraphRegex);

  if (firstParagraphMatch) {
    const firstParagraph = firstParagraphMatch[0];
    const firstParagraphContent = firstParagraphMatch[1];
    const enhancedFirstParagraph = `<p style="color:${theme.text};font-size:17px;line-height:1.7;margin-top:0;margin-bottom:20px;margin-left:0;margin-right:0;font-family:${fonts.body};font-weight:500;padding-left:25px;padding-right:25px;">${firstParagraphContent}</p>`;

    enhancedContent = enhancedContent.replace(firstParagraph, enhancedFirstParagraph);
  }

  // CORRECCIÓN: Mejora las listas para que se muestren correctamente
  enhancedContent = enhancedContent.replace(
    /<ul([^>]*)>/gi,
    `<ul style="padding-left:45px;margin-bottom:20px;list-style-type:disc !important;display:block;padding-right:25px;$1">`
  );

  enhancedContent = enhancedContent.replace(
    /<ol([^>]*)>/gi,
    `<ol style="padding-left:45px;margin-bottom:20px;list-style-type:decimal !important;display:block;padding-right:25px;$1">`
  );

  enhancedContent = enhancedContent.replace(
    /<li([^>]*)>(.*?)<\/li>/gi,
    `<li style="color:${theme.text};font-size:16px;line-height:1.6;margin-bottom:10px;display:list-item !important;font-family:${fonts.body};$1">$2</li>`
  );

  // Mejorar las imágenes para que se vean más estéticas
  // Primera imagen (cabecera) sin bordes para mantener el diseño limpio
  const firstImageRegex = /<img[^>]*src=["']([^"']*)["'][^>]*>/i;
  const firstImageMatch = enhancedContent.match(firstImageRegex);

  if (firstImageMatch) {
    const firstImage = firstImageMatch[0];
    // Reemplazar solo la primera imagen sin bordes ni márgenes
    const enhancedFirstImage = firstImage.replace(
      /style=["']([^"']*)["']/i,
      `style="max-width:100%;height:auto;display:block;margin:0;padding:0;border-radius:0;"`
    );

    enhancedContent = enhancedContent.replace(firstImage, enhancedFirstImage);

    // Reemplazar todas las demás imágenes con un estilo más refinado
    enhancedContent = enhancedContent.replace(
      new RegExp(`(?!${firstImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})<img([^>]*)src=["']([^"']*)["']([^>]*)>`, 'gi'),
      `<img$1src="$2"$3 style="max-width:100%;height:auto;display:block;margin:20px auto;padding:0;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);" />`
    );
  } else {
    // Si no hay primera imagen, aplicar estilo a todas
    enhancedContent = enhancedContent.replace(
      /<img([^>]*)src=["']([^"']*)["']([^>]*)>/gi,
      `<img$1src="$2"$3 style="max-width:100%;height:auto;display:block;margin:20px auto;padding:0;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);" />`
    );
  }

  // Mejora los enlaces con estilo más elegante
  enhancedContent = enhancedContent.replace(
    /<a([^>]*)>(.*?)<\/a>/gi,
    `<a style="color:${theme.primary};text-decoration:none;font-weight:500;border-bottom:1px dotted ${theme.primary};padding-bottom:1px;transition:all 0.2s ease;$1">$2</a>`
  );

  // Añadir estilo a las citas (blockquote)
  enhancedContent = enhancedContent.replace(
    /<blockquote([^>]*)>(.*?)<\/blockquote>/gi,
    `<blockquote style="padding:15px 25px 15px 20px;margin:20px 25px;font-style:italic;border-left:3px solid ${theme.accent};color:${theme.textSecondary};background-color:rgba(0,0,0,0.02);border-radius:4px;$1">$2</blockquote>`
  );

  // Añadir más espacio y estilo a los separadores horizontales
  enhancedContent = enhancedContent.replace(
    /<hr([^>]*)>/gi,
    `<hr style="height:1px;border:none;background:linear-gradient(to right, ${theme.border}, ${theme.accent}, ${theme.border});margin:25px 25px;" />`
  );

  return enhancedContent;
};

export const NewsletterEmail = ({
  title,
  content,
  imageUrl,
  url,
  subtitle = "",
  showHeader = false,
}: NewsletterEmailProps) => {
  const enhancedContent = enhanceContentStyles(content);
  const displaySubtitle = subtitle || "";

  return (
    <Html>
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600&display=swap" />
        <style>
          {`
            body { margin: 0 !important; padding: 0 !important; }
            div { margin-top: 0 !important; padding-top: 0 !important; }
            img { margin-top: 0 !important; margin-bottom: 0 !important; padding: 0 !important; }
            table { margin: 0 auto !important; padding: 0 !important; } /* Centrado de tablas */
            td { padding: 0 !important; }
            ul { list-style-type: disc !important; }
            ol { list-style-type: decimal !important; }
            li { display: list-item !important; }
            div[data-id="content"] { padding-top: 0 !important; margin-top: 0 !important; }
            .center-table { margin: 0 auto !important; } /* Clase helper para centrado */
          `}
        </style>
      </Head>
      <Preview>{title}</Preview>
      <Body style={{ margin: 0, padding: 0, backgroundColor: '#f4f5f7', fontFamily: fonts.body }}>
        <Container style={{ margin: '0 auto', padding: 0, maxWidth: '650px', width: '100%' }} className="center-table">
          {/* Contenido principal sin márgenes pero centrado */}
          <div style={{ margin: 0, padding: 0, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ margin: 0, padding: 0 }} dangerouslySetInnerHTML={{ __html: enhancedContent }} />
          </div>

          {/* Footer - posiciónalo después del contenido principal */}
          <Section style={footerStyles}>
            <Text style={{ ...footerTextStyles, marginTop: '5px' }}>
              © {new Date().getFullYear()} Mi Boletín. Todos los derechos reservados.
            </Text>
            <Text style={footerTextStyles}>
              Si prefieres no recibir más estos correos, puedes{' '}
              <Link href="#" style={{ color: theme.primary, textDecoration: 'underline' }}>
                darte de baja aquí
              </Link>
              .
            </Text>

            <Row style={{ textAlign: 'center', marginTop: '16px' }}>
              <Column>
                <Link href="#" style={socialButtonStyle}>
                  <Img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" width="20" height="20" alt="Facebook" style={{ borderRadius: '50%' }} />
                </Link>
                <Link href="#" style={socialButtonStyle}>
                  <Img src="https://cdn-icons-png.flaticon.com/512/124/124021.png" width="20" height="20" alt="Twitter" style={{ borderRadius: '50%' }} />
                </Link>
                <Link href="#" style={socialButtonStyle}>
                  <Img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" width="20" height="20" alt="Instagram" style={{ borderRadius: '50%' }} />
                </Link>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};