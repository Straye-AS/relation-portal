"use client";

import { useState, lazy, Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useCreateSupplier } from "@/hooks/useSuppliers";
import type { DomainCreateSupplierRequest } from "@/lib/.generated/data-contracts";

const SupplierForm = lazy(() =>
  import("./supplier-form").then((mod) => ({ default: mod.SupplierForm }))
);

export function AddSupplierModal() {
  const [open, setOpen] = useState(false);
  const createSupplier = useCreateSupplier();

  const handleSubmit = async (data: DomainCreateSupplierRequest) => {
    try {
      await createSupplier.mutateAsync(data);
      setOpen(false);
    } catch {
      // Error is handled by the mutation hook (toast)
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ny leverandør
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-[600px]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Opprett ny leverandør</DialogTitle>
          <DialogDescription>
            Legg til en ny leverandør i systemet. Fyll ut informasjonen
            nedenfor.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            }
          >
            <SupplierForm
              onSubmit={handleSubmit}
              isLoading={createSupplier.isPending}
              autoFocusSearch={true}
            />
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  );
}
