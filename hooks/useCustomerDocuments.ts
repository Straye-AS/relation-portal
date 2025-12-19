"use client";

/**
 * Customer Documents Hooks
 *
 * React Query hooks for customer document operations.
 * Currently uses mock data until backend is ready.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export type DocumentSource = "customer" | "offer" | "project";

export interface CustomerDocument {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  createdAt: string;
  createdByName?: string;
  source: DocumentSource;
  sourceId?: string;
  sourceName?: string;
}

export interface CustomerDocumentsParams {
  source?: DocumentSource;
  page?: number;
  pageSize?: number;
  sortBy?: "filename" | "createdAt" | "size";
  sortOrder?: "asc" | "desc";
}

export interface CustomerDocumentsResponse {
  data: CustomerDocument[];
  total: number;
  page: number;
  pageSize: number;
}

// Mock data for development until backend is ready
const MOCK_DOCUMENTS: CustomerDocument[] = [
  {
    id: "doc-1",
    filename: "Kontrakt-2024.pdf",
    contentType: "application/pdf",
    size: 245000,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdByName: "Ola Nordmann",
    source: "customer",
  },
  {
    id: "doc-2",
    filename: "Budsjett-Q1.xlsx",
    contentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 89000,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdByName: "Kari Hansen",
    source: "offer",
    sourceId: "offer-123",
    sourceName: "Tilbud #2024-001",
  },
  {
    id: "doc-3",
    filename: "Prosjektplan.docx",
    contentType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 156000,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdByName: "Per Olsen",
    source: "project",
    sourceId: "project-456",
    sourceName: "Prosjekt Alfa",
  },
  {
    id: "doc-4",
    filename: "Møtereferat-15jan.pdf",
    contentType: "application/pdf",
    size: 78000,
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    createdByName: "Ola Nordmann",
    source: "customer",
  },
  {
    id: "doc-5",
    filename: "Fasade-foto.jpg",
    contentType: "image/jpeg",
    size: 1200000,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdByName: "Kari Hansen",
    source: "project",
    sourceId: "project-456",
    sourceName: "Prosjekt Alfa",
  },
];

/**
 * Fetch documents for a customer
 */
export function useCustomerDocuments(
  customerId: string,
  params?: CustomerDocumentsParams,
  options?: { enabled?: boolean }
) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["customer-documents", customerId, params],
    queryFn: async (): Promise<CustomerDocumentsResponse> => {
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.customers.documentsList({ id: customerId, ...params });
      // return response.data;

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filtered = [...MOCK_DOCUMENTS];

      // Filter by source
      if (params?.source) {
        filtered = filtered.filter((doc) => doc.source === params.source);
      }

      // Sort
      const sortBy = params?.sortBy || "createdAt";
      const sortOrder = params?.sortOrder || "desc";
      filtered.sort((a, b) => {
        let comparison = 0;
        if (sortBy === "filename") {
          comparison = a.filename.localeCompare(b.filename);
        } else if (sortBy === "size") {
          comparison = a.size - b.size;
        } else {
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return sortOrder === "desc" ? -comparison : comparison;
      });

      // Paginate
      const page = params?.page || 1;
      const pageSize = params?.pageSize || 20;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginated = filtered.slice(start, end);

      return {
        data: paginated,
        total: filtered.length,
        page,
        pageSize,
      };
    },
    enabled: !!customerId && isAuthenticated && (options?.enabled ?? true),
  });
}

/**
 * Upload a document to a customer
 */
export function useUploadCustomerDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customerId: _customerId,
      file,
    }: {
      customerId: string;
      file: File;
    }) => {
      // TODO: Replace with actual API call when backend is ready
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await api.customers.documentsCreate({ id: customerId }, formData);
      // return response.data;

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, just return a mock response
      const mockDoc: CustomerDocument = {
        id: `doc-${Date.now()}`,
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        size: file.size,
        createdAt: new Date().toISOString(),
        createdByName: "Du",
        source: "customer",
      };

      return mockDoc;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["customer-documents", variables.customerId],
      });
      toast.success("Dokument lastet opp (mock - backend ikke klar)");
    },
    onError: (error: Error) => {
      console.error("Failed to upload document:", error);
      toast.error("Kunne ikke laste opp dokumentet");
    },
  });
}

/**
 * Delete a customer document
 */
export function useDeleteCustomerDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customerId: _customerId,
      documentId: _documentId,
    }: {
      customerId: string;
      documentId: string;
    }) => {
      // TODO: Replace with actual API call when backend is ready
      // await api.customers.documentsDelete({ id: _customerId, _documentId });

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["customer-documents", variables.customerId],
      });
      toast.success("Dokument slettet (mock - backend ikke klar)");
    },
    onError: (error: Error) => {
      console.error("Failed to delete document:", error);
      toast.error("Kunne ikke slette dokumentet");
    },
  });
}

/**
 * Download a document
 */
export function useDownloadDocument() {
  return useMutation({
    mutationFn: async ({ document }: { document: CustomerDocument }) => {
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.files.downloadList({ id: document.id });
      // Create blob and trigger download

      // For now, just show a message
      toast.info(
        `Nedlasting av "${document.filename}" (mock - backend ikke klar)`
      );

      return { success: true };
    },
    onError: (error: Error) => {
      console.error("Failed to download document:", error);
      toast.error("Kunne ikke laste ned dokumentet");
    },
  });
}

/**
 * Get file type icon name based on MIME type
 */
export function getFileTypeIcon(
  contentType: string
): "pdf" | "spreadsheet" | "document" | "image" | "archive" | "file" {
  if (contentType.includes("pdf")) return "pdf";
  if (contentType.includes("spreadsheet") || contentType.includes("excel"))
    return "spreadsheet";
  if (contentType.includes("word") || contentType.includes("document"))
    return "document";
  if (contentType.startsWith("image/")) return "image";
  if (contentType.includes("zip") || contentType.includes("rar"))
    return "archive";
  return "file";
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
