"use client";

import { FileDTO } from "@/lib/api/types";
import { FileCard } from "./file-card";
import { FileUploadDropzone } from "./file-upload-dropzone";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface FileManagerProps {
  files: FileDTO[];
  isLoading: boolean;
  onUpload: (file: File) => Promise<void>;
  onDownload: (file: FileDTO) => void;
  onDelete: (file: FileDTO) => Promise<void>;
  isUploading?: boolean;
  isDownloading?: boolean;
  isDeleting?: boolean;
}

import { useState } from "react";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";

export function FileManager({
  files,
  isLoading,
  onUpload,
  onDownload,
  onDelete,
  isUploading,
  isDownloading,
  isDeleting,
}: FileManagerProps) {
  const [fileToDelete, setFileToDelete] = useState<FileDTO | null>(null);

  return (
    <div className="space-y-6">
      <FileUploadDropzone onUpload={onUpload} isUploading={isUploading} />

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Filer ({files.length})
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : files.length === 0 ? (
          <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
            Ingen filer lastet opp ennå
          </div>
        ) : (
          <ScrollArea className="max-h-[300px]">
            <div className="space-y-3">
              {files.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onDownload={onDownload}
                  onDelete={setFileToDelete}
                  isDownloading={isDownloading}
                  isDeleting={isDeleting && fileToDelete?.id === file.id}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={!!fileToDelete}
        onClose={() => setFileToDelete(null)}
        onConfirm={async () => {
          if (fileToDelete) {
            await onDelete(fileToDelete);
            setFileToDelete(null);
          }
        }}
        title="Slett fil?"
        description="Er du sikker på at du vil slette denne filen? Handlingen kan ikke angres."
        itemTitle={fileToDelete?.filename}
        isLoading={isDeleting}
      />
    </div>
  );
}
