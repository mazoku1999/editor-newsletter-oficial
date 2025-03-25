"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { render } from "@react-email/render";
import { NewsletterEmail } from "../emails/newsletter";
import { useEffect, useState } from "react";
import { Mail } from "lucide-react";

interface PreviewEmailProps {
  title: string;
  content: string;
  image: string;
  url: string;
}

export function PreviewEmail({ title, content, image, url }: PreviewEmailProps) {
  const [iframeHeight, setIframeHeight] = useState("700px");

  // Esta función configura el iframe para ajustar su tamaño
  const setupIframe = (iframe: HTMLIFrameElement | null) => {
    if (!iframe) return;

    // Establecer estilos al body del iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      const style = iframeDoc.createElement("style");
      style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        h1 {
          font-family: 'Lora', Georgia, serif;
          color: #4F46E5;
        }
        h2, h3, h4, h5, h6 {
          font-family: 'Lora', Georgia, serif;
          color: #1F2937;
        }
        img {
          max-width: 100%;
        }
        ul, ol {
          margin-left: 20px;
          padding-left: 10px;
        }
        a {
          color: #4F46E5;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      `;
      iframeDoc.head.appendChild(style);
    }

    // Ajustar altura después de cargar
    iframe.onload = () => {
      if (iframe.contentWindow?.document?.body) {
        const height = iframe.contentWindow.document.body.scrollHeight;
        if (height > 0) {
          setIframeHeight(`${height + 40}px`);
        }
      }
    };
  };

  const emailHtml = render(
    <NewsletterEmail
      title={title}
      content={content}
      imageUrl={image}
      url={url}
    />
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Mail className="w-4 h-4 mr-2" />
          Preview Email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Email Preview</DialogTitle>
        </DialogHeader>
        <div className="mt-4 border rounded-md overflow-hidden">
          <iframe
            srcDoc={emailHtml}
            style={{
              width: "100%",
              height: iframeHeight,
              border: "none",
            }}
            ref={setupIframe}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}