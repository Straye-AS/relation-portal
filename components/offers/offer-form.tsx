"use client";

import { useState, useEffect } from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type {
  DomainCreateOfferRequest,
  DomainCustomerDTO,
  DomainProjectDTO,
} from "@/lib/.generated/data-contracts";
import {
  DomainOfferPhase,
  DomainOfferStatus,
} from "@/lib/.generated/data-contracts";
import { useAllCustomers } from "@/hooks/useCustomers";
import { useAllProjects } from "@/hooks/useProjects";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { COMPANIES } from "@/lib/api/types";
import { Slider } from "@/components/ui/slider";
import { SmartDatePicker } from "@/components/ui/smart-date-picker";

// ... imports

const offerSchema = z
  .object({
    title: z
      .string()
      .min(2, "Tittel må være minst 2 tegn")
      .max(200, "Tittel kan ikke være mer enn 200 tegn"),
    customerId: z.string().optional(),
    projectId: z.string().optional(),
    companyId: z.string().optional(), // Make optional so existing usage doesn't break if we handle it in submit
    description: z.string().optional(),
    dueDate: z.date().optional(),
    expirationDate: z.date().optional(),
    probability: z.coerce
      .number()
      .min(0, "Sannsynlighet må være minst 0%")
      .max(100, "Sannsynlighet må være maks 100%")
      .optional(),
  })
  .refine((data) => data.customerId || data.projectId, {
    message: "Du må velge enten kunde eller prosjekt",
    path: ["customerId"],
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
  const { data: projects } = useAllProjects();
  const { user } = useCurrentUser();
  const [openCustomerCombobox, setOpenCustomerCombobox] = useState(false);
  const [openProjectCombobox, setOpenProjectCombobox] = useState(false);

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      customerId: initialData?.customerId ?? "",
      projectId: initialData?.projectId ?? "",
      companyId: initialData?.companyId ?? user?.company?.id ?? "",
      description: initialData?.description ?? "",
      dueDate: undefined,
      expirationDate: undefined,
      probability: initialData?.probability ?? 50,
    },
    mode: "onChange",
  });

  const selectedCustomerId = form.watch("customerId");
  const selectedProjectId = form.watch("projectId");

  // Effect: When customer changes, clear project if it doesn't belong to the customer
  // But be careful not to create loops or annoy user.
  // Actually, better UX: Filter the project list based on selected customer.
  // If no customer selected, show all projects.

  // Effect: When project is selected, if it has a customer, we could auto-select the customer
  // This supports "Scenario C" where both are sent, but UI makes it easy.
  useEffect(() => {
    if (selectedProjectId && projects) {
      const project = projects.find((p) => p.id === selectedProjectId);
      if (project?.customerId && !selectedCustomerId) {
        // If user hasn't selected a customer yet, auto-select the project's customer
        form.setValue("customerId", project.customerId, {
          shouldValidate: true,
        });
      } else if (
        project?.customerId &&
        selectedCustomerId &&
        project.customerId !== selectedCustomerId
      ) {
        // Warning: Project belongs to different customer?
        // Ideally we shouldn't allow selecting such mismatch.
        // The project filter below will handle "valid" choices, but if they pick project first, then customer...
      }
    }
  }, [selectedProjectId, projects, form, selectedCustomerId]);

  const filteredProjects = projects?.filter((p) => {
    if (selectedCustomerId) {
      return p.customerId === selectedCustomerId;
    }
    return true;
  });

  const handleSubmit = async (values: OfferFormValues) => {
    // Construct the payload with default enum values
    const payload: DomainCreateOfferRequest = {
      ...values,
      phase: DomainOfferPhase.OfferPhaseInProgress, // Start as InProgress by default
      status: DomainOfferStatus.OfferStatusActive,
      companyId: (values.companyId || user?.company?.id) as any,
      responsibleUserId: user?.id ?? "",
      dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
      expirationDate: values.expirationDate
        ? values.expirationDate.toISOString()
        : undefined,
      // Ensure we explicitly send undefined if empty string, though backend might handle empty string ok?
      // Zod handles optional(), but defaultValues are "".
      // Let's rely on standard handling or clean up.
      customerId: values.customerId || undefined,
      projectId: values.projectId || undefined,
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Kunde{" "}
                    {!selectedProjectId && (
                      <span className="font-normal text-muted-foreground">
                        (påkrevd hvis ingen prosjekt)
                      </span>
                    )}
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
                              "border-green-500"
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
                        <CommandList className="max-h-[200px] overflow-y-auto">
                          <CommandEmpty>Ingen kunder funnet.</CommandEmpty>
                          <CommandGroup>
                            {/* Option to clear selection if we want to support unselecting? */}
                            <CommandItem
                              value="clear_selection"
                              onSelect={() => {
                                form.setValue("customerId", "", {
                                  shouldValidate: true,
                                });
                                setOpenCustomerCombobox(false);
                              }}
                              className="italic text-muted-foreground"
                            >
                              <span className="mr-2 h-4 w-4" />
                              Fjern valg
                            </CommandItem>
                            {customers?.map((customer: DomainCustomerDTO) => (
                              <CommandItem
                                value={customer.name}
                                key={customer.id}
                                onSelect={() => {
                                  form.setValue(
                                    "customerId",
                                    customer.id ?? "",
                                    {
                                      shouldValidate: true,
                                    }
                                  );
                                  // If new customer selected, verify project compatibility?
                                  // For now, let's just create offer.
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

            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Prosjekt{" "}
                    {!selectedCustomerId && (
                      <span className="font-normal text-muted-foreground">
                        (påkrevd hvis ingen kunde)
                      </span>
                    )}
                  </FormLabel>
                  <Popover
                    open={openProjectCombobox}
                    onOpenChange={setOpenProjectCombobox}
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
                              !form.formState.errors.projectId &&
                              "border-green-500"
                          )}
                        >
                          {field.value
                            ? projects?.find(
                                (p: DomainProjectDTO) => p.id === field.value
                              )?.name
                            : "Velg prosjekt..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command>
                        <CommandInput placeholder="Søk etter prosjekt..." />
                        <CommandList className="max-h-[200px] overflow-y-auto">
                          <CommandEmpty>Ingen prosjekter funnet.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value="clear_selection"
                              onSelect={() => {
                                form.setValue("projectId", "", {
                                  shouldValidate: true,
                                });
                                setOpenProjectCombobox(false);
                              }}
                              className="italic text-muted-foreground"
                            >
                              <span className="mr-2 h-4 w-4" />
                              Fjern valg
                            </CommandItem>
                            {filteredProjects?.map(
                              (project: DomainProjectDTO) => (
                                <CommandItem
                                  value={project.name}
                                  key={project.id}
                                  onSelect={() => {
                                    form.setValue(
                                      "projectId",
                                      project.id ?? "",
                                      {
                                        shouldValidate: true,
                                      }
                                    );
                                    setOpenProjectCombobox(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      project.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {project.name}
                                </CommandItem>
                              )
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {form.formState.errors.root && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details" className="border-none">
              <AccordionTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Flere detaljer (valgfritt)
              </AccordionTrigger>
              <AccordionContent className="space-y-6 px-1 pt-4">
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

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Frist{" "}
                        <span className="text-muted-foreground">
                          (valgfritt)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <SmartDatePicker
                          value={field.value}
                          onSelect={field.onChange}
                          disabledDates={(date) => date < new Date()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Beskrivelse{" "}
                        <span className="text-muted-foreground">
                          (valgfritt)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Beskriv tilbudet. Husk at alt kan endres senere..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
