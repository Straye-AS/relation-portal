"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2, Save, X } from "lucide-react";
import { useUpdateProjectDescription } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";
import type { Components } from "react-markdown";
import { logger } from "@/lib/logging";

interface ProjectDescriptionProps {
  projectId: string;
  initialDescription?: string;
  className?: string;
  readOnly?: boolean;
}

const markdownComponents: Components = {
  h1: ({ className, ...props }) => (
    <h1 className={cn("mb-4 mt-6 text-2xl font-bold", className)} {...props} />
  ),
  h2: ({ className, ...props }) => (
    <h2 className={cn("mb-3 mt-5 text-xl font-bold", className)} {...props} />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={cn("mb-2 mt-4 text-lg font-bold", className)} {...props} />
  ),
  p: ({ className, ...props }) => (
    <p className={cn("mb-4 leading-relaxed", className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("mb-4 list-disc pl-6", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("mb-4 list-decimal pl-6", className)} {...props} />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("mb-1", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn("my-4 border-l-4 border-muted pl-4 italic", className)}
      {...props}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn("text-primary hover:underline", className)}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "rounded bg-muted px-1.5 py-0.5 font-mono text-sm",
        className
      )}
      {...props}
    />
  ),
};

export function ProjectDescription({
  projectId,
  initialDescription,
  className,
  readOnly = false,
}: ProjectDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(initialDescription || "");
  const updateProject = useUpdateProjectDescription();

  const handleSave = async () => {
    try {
      await updateProject.mutateAsync({
        id: projectId,
        data: { description },
      });
      setIsEditing(false);
    } catch (error) {
      logger.error(
        "Failed to update description",
        error instanceof Error ? error : undefined
      );
    }
  };

  const handleCancel = () => {
    setDescription(initialDescription || "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className={cn("w-full transition-all duration-200", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Beskrivelse</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Avbryt
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={updateProject.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              Lagre
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[200px] resize-y font-mono text-base"
            placeholder="Skriv en beskrivelse... (Markdown støttes)"
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>
              Støtter Markdown: **bold**, *italic*, # heading, - lists
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("group w-full transition-all duration-200", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Beskrivelse</CardTitle>
        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Rediger
          </Button>
        )}
      </CardHeader>
      <CardContent
        onClick={() => !readOnly && setIsEditing(true)}
        className={cn(
          "rounded-md border border-transparent px-6 py-4",
          !readOnly && "cursor-pointer hover:border-muted hover:bg-muted/10"
        )}
      >
        {description ? (
          <div className="text-sm">
            <ReactMarkdown components={markdownComponents}>
              {description}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-8 text-muted-foreground transition-colors hover:bg-muted/50">
            <p className="text-sm">Ingen beskrivelse lagt til</p>
            {!readOnly && (
              <p className="mt-1 text-xs">Klikk for å legge til beskrivelse</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
