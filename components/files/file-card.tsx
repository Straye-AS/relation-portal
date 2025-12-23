"use client";

import { FileDTO } from "@/lib/api/types";
import { formatBytes, formatRelativeDate } from "@/lib/utils";
import { FILE_ICONS, FileIconType } from "@/components/ui/file-icons";
import { Button } from "@/components/ui/button";
import { CompanyBadge } from "@/components/ui/company-badge";
import { Trash2, Loader2 } from "lucide-react";

interface FileCardProps {
  file: FileDTO;
  onDownload: (file: FileDTO) => void;
  onDelete: (file: FileDTO) => void;
  isDownloading?: boolean;
  isDeleting?: boolean;
}

function getFileIconType(filename: string | undefined): FileIconType {
  if (!filename) return "file";
  const ext = filename.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "doc":
    case "docx":
      return "word";
    case "xls":
    case "xlsx":
    case "csv":
      return "excel";
    case "ppt":
    case "pptx":
      return "powerpoint";
    case "pdf":
      return "pdf";
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "svg":
    case "webp":
      return "image";
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return "archive";
    case "msg":
    case "eml":
      return "outlook";
    default:
      return "file";
  }
}

export function FileCard({
  file,
  onDownload,
  onDelete,
  isDownloading,
  isDeleting,
}: FileCardProps) {
  const Icon = FILE_ICONS[getFileIconType(file.filename)];

  return (
    <div
      className="group flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
      onClick={() => onDownload(file)}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex-shrink-0">
          <Icon className="h-8 w-8" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium" title={file.filename}>
            {file.filename}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatBytes(file.size || 0)}</span>
            <span>•</span>
            <span>{formatRelativeDate(file.createdAt)}</span>
            {file.companyId && (
              <>
                <span>•</span>
                <CompanyBadge
                  companyId={file.companyId}
                  className="px-1.5 py-0 text-[10px]"
                />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {(isDownloading || isDeleting) && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"
          disabled={isDownloading || isDeleting}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(file);
          }}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Slett</span>
        </Button>
      </div>
    </div>
  );
}
