"use client";

import { Fragment, useState, type KeyboardEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Truck,
  Trash2,
  ExternalLink,
  Loader2,
  Building2,
  ChevronDown,
  ChevronRight,
  FileText,
  User,
  Check,
  AlertTriangle,
  Upload,
  Download,
  FolderOpen,
  Files,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import {
  useOfferSuppliers,
  useRemoveOfferSupplier,
  useUpdateOfferSupplier,
  useUpdateOfferSupplierContact,
} from "@/hooks/useOfferSuppliers";
import { useSupplier } from "@/hooks/useSuppliers";
import { AddOfferSupplierModal } from "@/components/offers/add-offer-supplier-modal";
import { OfferSupplierFileManager } from "@/components/files/entity-file-manager";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { FILE_ICONS } from "@/components/ui/file-icons";
import { DomainOfferSupplierStatus } from "@/lib/.generated/data-contracts";
import type { DomainOfferSupplierWithDetailsDTO } from "@/lib/.generated/data-contracts";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";

const markdownComponents: Components = {
  p: ({ className, ...props }) => (
    <p className={cn("mb-2 leading-relaxed last:mb-0", className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("mb-2 list-disc pl-4", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("mb-2 list-decimal pl-4", className)} {...props} />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("mb-0.5", className)} {...props} />
  ),
  strong: ({ className, ...props }) => (
    <strong className={cn("font-semibold", className)} {...props} />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn("text-primary hover:underline", className)}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
};

interface OfferSuppliersTabProps {
  offerId: string;
}

const STATUS_LABELS: Record<string, string> = {
  active: "Aktiv",
  done: "Ferdig",
};

function OfferSupplierStatusBadge({
  status,
}: {
  status?: DomainOfferSupplierStatus | string;
}) {
  const safeStatus = status ?? "active";

  const getVariantStyles = (s: string) => {
    switch (s) {
      case "active":
        return "border-transparent bg-blue-500/15 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
      case "done":
        return "border-transparent bg-green-500/15 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20";
      default:
        return "border-transparent bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn("border font-medium", getVariantStyles(safeStatus))}
    >
      {STATUS_LABELS[safeStatus] || safeStatus}
    </Badge>
  );
}

interface ExpandedRowProps {
  offerSupplier: DomainOfferSupplierWithDetailsDTO;
  offerId: string;
  onDelete: () => void;
  isDeleting: boolean;
}

function ExpandedRowContent({
  offerSupplier,
  offerId,
  onDelete,
  isDeleting,
}: ExpandedRowProps) {
  const updateSupplier = useUpdateOfferSupplier();
  const updateContact = useUpdateOfferSupplierContact();
  const { data: supplierDetails } = useSupplier(
    offerSupplier.supplier?.id ?? ""
  );

  const [editedNotes, setEditedNotes] = useState(offerSupplier.notes ?? "");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const contacts = supplierDetails?.contacts ?? [];
  const selectedContact = contacts.find(
    (c) => c.id === offerSupplier.contactId
  );

  const handleNotesBlur = async () => {
    if (!offerSupplier.supplier?.id) return;

    // Only save if notes have changed
    if (editedNotes !== (offerSupplier.notes ?? "")) {
      try {
        await updateSupplier.mutateAsync({
          offerId,
          supplierId: offerSupplier.supplier.id,
          data: {
            notes: editedNotes || undefined,
          },
        });
      } catch {
        // Error handled by mutation hook - revert UI state
        setEditedNotes(offerSupplier.notes ?? "");
      }
    }
    setIsEditingNotes(false);
  };

  const handleContactSelect = async (contactId: string | null) => {
    if (!offerSupplier.supplier?.id) return;

    try {
      await updateContact.mutateAsync({
        offerId,
        supplierId: offerSupplier.supplier.id,
        contactId,
      });
      setIsContactModalOpen(false);
    } catch {
      // Error handled by mutation hook
    }
  };

  return (
    <div className="bg-muted/30 p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="details">Detaljer</TabsTrigger>
          <TabsTrigger value="files">Filer</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Category */}
            <div>
              <p className="mb-1 text-sm text-muted-foreground">Kategori</p>
              <div className="flex items-center gap-2">
                {offerSupplier.supplier?.category ? (
                  <span className="font-medium">
                    {offerSupplier.supplier.category}
                  </span>
                ) : (
                  <>
                    <span className="italic text-muted-foreground">
                      Ikke satt
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertTriangle className="h-4 w-4 cursor-pointer text-orange-500" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[280px]">
                        <p className="font-medium">Kategori mangler</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Denne leverandøren har ikke en kategori. Åpne
                          leverandøren for å sette kategori.
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 w-full"
                          asChild
                        >
                          <Link
                            href={`/suppliers/${offerSupplier.supplier?.id}`}
                            target="_blank"
                          >
                            Åpne leverandør
                          </Link>
                        </Button>
                      </TooltipContent>
                    </Tooltip>
                  </>
                )}
              </div>
            </div>

            {/* Contact Person */}
            <div>
              <p className="mb-1 text-sm text-muted-foreground">
                Kontaktperson
                {updateContact.isPending && (
                  <Loader2 className="ml-2 inline h-3 w-3 animate-spin" />
                )}
              </p>
              <div className="group flex items-center gap-2">
                {contacts.length > 0 ? (
                  <div
                    role="button"
                    onClick={() => setIsContactModalOpen(true)}
                    className="-ml-1 cursor-pointer rounded border border-transparent p-1 px-1 font-medium transition-colors hover:border-input hover:bg-transparent"
                  >
                    {selectedContact ? (
                      selectedContact.fullName ||
                      `${selectedContact.firstName || ""} ${selectedContact.lastName || ""}`.trim()
                    ) : (
                      <span className="italic text-muted-foreground">
                        Velg kontaktperson
                      </span>
                    )}
                  </div>
                ) : (
                  <>
                    <span className="italic text-muted-foreground">
                      Ingen kontakter
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertTriangle className="h-4 w-4 cursor-pointer text-orange-500" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[280px]">
                        <p className="font-medium">Ingen kontaktpersoner</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Denne leverandøren har ingen kontaktpersoner. Åpne
                          leverandøren for å legge til kontakter.
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 w-full"
                          asChild
                        >
                          <Link
                            href={`/suppliers/${offerSupplier.supplier?.id}`}
                            target="_blank"
                          >
                            Åpne leverandør
                          </Link>
                        </Button>
                      </TooltipContent>
                    </Tooltip>
                  </>
                )}
              </div>

              {/* Contact Selection Dialog */}
              <Dialog
                open={isContactModalOpen}
                onOpenChange={setIsContactModalOpen}
              >
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Velg kontaktperson</DialogTitle>
                    <DialogDescription>
                      Velg en kontaktperson fra {offerSupplier.supplier?.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-1">
                    {/* None option */}
                    <button
                      onClick={() => handleContactSelect(null)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                        !offerSupplier.contactId && "bg-muted"
                      )}
                    >
                      <span className="text-muted-foreground">Ingen valgt</span>
                      {!offerSupplier.contactId && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                    {/* Contact options */}
                    {contacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => handleContactSelect(contact.id ?? null)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                          offerSupplier.contactId === contact.id && "bg-muted"
                        )}
                      >
                        <div>
                          <div className="font-medium">
                            {contact.fullName ||
                              `${contact.firstName || ""} ${contact.lastName || ""}`.trim()}
                          </div>
                          {contact.title && (
                            <div className="text-xs text-muted-foreground">
                              {contact.title}
                            </div>
                          )}
                        </div>
                        {offerSupplier.contactId === contact.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Notes with Markdown */}
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              Notater
              {updateSupplier.isPending && (
                <Loader2 className="h-3 w-3 animate-spin" />
              )}
            </p>

            {isEditingNotes ? (
              <div className="space-y-1">
                <Textarea
                  autoFocus
                  placeholder="Notater om leverandøren for dette tilbudet... (Markdown støttes)"
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  onBlur={handleNotesBlur}
                  rows={4}
                  className="font-mono text-sm"
                />
                <span className="text-xs text-muted-foreground">
                  Markdown: **bold**, *italic*, - lister - Klikk utenfor for å
                  lagre
                </span>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingNotes(true)}
                className={cn(
                  "min-h-[60px] cursor-pointer rounded-md border border-transparent p-3 text-sm transition-colors hover:border-muted hover:bg-muted/30",
                  !editedNotes && "flex items-center justify-center"
                )}
              >
                {editedNotes ? (
                  <ReactMarkdown components={markdownComponents}>
                    {editedNotes}
                  </ReactMarkdown>
                ) : (
                  <span className="text-muted-foreground">
                    Klikk for å legge til notater...
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/suppliers/${offerSupplier.supplier?.id}`}
                  target="_blank"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Åpne leverandør
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                disabled={isDeleting}
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Fjern fra tilbud
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="files">
          <OfferSupplierFileManager
            offerId={offerId}
            supplierId={offerSupplier.supplier?.id ?? ""}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function OfferSuppliersTab({ offerId }: OfferSuppliersTabProps) {
  const { data: suppliers, isLoading } = useOfferSuppliers(offerId);
  const removeSupplier = useRemoveOfferSupplier();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [supplierToDelete, setSupplierToDelete] =
    useState<DomainOfferSupplierWithDetailsDTO | null>(null);

  const existingSupplierIds = suppliers?.map((s) => s.supplier?.id ?? "") ?? [];

  const handleRemoveSupplier = async () => {
    if (!supplierToDelete?.supplier?.id) return;

    try {
      await removeSupplier.mutateAsync({
        offerId,
        supplierId: supplierToDelete.supplier.id,
      });
      setSupplierToDelete(null);
      setExpandedId(null);
    } catch {
      // Error handled by mutation hook
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Leverandører
          </CardTitle>
          <CardDescription>
            Leverandører som er koblet til dette tilbudet
          </CardDescription>
        </div>
        <AddOfferSupplierModal
          offerId={offerId}
          existingSupplierIds={existingSupplierIds}
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !suppliers || suppliers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Ingen leverandører</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Det er ikke lagt til noen leverandører på dette tilbudet ennå.
              Klikk &quot;Legg til leverandør&quot; for å komme i gang.
            </p>
          </div>
        ) : (
          <div className="overflow-auto rounded-md border">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Leverandør</TableHead>
                  <TableHead>Kontaktperson</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((offerSupplier) => {
                  const isExpanded = expandedId === offerSupplier.id;
                  return (
                    <Fragment key={offerSupplier.id}>
                      <TableRow
                        className={cn(
                          "cursor-pointer transition-colors hover:bg-muted/50",
                          isExpanded && "bg-muted/50"
                        )}
                        onClick={() => toggleExpanded(offerSupplier.id ?? "")}
                      >
                        <TableCell className="w-[40px]">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <div>
                              <div className="font-medium">
                                {offerSupplier.supplier?.name}
                              </div>
                              {offerSupplier.supplier?.orgNumber && (
                                <div className="text-sm text-muted-foreground">
                                  Org.nr: {offerSupplier.supplier.orgNumber}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {offerSupplier.contactName ? (
                            <div className="flex items-center gap-2">
                              <User className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm">
                                {offerSupplier.contactName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {offerSupplier.supplier?.category ? (
                            <Badge variant="secondary">
                              {offerSupplier.supplier.category}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <OfferSupplierStatusBadge
                            status={offerSupplier.status}
                          />
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow key={`${offerSupplier.id}-expanded`}>
                          <TableCell colSpan={5} className="p-0">
                            <ExpandedRowContent
                              offerSupplier={offerSupplier}
                              offerId={offerId}
                              onDelete={() =>
                                setSupplierToDelete(offerSupplier)
                              }
                              isDeleting={
                                removeSupplier.isPending &&
                                supplierToDelete?.id === offerSupplier.id
                              }
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <DeleteConfirmationModal
        isOpen={!!supplierToDelete}
        onClose={() => setSupplierToDelete(null)}
        onConfirm={handleRemoveSupplier}
        isLoading={removeSupplier.isPending}
        title="Fjern leverandør"
        description={`Er du sikker på at du vil fjerne ${supplierToDelete?.supplier?.name} fra dette tilbudet?`}
        itemTitle={supplierToDelete?.supplier?.name}
      />
    </Card>
  );
}
