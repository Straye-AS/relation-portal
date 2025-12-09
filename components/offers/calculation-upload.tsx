"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalculationUploadProps {
  onFileSelect?: (file: File) => void;
  className?: string;
}

export function CalculationUpload({
  onFileSelect,
  className,
}: CalculationUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onFileSelect?.(selectedFile);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    inputRef.current?.click();
  };

  if (file) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border bg-muted/50 p-2 text-sm",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <FileSpreadsheet className="h-4 w-4 text-green-600" />
        <div className="flex flex-col">
          <span className="max-w-[120px] truncate font-medium">
            {file.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {(file.size / 1024).toFixed(1)} KB
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
          onClick={handleRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept=".xlsx,.xlsm,.xls"
        onChange={handleFileChange}
      />
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-2"
        onClick={handleClick}
      >
        <Upload className="h-3 w-3" />
        Importer kalkyle
      </Button>
    </div>
  );
}
