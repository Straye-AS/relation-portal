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

export function AddOfferModal() {
  const [open, setOpen] = useState(false);
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
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nytt tilbud
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-[700px]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Opprett nytt tilbud</DialogTitle>
          <DialogDescription>
            Opprett et nytt tilbud for en kunde. Legg til varelinjer og
            detaljer.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
          <OfferForm
            onSubmit={handleSubmit}
            isLoading={createOffer.isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
