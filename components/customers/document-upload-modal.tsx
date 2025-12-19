"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Upload,
  X,
  FileText,
  FileSpreadsheet,
  Image,
  File,
  FileArchive,
  Loader2,
} from "lucide-react";
import {
  useUploadCustomerDocument,
  formatFileSize,
  getFileTypeIcon,
} from "@/hooks/useCustomerDocuments";

interface DocumentUploadModalProps {
  customerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FILE_ICONS = {
  pdf: FileText,
  spreadsheet: FileSpreadsheet,
  document: FileText,
  image: Image,
  archive: FileArchive,
  file: File,
};

export function DocumentUploadModal({
  customerId,
  open,
  onOpenChange,
}: DocumentUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const uploadDocument = useUploadCustomerDocument();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        setSelectedFile(files[0]);
      }
    },
    []
  );

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadDocument.mutateAsync({
        customerId,
        file: selectedFile,
      });
      setSelectedFile(null);
      onOpenChange(false);
    } catch {
      // Error is handled in the hook
    }
  };

  const handleClose = () => {
    if (!uploadDocument.isPending) {
      setSelectedFile(null);
      onOpenChange(false);
    }
  };

  const fileIcon = selectedFile
    ? FILE_ICONS[getFileTypeIcon(selectedFile.type)]
    : File;
  const FileIcon = fileIcon;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Last opp dokument</DialogTitle>
          <DialogDescription>
            Velg en fil fra datamaskinen din eller dra og slipp den her.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50",
              uploadDocument.isPending && "pointer-events-none opacity-50"
            )}
          >
            <input
              type="file"
              onChange={handleFileSelect}
              className="absolute inset-0 cursor-pointer opacity-0"
              disabled={uploadDocument.isPending}
            />
            <Upload
              className={cn(
                "mb-4 h-10 w-10",
                isDragging ? "text-primary" : "text-muted-foreground"
              )}
            />
            <p className="text-center text-sm text-muted-foreground">
              {isDragging ? (
                <span className="font-medium text-primary">
                  Slipp filen her
                </span>
              ) : (
                <>
                  <span className="font-medium">Klikk for å velge</span> eller
                  dra og slipp
                </>
              )}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Alle filtyper støttes
            </p>
          </div>

          {/* Selected file preview */}
          {selectedFile && (
            <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
                <FileIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => setSelectedFile(null)}
                disabled={uploadDocument.isPending}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={uploadDocument.isPending}
          >
            Avbryt
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploadDocument.isPending}
          >
            {uploadDocument.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Laster opp...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Last opp
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
