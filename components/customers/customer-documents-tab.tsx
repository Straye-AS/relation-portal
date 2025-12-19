"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Upload,
  Download,
  Trash2,
  FileText,
  FileSpreadsheet,
  Image,
  File,
  FileArchive,
  FolderOpen,
} from "lucide-react";
import { PaginationControls } from "@/components/pagination-controls";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { DocumentUploadModal } from "./document-upload-modal";
import {
  useCustomerDocuments,
  useDeleteCustomerDocument,
  useDownloadDocument,
  formatFileSize,
  getFileTypeIcon,
  type DocumentSource,
  type CustomerDocument,
} from "@/hooks/useCustomerDocuments";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface CustomerDocumentsTabProps {
  customerId: string;
}

const FILE_ICONS = {
  pdf: FileText,
  spreadsheet: FileSpreadsheet,
  document: FileText,
  image: Image,
  archive: FileArchive,
  file: File,
};

const SOURCE_LABELS: Record<DocumentSource, string> = {
  customer: "Kunde",
  offer: "Tilbud",
  project: "Prosjekt",
};

const SOURCE_COLORS: Record<DocumentSource, string> = {
  customer: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  offer:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  project: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

export function CustomerDocumentsTab({
  customerId,
}: CustomerDocumentsTabProps) {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deleteDoc, setDeleteDoc] = useState<CustomerDocument | null>(null);

  const { data, isLoading } = useCustomerDocuments(customerId, {
    page,
    pageSize,
    source:
      sourceFilter === "all" ? undefined : (sourceFilter as DocumentSource),
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const deleteDocument = useDeleteCustomerDocument();
  const downloadDocument = useDownloadDocument();

  const documents = data?.data ?? [];

  const handleDownload = (doc: CustomerDocument) => {
    downloadDocument.mutate({ document: doc });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDoc) return;
    await deleteDocument.mutateAsync({
      customerId,
      documentId: deleteDoc.id,
    });
    setDeleteDoc(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Dokumenter</CardTitle>
            <CardDescription>
              Dokumenter knyttet til kunden og deres tilbud/prosjekter
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select
              value={sourceFilter}
              onValueChange={(val) => {
                setSourceFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Kilde" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle kilder</SelectItem>
                <SelectItem value="customer">Kunde</SelectItem>
                <SelectItem value="offer">Tilbud</SelectItem>
                <SelectItem value="project">Prosjekt</SelectItem>
              </SelectContent>
            </Select>

            {sourceFilter !== "all" && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSourceFilter("all");
                  setPage(1);
                }}
                className="px-2 lg:px-3"
              >
                Nullstill
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}

            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Last opp
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={5} columns={5} />
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                {sourceFilter !== "all"
                  ? "Ingen dokumenter med valgt filter."
                  : "Ingen dokumenter lastet opp ennå."}
              </p>
              {sourceFilter === "all" && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Last opp første dokument
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Navn</TableHead>
                      <TableHead>Kilde</TableHead>
                      <TableHead>Lastet opp</TableHead>
                      <TableHead className="text-right">Størrelse</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => {
                      const iconType = getFileTypeIcon(doc.contentType);
                      const IconComponent = FILE_ICONS[iconType];

                      return (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                                <IconComponent className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-medium">
                                  {doc.filename}
                                </p>
                                {doc.createdByName && (
                                  <p className="text-xs text-muted-foreground">
                                    av {doc.createdByName}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={cn(
                                "font-normal",
                                SOURCE_COLORS[doc.source]
                              )}
                            >
                              {SOURCE_LABELS[doc.source]}
                            </Badge>
                            {doc.sourceName && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {doc.sourceName}
                              </p>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(doc.createdAt), {
                                addSuffix: true,
                                locale: nb,
                              })}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-sm text-muted-foreground">
                              {formatFileSize(doc.size)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDownload(doc)}
                                title="Last ned"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              {doc.source === "customer" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={() => setDeleteDoc(doc)}
                                  title="Slett"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {data && data.total > pageSize && (
                <PaginationControls
                  currentPage={page}
                  totalPages={Math.ceil(data.total / pageSize)}
                  onPageChange={setPage}
                  pageSize={pageSize}
                  totalCount={data.total}
                  entityName="dokumenter"
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <DocumentUploadModal
        customerId={customerId}
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
      />

      <AlertDialog open={!!deleteDoc} onOpenChange={() => setDeleteDoc(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Slett dokument?</AlertDialogTitle>
            <AlertDialogDescription>
              Er du sikker på at du vil slette &quot;{deleteDoc?.filename}
              &quot;? Denne handlingen kan ikke angres.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteConfirm}
            >
              Slett
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
