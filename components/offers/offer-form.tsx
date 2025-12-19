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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomerListTable } from "@/components/customers/customer-list-table";
import { ProjectListTable } from "@/components/projects/project-list-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ChevronsUpDown } from "lucide-react";
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
import { useOfferNextNumber } from "@/hooks/useOffers";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Search } from "lucide-react";
import { COMPANIES, type CompanyId } from "@/lib/api/types";
import { Slider } from "@/components/ui/slider";
import { SmartDatePicker } from "@/components/ui/smart-date-picker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import type { Project } from "@/lib/api/types";

// ... imports

const formShape = {
  title: z
    .string()
    .min(2, "Tittel må være minst 2 tegn")
    .max(200, "Tittel kan ikke være mer enn 200 tegn"),
  customerId: z.string().optional(),
  projectId: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  expirationDate: z.date().optional(),
  probability: z.coerce
    .number()
    .min(0, "Sannsynlighet må være minst 0%")
    .max(100, "Sannsynlighet må være maks 100%")
    .optional(),
};

// Type schema for form values (actual validation schema is built in component with refinement)
const _offerSchemaForType = z.object({
  ...formShape,
  companyId: z.string().optional(),
});

type OfferFormValues = z.infer<typeof _offerSchemaForType>;

interface OfferFormProps {
  onSubmit: (
    data: DomainCreateOfferRequest & { companyId?: string }
  ) => Promise<void>;
  isLoading: boolean;
  initialData?: Partial<OfferFormValues> & { companyId?: string };
  showCompanySelect?: boolean;
  showCustomerWarning?: boolean;
  lockedCustomerId?: string; // If set, customer is locked to this ID
}

export function OfferForm({
  onSubmit,
  isLoading,
  initialData,
  showCompanySelect,
  showCustomerWarning,
  lockedCustomerId,
}: OfferFormProps) {
  const { data: customers } = useAllCustomers();
  const { data: projects } = useAllProjects();
  const { user } = useCurrentUser();

  const formSchema = z
    .object({
      ...formShape,
      companyId: showCompanySelect
        ? z.string().min(1, "Du må velge et selskap")
        : z.string().optional(),
    })
    .refine((data) => data.customerId || data.projectId, {
      message: "Du må velge enten kunde eller prosjekt",
      path: ["customerId"],
    });

  // We need to watch companyId to fetch the next number
  // Form might not have it set initially if it depends on user data loading, but user data is loaded in parent or here?
  // user.company.id is available.
  const form = useForm<OfferFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      customerId: lockedCustomerId ?? initialData?.customerId ?? "",
      projectId: initialData?.projectId ?? "",
      companyId: initialData?.companyId ?? user?.company?.id ?? "",
      description: initialData?.description ?? "",
      dueDate: undefined,
      expirationDate: undefined,
      probability: initialData?.probability ?? 50,
    },
    mode: "onChange",
  });

  const selectedCompanyId = form.watch("companyId") || user?.company?.id;
  const { data: nextOfferNumber } = useOfferNextNumber(selectedCompanyId);

  const selectedCustomerId = form.watch("customerId");
  const selectedProjectId = form.watch("projectId");

  // Effect: When customer changes, clear project if it doesn't belong to the customer
  // But be careful not to create loops or annoy user.
  // Actually, better UX: Filter the project list based on selected customer.
  // If no customer selected, show all projects.

  // Effect: When project is selected, if it has a customer, we could auto-select the customer
  // This supports "Scenario C" where both are sent, but UI makes it easy.

  const filteredProjects = projects?.filter((p) => {
    // Only show projects in 'tilbud' phase
    // Note: We might want to allow 'active' if linking to existing active project for variation?
    // Requirement says: "Filter project selector to phase === 'tilbud' when linking offers"
    // and "Linking Rules: Only tilbud phase".
    if (p.phase !== "tilbud") {
      return false;
    }
    // Allow any combination of customer and project - no filtering by customer
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
          {nextOfferNumber && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">Neste tilbudsnummer:</span>
              <span className="rounded bg-muted px-2 py-0.5 font-mono text-foreground">
                {nextOfferNumber}
              </span>
            </div>
          )}
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
                        {field.value ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor:
                                  COMPANIES[field.value as CompanyId]?.color ??
                                  "gray",
                              }}
                            />
                            <span>
                              {COMPANIES[field.value as CompanyId]?.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            Velg selskap
                          </span>
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(COMPANIES)
                        .filter((c) => c.id !== "all" && c.id !== "gruppen")
                        .map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: company.color }}
                              />
                              <span>{company.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {showCustomerWarning &&
            selectedCustomerId === (initialData?.customerId ?? "") && (
              <Alert className="border-blue-200 bg-blue-50 text-blue-900">
                <Info className="h-4 w-4 text-blue-900" />
                <AlertDescription>
                  Kunde er fylt ut automatisk, men kanskje dette tilbudet er til
                  en annen kunde? Å ha to tilbud til samme kunde på samme
                  prosjekt er kanskje ikke det du ønsker? Husk å endre det til
                  riktig kunde i så fall.
                </AlertDescription>
              </Alert>
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
                  <FormControl>
                    {lockedCustomerId ? (
                      <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                        {customers?.find((c) => c.id === lockedCustomerId)
                          ?.name || "Kunde"}
                        <span className="ml-auto text-xs font-normal">
                          (Låst)
                        </span>
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
                  <FormControl>
                    <ProjectSelectionModal
                      projects={filteredProjects ?? []}
                      selectedProjectId={field.value}
                      onSelect={(projectId) => {
                        field.onChange(projectId);
                        // Only auto-fill customer if none is selected yet
                        const currentCustomerId = form.getValues("customerId");
                        if (!currentCustomerId && projectId) {
                          const project = projects?.find(
                            (p) => p.id === projectId
                          );
                          if (project?.customerId) {
                            form.setValue("customerId", project.customerId, {
                              shouldValidate: true,
                            });
                          }
                        }
                      }}
                    />
                  </FormControl>
                  {lockedCustomerId && !field.value && (
                    <p className="text-[0.8rem] text-muted-foreground">
                      Hvis du ikke velger et prosjekt, vil et nytt bli opprettet
                      automatisk.
                    </p>
                  )}
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
      <DialogContent className="flex max-h-[90vh] w-[95vw] max-w-[95vw] flex-col p-0">
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

function ProjectSelectionModal({
  projects,
  selectedProjectId,
  onSelect,
}: {
  projects: DomainProjectDTO[];
  selectedProjectId?: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const filtered = projects.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.projectNumber?.includes(search) ||
      p.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
            !selectedProjectId && "text-muted-foreground",
            selectedProjectId && "border-green-500"
          )}
        >
          {selectedProject ? selectedProject.name : "Velg prosjekt..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] w-[95vw] max-w-[95vw] flex-col p-0">
        <DialogHeader className="border-b p-4 pb-2">
          <DialogTitle className="mb-2">Velg prosjekt</DialogTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Søk etter prosjekt..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <ProjectListTable
            projects={(filtered as Project[]) ?? []}
            onProjectClick={(p) => {
              onSelect(p.id ?? "");
              setOpen(false);
            }}
            compact
            showRelativeDate
          />
          {filtered.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              Ingen prosjekter funnet
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
