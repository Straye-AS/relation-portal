"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { OfferForm } from "./offer-form";
import { useCreateOffer } from "@/hooks/useOffers";
import type { DomainCreateOfferRequest } from "@/lib/.generated/data-contracts";
import { OfferStatusBadge } from "./offer-status-badge";

export interface AddOfferModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultCustomerId?: string;
  defaultProjectId?: string;
  showCustomerWarning?: boolean;
  trigger?: React.ReactNode;
  hideTrigger?: boolean;
}

export function AddOfferModal({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultCustomerId,
  defaultProjectId,
  showCustomerWarning,
  trigger,
  hideTrigger,
}: AddOfferModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;

  const createOffer = useCreateOffer();

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
            <OfferForm
              onSubmit={handleSubmit}
              isLoading={createOffer.isPending}
              initialData={{
                customerId: defaultCustomerId,
                projectId: defaultProjectId,
              }}
              showCustomerWarning={showCustomerWarning}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
