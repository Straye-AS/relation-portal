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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  DomainCreateOfferRequest,
  DomainCustomerDTO,
} from "@/lib/.generated/data-contracts";
import {
  DomainOfferPhase,
  DomainOfferStatus,
} from "@/lib/.generated/data-contracts";
import { useAllCustomers } from "@/hooks/useCustomers";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { COMPANIES } from "@/lib/api/types";
import { Slider } from "@/components/ui/slider";

// ... imports

const offerSchema = z.object({
  title: z
    .string()
    .min(2, "Tittel må være minst 2 tegn")
    .max(200, "Tittel kan ikke være mer enn 200 tegn"),
  customerId: z.string().min(1, "Du må velge en kunde"),
  companyId: z.string().optional(), // Make optional so existing usage doesn't break if we handle it in submit
  description: z.string().optional(),
  probability: z.coerce
    .number()
    .min(0, "Sannsynlighet må være minst 0%")
    .max(100, "Sannsynlighet må være maks 100%")
    .optional(),
  items: z
    .array(
      z.object({
        description: z.string(),
        quantity: z.coerce.number(),
        unitPrice: z.coerce.number(),
      })
    )
    .optional(),
});

type OfferFormValues = z.infer<typeof offerSchema>;

interface OfferFormProps {
  onSubmit: (
    data: DomainCreateOfferRequest & { companyId?: string }
  ) => Promise<void>;
  isLoading: boolean;
  initialData?: Partial<OfferFormValues> & { companyId?: string };
  showCompanySelect?: boolean;
}

export function OfferForm({
  onSubmit,
  isLoading,
  initialData,
  showCompanySelect,
}: OfferFormProps) {
  const { data: customers } = useAllCustomers();
  const { user } = useCurrentUser();
  const [openCustomerCombobox, setOpenCustomerCombobox] = useState(false);

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      customerId: initialData?.customerId ?? "",
      companyId: initialData?.companyId ?? user?.company?.id ?? "",
      description: initialData?.description ?? "",
      probability: initialData?.probability ?? 50,
      items: initialData?.items ?? [],
    },
    mode: "onChange",
  });

  const handleSubmit = async (values: OfferFormValues) => {
    // Construct the payload with default enum values
    const payload: DomainCreateOfferRequest = {
      ...values,
      phase: DomainOfferPhase.OfferPhaseInProgress, // Start as InProgress by default
      status: DomainOfferStatus.OfferStatusActive,
      companyId: (values.companyId || user?.company?.id) as any,
      responsibleUserId: user?.id ?? "",
      items: [],
    };

    await onSubmit(payload);
    if (!initialData) {
      form.reset();
    }
  };

  // Border styling helper (same as CustomerForm)
  const getInputClass = (fieldName: string, hasError: boolean) => {
    // Check if dirty or has value for top-level fields
    // For nested (items), dirtyFields structure is nested.
    const hasValue = !!form.getValues(fieldName as any);
    const isValid = hasValue && !hasError;

    return cn(
      isValid &&
        "border-green-500 ring-green-500 focus-visible:ring-green-500 dark:border-green-400 dark:ring-green-400 dark:focus-visible:ring-green-400"
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Main Info */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  Tittel <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eks: Installasjon av solceller"
                    {...field}
                    className={getInputClass("title", !!fieldState.error)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {showCompanySelect && (
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selskap</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg selskap" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(COMPANIES)
                        .filter((c) => c.id !== "all")
                        .map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Kunde <span className="text-destructive">*</span>
                </FormLabel>
                <Popover
                  open={openCustomerCombobox}
                  onOpenChange={setOpenCustomerCombobox}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                          field.value &&
                            !form.formState.errors.customerId &&
                            "border-green-500" // Simple valid check for combobox
                        )}
                      >
                        {field.value
                          ? customers?.find(
                              (customer: DomainCustomerDTO) =>
                                customer.id === field.value
                            )?.name
                          : "Velg kunde..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                      <CommandInput placeholder="Søk etter kunde..." />
                      <CommandList>
                        <CommandEmpty>Ingen kunder funnet.</CommandEmpty>
                        <CommandGroup>
                          {customers?.map((customer: DomainCustomerDTO) => (
                            <CommandItem
                              value={customer.name} // Search by name
                              key={customer.id}
                              onSelect={() => {
                                form.setValue("customerId", customer.id ?? "", {
                                  shouldValidate: true,
                                });
                                setOpenCustomerCombobox(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  customer.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {customer.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="probability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sannsynlighet: {field.value}%</FormLabel>
                  <FormControl>
                    <Slider
                      min={10}
                      max={90}
                      step={10}
                      defaultValue={[field.value ?? 50]}
                      onValueChange={(vals) => field.onChange(vals[0])}
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
                <FormLabel>Beskrivelse (valgfritt)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Beskriv tilbudet..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4" style={{ marginTop: "auto" }}>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Opprett tilbud
          </Button>
        </div>
      </form>
    </Form>
  );
}
