"use client";

import { lazy, Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useUpdateOffer } from "@/hooks/useOffers";
import type {
  DomainOfferDTO,
  DomainCreateOfferRequest,
} from "@/lib/.generated/data-contracts";
import { DomainOfferPhase } from "@/lib/.generated/data-contracts";

// Lazy load the form component to reduce initial bundle size
const OfferForm = lazy(() =>
  import("@/components/offers/offer-form").then((mod) => ({
    default: mod.OfferForm,
  }))
);

interface ConvertRequestModalProps {
  offer: DomainOfferDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ConvertRequestModal({
  offer,
  isOpen,
  onClose,
}: ConvertRequestModalProps) {
  const updateOffer = useUpdateOffer();

  if (!offer) return null;

  const handleSubmit = async (
    data: DomainCreateOfferRequest & { companyId?: string }
  ) => {
    try {
      // Prepare update payload
      // We are "converting" which implies setting the phase to in_progress (or active)
      // and checking if company is set.

      const updatePayload = {
        ...data,
        phase: DomainOfferPhase.OfferPhaseInProgress, // Move out of draft
        companyId: data.companyId, // Ensure companyId is included
      };

      await updateOffer.mutateAsync({
        id: offer.id!,
        data: updatePayload as any, // DomainUpdateOfferRequest overlaps with Create mostly
      });

      onClose();
    } catch (error) {
      console.error("Failed to convert request:", error);
      // Toast is handled in hook
    }
  };

  // Map offer to form values
  const initialData = {
    title: offer.title ?? "",
    customerId: offer.customerId ?? "",
    companyId: offer.companyId as string, // Cast to string if needed
    description: offer.description ?? "",
    probability: offer.probability ?? 50,
    items: offer.items?.map((item) => ({
      description: item.description ?? "",
      quantity: item.quantity ?? 1,
      unitPrice: (item.revenue ?? 0) / (item.quantity ?? 1) || 0,
    })) ?? [{ description: "", quantity: 1, unitPrice: 0 }],
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-[700px]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Konverter forespørsel til tilbud</DialogTitle>
          <DialogDescription>
            Velg selskap og legg til detaljer for å konvertere forespørselen til
            et aktivt tilbud.
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
            <OfferForm
              onSubmit={handleSubmit}
              isLoading={updateOffer.isPending}
              initialData={initialData}
              showCompanySelect={true}
            />
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  );
}
