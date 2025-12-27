"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api/api-provider";
import { toast } from "sonner";
import { FileDTO } from "@/lib/api/types";
import { logger } from "@/lib/logging";

/**
 * Customer Files Hook
 */
export function useCustomerFiles(customerId: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["files", "customer", customerId],
    queryFn: async () => {
      const response = await api.files.filesList({ id: customerId });
      return response.data || [];
    },
    enabled: !!customerId,
  });
}

/**
 * Project Files Hook
 */
export function useProjectFiles(projectId: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["files", "project", projectId],
    queryFn: async () => {
      const response = await api.files.filesList3({ id: projectId });
      return response.data || [];
    },
    enabled: !!projectId,
  });
}

/**
 * Offer Files Hook
 */
export function useOfferFiles(offerId: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["files", "offer", offerId],
    queryFn: async () => {
      const response = await api.files.filesList2({ id: offerId });
      return response.data || [];
    },
    enabled: !!offerId,
  });
}

/**
 * Supplier Files Hook
 */
export function useSupplierFiles(supplierId: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["files", "supplier", supplierId],
    queryFn: async () => {
      const response = await api.files.filesList4({ id: supplierId });
      return response.data || [];
    },
    enabled: !!supplierId,
  });
}

/**
 * Offer-Supplier Files Hook
 */
export function useOfferSupplierFiles(offerId: string, supplierId: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["files", "offer-supplier", offerId, supplierId],
    queryFn: async () => {
      const response = await api.files.suppliersFilesList({
        offerId,
        supplierId,
      });
      return response.data || [];
    },
    enabled: !!offerId && !!supplierId,
  });
}

/**
 * Customer File Upload Hook
 */
import { useAuth } from "@/hooks/useAuth";
import { useCompanyStore } from "@/store/company-store";
import type { CompanyId } from "@/lib/api/types";

/**
 * Get the effective company ID for file uploads.
 * When "all" is selected, we use the user's assigned company.
 * Falls back to "gruppen" if no company is available.
 */
function getEffectiveCompanyId(
  selectedCompanyId: CompanyId,
  userCompanyId: CompanyId | null | undefined
): string {
  // If a specific company is selected (not "all"), use it
  if (selectedCompanyId !== "all") {
    return selectedCompanyId;
  }

  // If "all" is selected, use the user's assigned company
  if (userCompanyId && userCompanyId !== "all") {
    return userCompanyId;
  }

  // Fallback to "gruppen" as default
  return "gruppen";
}

/**
 * Helper for direct file uploads to bypass generated client issues with FormData
 *
 * @param includeCompanyInFormData - If true, adds company_id to form data (required for projects)
 */
async function uploadFileDirect(
  baseUrl: string,
  path: string,
  file: File,
  getAccessToken: () => Promise<string | null>,
  companyId: string | null,
  includeCompanyInFormData = false
) {
  const token = await getAccessToken();
  const formData = new FormData();
  formData.append("file", file, file.name);

  // For projects, company_id must be in form data (not just header)
  // Other entities inherit company from parent, but can override via form data
  if (companyId && includeCompanyInFormData) {
    formData.append("company_id", companyId);
  }

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (companyId) {
    headers["X-Company-ID"] = companyId;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error("Direct upload failed", {
      status: response.status,
      errorText,
    });
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Customer File Upload Hook
 */
export function useUploadCustomerFile() {
  const api = useApi();
  const queryClient = useQueryClient();
  const { getAccessToken } = useAuth();
  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);
  const userCompany = useCompanyStore((state) => state.userCompany);

  return useMutation({
    mutationFn: async ({
      customerId,
      file,
    }: {
      customerId: string;
      file: File;
    }) => {
      const effectiveCompanyId = getEffectiveCompanyId(
        selectedCompanyId,
        userCompany?.id
      );
      return uploadFileDirect(
        api.http.baseUrl,
        `/customers/${customerId}/files`,
        file,
        getAccessToken,
        effectiveCompanyId
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["files", "customer", variables.customerId],
      });
      toast.success("Fil lastet opp");
    },
    onError: (error: Error) => {
      logger.error("Customer upload failed", error);
      toast.error("Kunne ikke laste opp filen");
    },
  });
}

/**
 * Project File Upload Hook
 *
 * Note: Projects require company_id in form data since they are cross-company.
 * The company_id is added to the form data, not just the header.
 */
export function useUploadProjectFile() {
  const api = useApi();
  const queryClient = useQueryClient();
  const { getAccessToken } = useAuth();
  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);
  const userCompany = useCompanyStore((state) => state.userCompany);

  return useMutation({
    mutationFn: async ({
      projectId,
      file,
    }: {
      projectId: string;
      file: File;
    }) => {
      const effectiveCompanyId = getEffectiveCompanyId(
        selectedCompanyId,
        userCompany?.id
      );
      return uploadFileDirect(
        api.http.baseUrl,
        `/projects/${projectId}/files`,
        file,
        getAccessToken,
        effectiveCompanyId,
        true // Projects require company_id in form data
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["files", "project", variables.projectId],
      });
      toast.success("Fil lastet opp");
    },
    onError: (error: Error) => {
      logger.error("Project upload failed", error);
      toast.error("Kunne ikke laste opp filen");
    },
  });
}

/**
 * Offer File Upload Hook
 */
export function useUploadOfferFile() {
  const api = useApi();
  const queryClient = useQueryClient();
  const { getAccessToken } = useAuth();
  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);
  const userCompany = useCompanyStore((state) => state.userCompany);

  return useMutation({
    mutationFn: async ({ offerId, file }: { offerId: string; file: File }) => {
      const effectiveCompanyId = getEffectiveCompanyId(
        selectedCompanyId,
        userCompany?.id
      );
      return uploadFileDirect(
        api.http.baseUrl,
        `/offers/${offerId}/files`,
        file,
        getAccessToken,
        effectiveCompanyId
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["files", "offer", variables.offerId],
      });
      // Also invalidate offer details to update file count
      queryClient.invalidateQueries({
        queryKey: ["offers", variables.offerId, "details"],
      });
      toast.success("Fil lastet opp");
    },
    onError: (error: Error) => {
      logger.error("Offer upload failed", error);
      toast.error("Kunne ikke laste opp filen");
    },
  });
}

/**
 * Supplier File Upload Hook
 */
export function useUploadSupplierFile() {
  const api = useApi();
  const queryClient = useQueryClient();
  const { getAccessToken } = useAuth();
  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);
  const userCompany = useCompanyStore((state) => state.userCompany);

  return useMutation({
    mutationFn: async ({
      supplierId,
      file,
    }: {
      supplierId: string;
      file: File;
    }) => {
      const effectiveCompanyId = getEffectiveCompanyId(
        selectedCompanyId,
        userCompany?.id
      );
      return uploadFileDirect(
        api.http.baseUrl,
        `/suppliers/${supplierId}/files`,
        file,
        getAccessToken,
        effectiveCompanyId
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["files", "supplier", variables.supplierId],
      });
      toast.success("Fil lastet opp");
    },
    onError: (error: Error) => {
      logger.error("Supplier upload failed", error);
      toast.error("Kunne ikke laste opp filen");
    },
  });
}

/**
 * Offer-Supplier File Upload Hook
 */
export function useUploadOfferSupplierFile() {
  const api = useApi();
  const queryClient = useQueryClient();
  const { getAccessToken } = useAuth();
  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);
  const userCompany = useCompanyStore((state) => state.userCompany);

  return useMutation({
    mutationFn: async ({
      offerId,
      supplierId,
      file,
    }: {
      offerId: string;
      supplierId: string;
      file: File;
    }) => {
      const effectiveCompanyId = getEffectiveCompanyId(
        selectedCompanyId,
        userCompany?.id
      );
      return uploadFileDirect(
        api.http.baseUrl,
        `/offers/${offerId}/suppliers/${supplierId}/files`,
        file,
        getAccessToken,
        effectiveCompanyId
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "files",
          "offer-supplier",
          variables.offerId,
          variables.supplierId,
        ],
      });
      toast.success("Fil lastet opp");
    },
    onError: (error: Error) => {
      logger.error("Offer-Supplier upload failed", error);
      toast.error("Kunne ikke laste opp filen");
    },
  });
}

/**
 * Generic File Delete Hook
 *
 * Accepts an optional entityId and entityType to invalidate the correct detail queries
 */
export function useDeleteFile() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileId,
      entityId,
      entityType,
    }: {
      fileId: string;
      entityId?: string;
      entityType?: "offer" | "project" | "customer" | "supplier";
    }) => {
      await api.files.filesDelete({ id: fileId });
      return { entityId, entityType };
    },
    onSuccess: (result) => {
      // Invalidate all file queries to be safe
      queryClient.invalidateQueries({ queryKey: ["files"] });

      // Also invalidate entity details to update file count
      if (result?.entityId && result?.entityType === "offer") {
        queryClient.invalidateQueries({
          queryKey: ["offers", result.entityId, "details"],
        });
      }

      toast.success("Fil slettet");
    },
    onError: (error: Error) => {
      logger.error("Delete failed", error);
      toast.error("Kunne ikke slette filen");
    },
  });
}

/**
 * Generic File Download Hook
 *
 * Uses direct fetch to properly handle blob response since
 * the generated client doesn't support blob downloads correctly.
 */
export function useDownloadFile() {
  const api = useApi();
  const { getAccessToken } = useAuth();
  const companyId = useCompanyStore((state) => state.selectedCompanyId);

  return useMutation({
    mutationFn: async (file: FileDTO) => {
      if (!file.id) return;

      try {
        const token = await getAccessToken();
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        if (companyId && companyId !== "all") {
          headers["X-Company-ID"] = companyId;
        }

        const response = await fetch(
          `${api.http.baseUrl}/files/${file.id}/download`,
          {
            method: "GET",
            headers,
          }
        );

        if (!response.ok) {
          throw new Error(`Download failed: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.filename || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        logger.error("Download failed", error as Error);
        throw error;
      }
    },
    onError: () => {
      toast.error("Kunne ikke laste ned filen");
    },
  });
}

export type { FileDTO };
