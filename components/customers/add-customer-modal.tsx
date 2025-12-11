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
import { CustomerForm } from "./customer-form";
import { useCreateCustomer } from "@/hooks/useCustomers";
import type { DomainCreateCustomerRequest } from "@/lib/.generated/data-contracts";

export function AddCustomerModal() {
  const [open, setOpen] = useState(false);
  const createCustomer = useCreateCustomer();

  const handleSubmit = async (data: DomainCreateCustomerRequest) => {
    try {
      await createCustomer.mutateAsync(data);
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
          Ny kunde
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-[600px]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Opprett ny kunde</DialogTitle>
          <DialogDescription>
            Legg til en ny kunde i systemet. Fyll ut informasjonen nedenfor.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
          <CustomerForm
            onSubmit={handleSubmit}
            isLoading={createCustomer.isPending}
            autoFocusSearch={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
