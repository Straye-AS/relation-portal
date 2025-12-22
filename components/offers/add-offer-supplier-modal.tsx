"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SupplierStatusBadge } from "@/components/suppliers/supplier-status-badge";
import {
  Plus,
  Loader2,
  Search,
  MapPin,
  Check,
  ExternalLink,
  Mail,
  Phone,
} from "lucide-react";
import { useAllSuppliers } from "@/hooks/useSuppliers";
import { useAddOfferSupplier } from "@/hooks/useOfferSuppliers";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { DomainSupplierDTO } from "@/lib/.generated/data-contracts";

interface AddOfferSupplierModalProps {
  offerId: string;
  existingSupplierIds?: string[];
}

export function AddOfferSupplierModal({
  offerId,
  existingSupplierIds = [],
}: AddOfferSupplierModalProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSupplier, setSelectedSupplier] =
    useState<DomainSupplierDTO | null>(null);
  const [notes, setNotes] = useState("");

  const { data: suppliers, isLoading: isLoadingSuppliers } = useAllSuppliers({
    enabled: open,
  });
  const addSupplier = useAddOfferSupplier();

  // Filter suppliers based on search and exclude already linked suppliers
  const filteredSuppliers = useMemo(() => {
    if (!suppliers) return [];

    return suppliers.filter((supplier) => {
      // Exclude already linked suppliers
      if (existingSupplierIds.includes(supplier.id ?? "")) return false;

      // Filter by search
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          supplier.name?.toLowerCase().includes(searchLower) ||
          supplier.orgNumber?.includes(search) ||
          supplier.city?.toLowerCase().includes(searchLower) ||
          supplier.category?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [suppliers, existingSupplierIds, search]);

  const handleSubmit = async () => {
    if (!selectedSupplier?.id) return;

    try {
      await addSupplier.mutateAsync({
        offerId,
        data: {
          supplierId: selectedSupplier.id,
          notes: notes || undefined,
        },
      });
      setOpen(false);
      resetForm();
    } catch {
      // Error is handled by the mutation hook (toast)
    }
  };

  const resetForm = () => {
    setSelectedSupplier(null);
    setNotes("");
    setSearch("");
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Legg til leverandør
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] w-[95vw] max-w-[95vw] flex-col overflow-hidden p-0 lg:max-w-4xl xl:max-w-5xl">
        <DialogHeader className="flex-none border-b p-6">
          <DialogTitle>Legg til leverandør</DialogTitle>
          <DialogDescription>
            Velg en leverandør som skal kobles til dette tilbudet.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
          {/* Search and selected info */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Søk etter leverandør..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            {selectedSupplier && (
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Valgt:</span>
                <span className="font-medium">{selectedSupplier.name}</span>
              </div>
            )}
          </div>

          {/* Supplier table */}
          <div className="flex-1 overflow-y-auto rounded-lg border">
            {isLoadingSuppliers ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredSuppliers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-sm text-muted-foreground">
                  {search
                    ? "Ingen leverandører funnet"
                    : existingSupplierIds.length > 0
                      ? "Alle leverandører er allerede lagt til"
                      : "Ingen leverandører registrert"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Leverandør</TableHead>
                    <TableHead>Kontaktinfo</TableHead>
                    <TableHead>Lokasjon</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow
                      key={supplier.id}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-muted/50",
                        selectedSupplier?.id === supplier.id && "bg-muted"
                      )}
                      onClick={() => setSelectedSupplier(supplier)}
                    >
                      <TableCell>
                        <div
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-full border",
                            selectedSupplier?.id === supplier.id
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/30"
                          )}
                        >
                          {selectedSupplier?.id === supplier.id && (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={`https://avatar.vercel.sh/${supplier.name}`}
                              alt={supplier.name}
                            />
                            <AvatarFallback>
                              {supplier.name?.substring(0, 2).toUpperCase() ??
                                "??"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">
                            <div>{supplier.name}</div>
                            <Badge variant="outline" className="font-normal">
                              {supplier.orgNumber
                                ? `Org.nr: ${supplier.orgNumber}`
                                : "Uten org.nr"}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          {supplier.email && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span>{supplier.email}</span>
                            </div>
                          )}
                          {supplier.phone && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{supplier.phone}</span>
                            </div>
                          )}
                          {!supplier.email && !supplier.phone && (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {supplier.city ? (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{supplier.city}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {supplier.category ? (
                          <Badge variant="secondary">{supplier.category}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <SupplierStatusBadge
                          status={supplier.status ?? "active"}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Notes field (shown when supplier is selected) */}
          {selectedSupplier && (
            <div className="flex-none space-y-2">
              <Label htmlFor="notes">Notater (valgfritt)</Label>
              <Textarea
                id="notes"
                placeholder="Eventuelle notater om leverandøren for dette tilbudet..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-none items-center justify-between border-t bg-muted/30 p-6">
          <Link
            href="/suppliers"
            target="_blank"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-3 w-3" />
            Administrer leverandører
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Avbryt
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedSupplier || addSupplier.isPending}
            >
              {addSupplier.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Legg til
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
