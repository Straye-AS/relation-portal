"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Loader2, Trash2, Plus, ChevronsUpDown, Check } from "lucide-react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const offerSchema = z.object({
  title: z
    .string()
    .min(2, "Tittel må være minst 2 tegn")
    .max(200, "Tittel kan ikke være mer enn 200 tegn"),
  customerId: z.string().min(1, "Du må velge en kunde"),
  description: z.string().optional(),
  probability: z.coerce
    .number()
    .min(0, "Sannsynlighet må være minst 0%")
    .max(100, "Sannsynlighet må være maks 100%")
    .optional(),
  items: z
    .array(
      z.object({
        description: z.string().min(1, "Beskrivelse er påkrevd"),
        quantity: z.coerce.number().min(0.01, "Antall må være større enn 0"),
        unitPrice: z.coerce.number().min(0, "Pris kan ikke være negativ"),
      })
    )
    .min(1, "Du må legge til minst én vare/tjeneste"),
});

type OfferFormValues = z.infer<typeof offerSchema>;

interface OfferFormProps {
  onSubmit: (data: DomainCreateOfferRequest) => Promise<void>;
  isLoading: boolean;
}

export function OfferForm({ onSubmit, isLoading }: OfferFormProps) {
  const { data: customers } = useAllCustomers();
  const { user } = useCurrentUser();
  const [openCustomerCombobox, setOpenCustomerCombobox] = useState(false);

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: "",
      customerId: "",
      description: "",
      probability: 50,
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const handleSubmit = async (values: OfferFormValues) => {
    // Construct the payload with default enum values
    const payload: DomainCreateOfferRequest = {
      ...values,
      phase: DomainOfferPhase.OfferPhaseDraft, // "draft"
      status: DomainOfferStatus.OfferStatusActive, // "active"
      companyId: user?.company?.id as any, // Get company ID from user
      responsibleUserId: user?.id ?? "",
      items: values.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        // API expects 'revenue' (total) and 'cost', and 'discipline'
        revenue: item.unitPrice * item.quantity,
        cost: 0,
        discipline: "General",
      })),
    };

    // Note: If companyId/responsibleUserId are handled by backend context, we might pass dummy or let the hook handle it.
    // Assuming the mutation hook or api client might interpret it, or user data is loaded.
    // For now we pass from user object.

    await onSubmit(payload);
    form.reset();
  };

  // Border styling helper (same as CustomerForm)
  const getInputClass = (
    fieldName:
      | keyof OfferFormValues
      | `items.${number}.${keyof OfferFormValues["items"][number]}`,
    hasError: boolean
  ) => {
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
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Sannsynlighet (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      {...field}
                      className={getInputClass(
                        "probability",
                        !!fieldState.error
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Can add Value field here calculated read-only or manual override? 
                For now let it be calculated sum of items later or just hidden. 
                Request didn't specify manual total value override, usually sum of items.
            */}
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

        {/* Line Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Varelinjer</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                append({ description: "", quantity: 1, unitPrice: 0 })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Legg til vare
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-4">
                <FormField
                  control={form.control}
                  name={`items.${index}.description`}
                  render={({ field: subField, fieldState }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Beskrivelse"
                          {...subField}
                          className={getInputClass(
                            `items.${index}.description`,
                            !!fieldState.error
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field: subField, fieldState }) => (
                    <FormItem className="w-24">
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Antall"
                          min={0}
                          {...subField}
                          className={getInputClass(
                            `items.${index}.quantity`,
                            !!fieldState.error
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.unitPrice`}
                  render={({ field: subField, fieldState }) => (
                    <FormItem className="w-32">
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Pris"
                          min={0}
                          {...subField}
                          className={getInputClass(
                            `items.${index}.unitPrice`,
                            !!fieldState.error
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-0.5 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1} // Prevent removing last item
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <FormMessage>
            {form.formState.errors.items?.root?.message}
          </FormMessage>
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
