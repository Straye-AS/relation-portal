"use client";

import { useState, type KeyboardEvent } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Upload, Download, Trash2, FolderOpen } from "lucide-react";
import { PaginationControls } from "@/components/pagination-controls";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { DocumentUploadModal } from "./document-upload-modal";
import {
  useCustomerDocuments,
  useDeleteCustomerDocument,
  useDownloadDocument,
  formatFileSize,
  getFileTypeIcon,
  type CustomerDocument,
} from "@/hooks/useCustomerDocuments";
import { FILE_ICONS } from "@/components/ui/file-icons";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";

interface CustomerDocumentsTabProps {
  customerId: string;
}

export function CustomerDocumentsTab({
  customerId,
}: CustomerDocumentsTabProps) {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deleteDoc, setDeleteDoc] = useState<CustomerDocument | null>(null);

  const { data, isLoading } = useCustomerDocuments(customerId, {
    page,
    pageSize,
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
              Dokumenter knyttet til denne kunden
            </CardDescription>
          </div>
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Last opp
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={5} columns={4} />
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                Ingen dokumenter lastet opp ennå.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Last opp første dokument
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[35%]">Navn</TableHead>
                      <TableHead className="w-[30%]">Kommentar</TableHead>
                      <TableHead>Lastet opp</TableHead>
                      <TableHead className="text-right">Størrelse</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => {
                      const iconType = getFileTypeIcon(doc.contentType);
                      const IconComponent = FILE_ICONS[iconType];

                      const handleRowKeyDown = (
                        e: KeyboardEvent<HTMLTableRowElement>
                      ) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleDownload(doc);
                        }
                      };

                      return (
                        <TableRow
                          key={doc.id}
                          className="cursor-pointer hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          onClick={() => handleDownload(doc)}
                          onKeyDown={handleRowKeyDown}
                          tabIndex={0}
                          role="button"
                          aria-label={`Last ned dokument: ${doc.filename}`}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <IconComponent className="h-8 w-8 shrink-0" />
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
                            {doc.comment ? (
                              <span className="text-sm">{doc.comment}</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                -
                              </span>
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(doc);
                                }}
                                title="Last ned"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteDoc(doc);
                                }}
                                title="Slett"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
