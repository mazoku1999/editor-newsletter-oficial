"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Trash2 } from "lucide-react";

interface Template {
  id: string;
  title: string;
  content: string;
  image: string;
  url: string;
  createdAt: string;
}

interface TemplateGalleryProps {
  templates: Template[];
  onSelect: (template: Template) => void;
  onDelete: (id: string) => void;
}

export function TemplateGallery({ templates, onSelect, onDelete }: TemplateGalleryProps) {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="grid grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="p-4 space-y-4">
            <img
              src={template.image}
              alt={template.title}
              className="w-full h-32 object-cover rounded-md"
            />
            <div>
              <h3 className="font-medium truncate">{template.title}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(template.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onSelect(template)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onDelete(template.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}