"use client";

import { cn } from "@/lib/utils";

interface FileIconProps {
  className?: string;
}

export function WordIcon({ className }: FileIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6", className)}
    >
      <rect x="3" y="2" width="18" height="20" rx="2" fill="#2B579A" />
      <path
        d="M7 7H17M7 11H17M7 15H13"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <text
        x="12"
        y="19"
        textAnchor="middle"
        fill="white"
        fontSize="6"
        fontWeight="bold"
        fontFamily="system-ui"
      >
        W
      </text>
    </svg>
  );
}

export function ExcelIcon({ className }: FileIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6", className)}
    >
      <rect x="3" y="2" width="18" height="20" rx="2" fill="#217346" />
      <path
        d="M7 6H11V10H7V6ZM13 6H17V10H13V6ZM7 12H11V16H7V12ZM13 12H17V16H13V12Z"
        stroke="white"
        strokeWidth="1"
        fill="none"
      />
      <text
        x="12"
        y="20"
        textAnchor="middle"
        fill="white"
        fontSize="5"
        fontWeight="bold"
        fontFamily="system-ui"
      >
        X
      </text>
    </svg>
  );
}

export function PowerPointIcon({ className }: FileIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6", className)}
    >
      <rect x="3" y="2" width="18" height="20" rx="2" fill="#D24726" />
      <rect
        x="6"
        y="5"
        width="12"
        height="9"
        rx="1"
        fill="white"
        fillOpacity="0.9"
      />
      <circle cx="12" cy="9" r="2" fill="#D24726" />
      <text
        x="12"
        y="20"
        textAnchor="middle"
        fill="white"
        fontSize="5"
        fontWeight="bold"
        fontFamily="system-ui"
      >
        P
      </text>
    </svg>
  );
}

export function PdfIcon({ className }: FileIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6", className)}
    >
      <rect x="3" y="2" width="18" height="20" rx="2" fill="#E2574C" />
      <path
        d="M7 7H17M7 11H17M7 15H12"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <text
        x="12"
        y="20"
        textAnchor="middle"
        fill="white"
        fontSize="4.5"
        fontWeight="bold"
        fontFamily="system-ui"
      >
        PDF
      </text>
    </svg>
  );
}

export function ImageIcon({ className }: FileIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6", className)}
    >
      <rect x="3" y="2" width="18" height="20" rx="2" fill="#4CAF50" />
      <circle cx="9" cy="8" r="2" fill="white" />
      <path
        d="M6 16L10 12L13 15L16 11L18 14V18H6V16Z"
        fill="white"
        fillOpacity="0.9"
      />
    </svg>
  );
}

export function ArchiveIcon({ className }: FileIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6", className)}
    >
      <rect x="3" y="2" width="18" height="20" rx="2" fill="#FFC107" />
      <rect x="8" y="5" width="8" height="3" rx="0.5" fill="white" />
      <rect x="8" y="10" width="8" height="3" rx="0.5" fill="white" />
      <rect x="8" y="15" width="8" height="3" rx="0.5" fill="white" />
    </svg>
  );
}

export function GenericFileIcon({ className }: FileIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6", className)}
    >
      <rect x="3" y="2" width="18" height="20" rx="2" fill="#9E9E9E" />
      <path
        d="M7 7H17M7 11H17M7 15H13"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function OutlookIcon({ className }: FileIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6", className)}
    >
      <rect x="3" y="2" width="18" height="20" rx="2" fill="#0078D4" />
      <circle
        cx="12"
        cy="10"
        r="4"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
      <text
        x="12"
        y="20"
        textAnchor="middle"
        fill="white"
        fontSize="5"
        fontWeight="bold"
        fontFamily="system-ui"
      >
        O
      </text>
    </svg>
  );
}

/**
 * File icon type union for MS365 and common file formats
 */
export type FileIconType =
  | "word"
  | "excel"
  | "powerpoint"
  | "pdf"
  | "image"
  | "archive"
  | "outlook"
  | "file";

/**
 * Mapping of file icon types to their respective icon components
 */
export const FILE_ICONS: Record<
  FileIconType,
  React.ComponentType<{ className?: string }>
> = {
  word: WordIcon,
  excel: ExcelIcon,
  powerpoint: PowerPointIcon,
  pdf: PdfIcon,
  image: ImageIcon,
  archive: ArchiveIcon,
  outlook: OutlookIcon,
  file: GenericFileIcon,
};
