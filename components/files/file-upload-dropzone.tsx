"use client";

import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FileUploadDropzoneProps {
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
}

export function FileUploadDropzone({
  onUpload,
  isUploading,
}: FileUploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Optional: Add file validation here (size, type)
    if (file.size > 50 * 1024 * 1024) {
      // 50MB limit
      toast.error("Filen er for stor. Maks 50MB.");
      return;
    }

    try {
      await onUpload(file);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch {
      // Error handling is done in the parent/hook
    }
  };

  return (
    <div className="w-full">
      {isUploading ? (
        <div className="flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
          <Loader2 className="mb-2 h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">
            Laster opp...
          </p>
        </div>
      ) : (
        <label
          className={cn(
            "flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 transition-colors hover:bg-muted/70",
            dragActive
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/25"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="mb-1 text-sm font-medium text-muted-foreground">
              <span className="font-semibold text-foreground">
                Klikk for å laste opp
              </span>{" "}
              eller dra og slipp
            </p>
            <p className="text-xs text-muted-foreground">Maks 50MB</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}
