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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import {
  useUploadCustomerDocument,
  formatFileSize,
  getFileTypeIcon,
} from "@/hooks/useCustomerDocuments";
import { FILE_ICONS, GenericFileIcon } from "@/components/ui/file-icons";
import { toast } from "sonner";

// File validation constants
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILE_SIZE_DISPLAY = "50MB";

interface DocumentUploadModalProps {
  customerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentUploadModal({
  customerId,
  open,
  onOpenChange,
}: DocumentUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [comment, setComment] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const uploadDocument = useUploadCustomerDocument();

  /**
   * Validate file size and show error if invalid
   */
  const validateFile = useCallback((file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      const errorMsg = `Filen er for stor. Maksimal størrelse er ${MAX_FILE_SIZE_DISPLAY}.`;
      setValidationError(errorMsg);
      toast.error(errorMsg);
      return false;
    }
    setValidationError(null);
    return true;
  }, []);

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

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (validateFile(file)) {
          setSelectedFile(file);
        }
      }
    },
    [validateFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (validateFile(file)) {
          setSelectedFile(file);
        }
      }
    },
    [validateFile]
  );

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadDocument.mutateAsync({
        customerId,
        file: selectedFile,
        comment: comment.trim() || undefined,
      });
      setSelectedFile(null);
      setComment("");
      onOpenChange(false);
    } catch {
      // Error is handled in the hook
    }
  };

  const handleClose = () => {
    if (!uploadDocument.isPending) {
      setSelectedFile(null);
      setComment("");
      setValidationError(null);
      onOpenChange(false);
    }
  };

  const FileIcon = selectedFile
    ? FILE_ICONS[getFileTypeIcon(selectedFile.type)]
    : GenericFileIcon;

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
          {/* Drop zone with accessibility attributes */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="region"
            aria-label="Filopplastingsområde"
            aria-describedby="upload-description"
            className={cn(
              "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50",
              validationError && "border-destructive",
              uploadDocument.isPending && "pointer-events-none opacity-50"
            )}
          >
            <input
              type="file"
              onChange={handleFileSelect}
              className="absolute inset-0 cursor-pointer opacity-0"
              disabled={uploadDocument.isPending}
              aria-label="Velg fil for opplasting"
            />
            <Upload
              className={cn(
                "mb-4 h-10 w-10",
                isDragging ? "text-primary" : "text-muted-foreground"
              )}
              aria-hidden="true"
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
            <p
              id="upload-description"
              className="mt-1 text-xs text-muted-foreground"
            >
              Alle filtyper støttes (maks {MAX_FILE_SIZE_DISPLAY})
            </p>
            {validationError && (
              <p className="mt-2 flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {validationError}
              </p>
            )}
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

          {/* Comment field */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm text-muted-foreground">
              Kommentar (valgfritt)
            </Label>
            <Textarea
              id="comment"
              placeholder="Legg til en kort beskrivelse av dokumentet..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={uploadDocument.isPending}
              className="resize-none"
              rows={2}
            />
          </div>
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
