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
import { useCreateOffer } from "@/hooks/useOffers";

// Lazy load the form component to reduce initial bundle size
const OfferForm = lazy(() =>
  import("./offer-form").then((mod) => ({ default: mod.OfferForm }))
);
import type { DomainCreateOfferRequest } from "@/lib/.generated/data-contracts";
import { OfferStatusBadge } from "./offer-status-badge";
import { useCompanyStore } from "@/store/company-store";

export interface AddOfferModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultCustomerId?: string;
  defaultProjectId?: string;
  showCustomerWarning?: boolean;
  lockedCustomerId?: string; // New prop for locking customer
  trigger?: React.ReactNode;
  hideTrigger?: boolean;
}

export function AddOfferModal({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultCustomerId,
  defaultProjectId,
  showCustomerWarning,
  lockedCustomerId,
  trigger,
  hideTrigger,
}: AddOfferModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;

  const createOffer = useCreateOffer();
  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);

  // If the currently selected company is "all" or "gruppen", we force the user to choose a specific company
  // otherwise we default to the currently selected company
  const isGenericContext =
    selectedCompanyId === "all" || selectedCompanyId === "gruppen";
  const defaultCompanyId = isGenericContext ? "" : selectedCompanyId;

  const handleSubmit = async (data: DomainCreateOfferRequest) => {
    try {
      await createOffer.mutateAsync(data);
      setOpen(false);
    } catch {
      // Error is handled by the mutation hook (toast)
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        !controlledOpen &&
        !hideTrigger && (
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nytt tilbud
            </Button>
          </DialogTrigger>
        )
      )}
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-[700px]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Opprett nytt tilbud</DialogTitle>
          <DialogDescription asChild>
            <div>
              Opprett et nytt tilbud. Fyll ut nødvendig informasjon. <br />
              Tilbudet vil bli lagret med status{" "}
              <OfferStatusBadge phase="in_progress" />
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
          {/* Key on open to re-mount form and reset defaults when opened anew */}
          {open && (
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              }
            >
              <OfferForm
                onSubmit={handleSubmit}
                isLoading={createOffer.isPending}
                initialData={{
                  customerId: defaultCustomerId,
                  projectId: defaultProjectId,
                  companyId: defaultCompanyId,
                }}
                showCompanySelect
                showCustomerWarning={showCustomerWarning}
                lockedCustomerId={lockedCustomerId}
              />
            </Suspense>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
