"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DomainCreateProjectRequest } from "@/lib/.generated/data-contracts";
import {
  DomainCompanyID,
  DomainCreateProjectRequestPhaseEnum,
} from "@/lib/.generated/data-contracts";
import { useAllCustomers } from "@/hooks/useCustomers";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SmartDatePicker } from "@/components/ui/smart-date-picker";
// Note: CustomerSelectionModal is defined locally below to match OfferForm's behavior.
// I should probably extract it or redefine it here.
// For now, I will include a simple version here or reuse if possible.
// Actually, I'll copy the CustomerSelectionModal code here for now to avoid dependency issues
// unless I see a shared component.

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomerListTable } from "@/components/customers/customer-list-table";
import { Search, ChevronsUpDown } from "lucide-react";
import type { DomainCustomerDTO } from "@/lib/.generated/data-contracts";

const projectSchema = z.object({
  name: z.string().min(2, "Navn må være minst 2 tegn").max(200),
  customerId: z.string().min(1, "Du må velge en kunde"),
  companyId: z.string().optional(),
  description: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  projectNumber: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  onSubmit: (data: DomainCreateProjectRequest) => Promise<void>;
  isLoading: boolean;
  initialData?: Partial<ProjectFormValues>;
  lockedCustomerId?: string;
}

export function ProjectForm({
  onSubmit,
  isLoading,
  initialData,
  lockedCustomerId,
}: ProjectFormProps) {
  const { data: customers } = useAllCustomers();
  const { user } = useCurrentUser();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      customerId: lockedCustomerId ?? initialData?.customerId ?? "",
      companyId: user?.company?.id ?? "",
      description: initialData?.description ?? "",
      startDate: initialData?.startDate ?? new Date(),
      endDate: undefined,
      projectNumber: initialData?.projectNumber ?? "",
    },
  });

  const handleSubmit = async (values: ProjectFormValues) => {
    const payload: DomainCreateProjectRequest = {
      ...values,
      companyId:
        (values.companyId as DomainCompanyID) || DomainCompanyID.CompanyGruppen, // Fallback
      phase: DomainCreateProjectRequestPhaseEnum.Tilbud, // Default to tilbud?
      managerId: user?.id, // Default to current user as manager?
      customerId: values.customerId,
      name: values.name,
      startDate: values.startDate?.toISOString(),
      endDate: values.endDate?.toISOString(),
      // Ensure required fields are set
      value: 0,
      completionPercent: 0,
    };
    await onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Prosjektnavn <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Eks: Ombygging av lager" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Kunde <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                {lockedCustomerId ? (
                  <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                    {customers?.find((c) => c.id === lockedCustomerId)?.name ||
                      "Kunde"}
                    <span className="ml-auto text-xs font-normal">(Låst)</span>
                  </div>
                ) : (
                  <CustomerSelectionModal
                    customers={customers ?? []}
                    selectedCustomerId={field.value}
                    onSelect={(customerId) => {
                      field.onChange(customerId);
                    }}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Startdato</FormLabel>
                <FormControl>
                  <SmartDatePicker
                    value={field.value}
                    onSelect={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Sluttdato</FormLabel>
                <FormControl>
                  <SmartDatePicker
                    value={field.value}
                    onSelect={field.onChange}
                    disabledDates={(date) =>
                      form.getValues("startDate")
                        ? date < form.getValues("startDate")!
                        : false
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beskrivelse</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Kort beskrivelse av prosjektet..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Opprett prosjekt
          </Button>
        </div>
      </form>
    </Form>
  );
}

function CustomerSelectionModal({
  customers,
  selectedCustomerId,
  onSelect,
}: {
  customers: DomainCustomerDTO[];
  selectedCustomerId?: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.orgNumber?.includes(search)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
            !selectedCustomerId && "text-muted-foreground",
            selectedCustomerId && "border-green-500"
          )}
        >
          {selectedCustomer ? selectedCustomer.name : "Velg kunde..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] max-w-[800px] flex-col p-0">
        <DialogHeader className="border-b p-4 pb-2">
          <DialogTitle>Velg kunde</DialogTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Søk etter kunde..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <CustomerListTable
            customers={filtered}
            onCustomerClick={(c) => {
              onSelect(c.id ?? "");
              setOpen(false);
            }}
            compact
          />
          {filtered.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              Ingen kunder funnet
            </div>
          )}
        </div>
        <div className="flex justify-between border-t bg-muted/20 p-4">
          <Button
            variant="ghost"
            onClick={() => {
              onSelect("");
              setOpen(false);
            }}
          >
            Fjern valg
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Lukk
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
