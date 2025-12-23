"use client";

import {
  useCustomerFiles,
  useDeleteFile,
  useDownloadFile,
  useOfferFiles,
  useOfferSupplierFiles,
  useProjectFiles,
  useSupplierFiles,
  useUploadCustomerFile,
  useUploadOfferFile,
  useUploadOfferSupplierFile,
  useUploadProjectFile,
  useUploadSupplierFile,
  FileDTO,
} from "@/hooks/useFiles";
import { FileManager } from "./file-manager";

interface BaseProps {
  className?: string;
}

export function CustomerFileManager({
  customerId,
}: BaseProps & { customerId: string }) {
  const { data: files = [], isLoading } = useCustomerFiles(customerId);
  const uploadMutation = useUploadCustomerFile();
  const deleteMutation = useDeleteFile();
  const downloadMutation = useDownloadFile();

  const handleUpload = async (file: File) => {
    await uploadMutation.mutateAsync({ customerId, file });
  };

  const handleDownload = (file: FileDTO) => {
    downloadMutation.mutate(file);
  };

  const handleDelete = async (file: FileDTO) => {
    await deleteMutation.mutateAsync(file.id!);
  };

  return (
    <FileManager
      files={files}
      isLoading={isLoading}
      onUpload={handleUpload}
      onDownload={handleDownload}
      onDelete={handleDelete}
      isUploading={uploadMutation.isPending}
      isDownloading={downloadMutation.isPending}
      isDeleting={deleteMutation.isPending}
    />
  );
}

export function ProjectFileManager({
  projectId,
}: BaseProps & { projectId: string }) {
  const { data: files = [], isLoading } = useProjectFiles(projectId);
  const uploadMutation = useUploadProjectFile();
  const deleteMutation = useDeleteFile();
  const downloadMutation = useDownloadFile();

  const handleUpload = async (file: File) => {
    await uploadMutation.mutateAsync({ projectId, file });
  };

  const handleDownload = (file: FileDTO) => {
    downloadMutation.mutate(file);
  };

  const handleDelete = async (file: FileDTO) => {
    await deleteMutation.mutateAsync(file.id!);
  };

  return (
    <FileManager
      files={files}
      isLoading={isLoading}
      onUpload={handleUpload}
      onDownload={handleDownload}
      onDelete={handleDelete}
      isUploading={uploadMutation.isPending}
      isDownloading={downloadMutation.isPending}
      isDeleting={deleteMutation.isPending}
    />
  );
}

export function OfferFileManager({ offerId }: BaseProps & { offerId: string }) {
  const { data: files = [], isLoading } = useOfferFiles(offerId);
  const uploadMutation = useUploadOfferFile();
  const deleteMutation = useDeleteFile();
  const downloadMutation = useDownloadFile();

  const handleUpload = async (file: File) => {
    await uploadMutation.mutateAsync({ offerId, file });
  };

  const handleDownload = (file: FileDTO) => {
    downloadMutation.mutate(file);
  };

  const handleDelete = async (file: FileDTO) => {
    await deleteMutation.mutateAsync(file.id!);
  };

  return (
    <FileManager
      files={files}
      isLoading={isLoading}
      onUpload={handleUpload}
      onDownload={handleDownload}
      onDelete={handleDelete}
      isUploading={uploadMutation.isPending}
      isDownloading={downloadMutation.isPending}
      isDeleting={deleteMutation.isPending}
    />
  );
}

export function SupplierFileManager({
  supplierId,
}: BaseProps & { supplierId: string }) {
  const { data: files = [], isLoading } = useSupplierFiles(supplierId);
  const uploadMutation = useUploadSupplierFile();
  const deleteMutation = useDeleteFile();
  const downloadMutation = useDownloadFile();

  const handleUpload = async (file: File) => {
    await uploadMutation.mutateAsync({ supplierId, file });
  };

  const handleDownload = (file: FileDTO) => {
    downloadMutation.mutate(file);
  };

  const handleDelete = async (file: FileDTO) => {
    await deleteMutation.mutateAsync(file.id!);
  };

  return (
    <FileManager
      files={files}
      isLoading={isLoading}
      onUpload={handleUpload}
      onDownload={handleDownload}
      onDelete={handleDelete}
      isUploading={uploadMutation.isPending}
      isDownloading={downloadMutation.isPending}
      isDeleting={deleteMutation.isPending}
    />
  );
}

export function OfferSupplierFileManager({
  offerId,
  supplierId,
}: BaseProps & { offerId: string; supplierId: string }) {
  const { data: files = [], isLoading } = useOfferSupplierFiles(
    offerId,
    supplierId
  );
  const uploadMutation = useUploadOfferSupplierFile();
  const deleteMutation = useDeleteFile();
  const downloadMutation = useDownloadFile();

  const handleUpload = async (file: File) => {
    await uploadMutation.mutateAsync({ offerId, supplierId, file });
  };

  const handleDownload = (file: FileDTO) => {
    downloadMutation.mutate(file);
  };

  const handleDelete = async (file: FileDTO) => {
    await deleteMutation.mutateAsync(file.id!);
  };

  return (
    <FileManager
      files={files}
      isLoading={isLoading}
      onUpload={handleUpload}
      onDownload={handleDownload}
      onDelete={handleDelete}
      isUploading={uploadMutation.isPending}
      isDownloading={downloadMutation.isPending}
      isDeleting={deleteMutation.isPending}
    />
  );
}
