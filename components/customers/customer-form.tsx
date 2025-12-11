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
import { Input } from "@/components/ui/input";
import { Loader2, Search, Building2, MapPin } from "lucide-react";
import type { DomainCreateCustomerRequest } from "@/lib/.generated/data-contracts";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const customerSchema = z.object({
  name: z.string().min(2, "Navnet må være minst 2 tegn"),
  orgNumber: z
    .string()
    .refine((val) => val === "" || /^\d{9}$/.test(val), {
      message: "Organisasjonsnummer må være 9 siffer",
    })
    .optional(),
  email: z.string().email("Ugyldig e-postadresse").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default("Norge"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  onSubmit: (data: DomainCreateCustomerRequest) => Promise<void>;
  isLoading: boolean;
}

interface BrregEnhet {
  organisasjonsnummer: string;
  navn: string;
  forretningsadresse?: {
    adresse?: string[];
    postnummer?: string;
    poststed?: string;
    land?: string;
  };
  postadresse?: {
    adresse?: string[];
    postnummer?: string;
    poststed?: string;
    land?: string;
  };
}

export function CustomerForm({ onSubmit, isLoading }: CustomerFormProps) {
  const [openCombobox, setOpenCombobox] = useState(false);
  const [searchResults, setSearchResults] = useState<BrregEnhet[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isBrregSelected, setIsBrregSelected] = useState(false);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      orgNumber: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "Norge",
    },
    mode: "onChange", // Enable real-time validation for styling
  });

  const handleSubmit = async (values: CustomerFormValues) => {
    await onSubmit(values);
    form.reset();
    setIsBrregSelected(false); // Reset selection
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue.length >= 2) {
        searchBrreg(searchValue);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const searchBrreg = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://data.brreg.no/enhetsregisteret/api/enheter?navn=${encodeURIComponent(
          query
        )}&size=10`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data._embedded?.enheter || []);
      }
    } catch (error) {
      console.error("Brreg search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectCompany = (company: BrregEnhet) => {
    form.setValue("name", company.navn, { shouldValidate: true });
    form.setValue("orgNumber", company.organisasjonsnummer, {
      shouldValidate: true,
    });

    const address = company.forretningsadresse || company.postadresse;

    if (address) {
      if (address.adresse && address.adresse.length > 0) {
        form.setValue("address", address.adresse[0], { shouldValidate: true });
      } else {
        form.setValue("address", "", { shouldValidate: true });
      }
      if (address.postnummer) {
        form.setValue("postalCode", address.postnummer, {
          shouldValidate: true,
        });
      } else {
        form.setValue("postalCode", "", { shouldValidate: true });
      }
      if (address.poststed) {
        form.setValue("city", address.poststed, { shouldValidate: true });
      } else {
        form.setValue("city", "", { shouldValidate: true });
      }
    }
    setOpenCombobox(false);
    setIsBrregSelected(true); // Lock fields
    setSearchValue(""); // Clear search
  };

  // Helper to determine input border color
  // fieldName: keyof CustomerFormValues
  // We need to cast to any because accessing formState for dynamic fields is tricky in mapped renders,
  // but here we use it directly in render props.
  // Custom styling:
  // - Error: border-destructive (default usually, but we ensure it)
  // - Valid (dirty & no error): green border
  const getInputClass = (
    fieldName: keyof CustomerFormValues,
    hasError: boolean
  ) => {
    // If we selected from Brreg, these fields are filled but might not be marked 'dirty' by user typing,
    // so we also check if they have a value.
    const hasValue = !!form.getValues(fieldName);

    // Valid if: has value AND no error
    const isValid = hasValue && !hasError;

    return cn(
      isValid &&
        "border-green-500 ring-green-500 focus-visible:ring-green-500 dark:border-green-400 dark:ring-green-400 dark:focus-visible:ring-green-400"
      // Additional stylistic tweaks if needed
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="mb-2 text-sm font-medium text-muted-foreground">
          Søk i Brønnøysundregistrene (valgfritt)
        </div>
        <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openCombobox}
              className="w-full justify-between bg-background"
            >
              <span className="flex items-center gap-2 truncate">
                <Search className="h-4 w-4 shrink-0 opacity-50" />
                {isBrregSelected
                  ? "Søk for å bytte firma..."
                  : "Søk etter navn eller org.nr..."}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
          >
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Søk etter firma..."
                value={searchValue}
                onValueChange={setSearchValue}
              />
              <CommandList>
                {isSearching && (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
                {!isSearching &&
                  searchValue.length >= 2 &&
                  searchResults.length === 0 && (
                    <CommandEmpty>Ingen resultater funnet.</CommandEmpty>
                  )}
                <CommandGroup>
                  {searchResults.map((company) => (
                    <CommandItem
                      key={company.organisasjonsnummer}
                      value={company.organisasjonsnummer}
                      onSelect={() => selectCompany(company)}
                      className="flex flex-col items-start gap-1 py-3"
                    >
                      <div className="flex items-center gap-2 font-medium">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {company.navn}
                      </div>
                      <div className="flex items-center gap-2 pl-6 text-xs text-muted-foreground">
                        <span>Org: {company.organisasjonsnummer}</span>
                        {company.forretningsadresse?.poststed && (
                          <span className="flex items-center gap-1">
                            • <MapPin className="h-3 w-3" />
                            {company.forretningsadresse.poststed}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {isBrregSelected && (
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <p>Informasjon er hentet fra Brønnøysundregistrene.</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsBrregSelected(false);
                form.reset();
              }}
              className="h-auto p-0 text-xs hover:bg-transparent hover:text-destructive"
            >
              Nullstill skjema
            </Button>
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  Kundenavn <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Straye AS"
                    {...field}
                    disabled={isBrregSelected}
                    className={getInputClass("name", !!fieldState.error)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="orgNumber"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Organisasjonsnummer (valgfritt)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="987654321"
                      {...field}
                      disabled={isBrregSelected}
                      className={getInputClass("orgNumber", !!fieldState.error)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>E-post</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="post@firma.no"
                      {...field}
                      className={getInputClass("email", !!fieldState.error)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Telefon</FormLabel>
                <FormControl>
                  <Input
                    placeholder="12345678"
                    {...field}
                    className={getInputClass("phone", !!fieldState.error)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Adresse (valgfritt)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Storgata 1"
                    {...field}
                    disabled={isBrregSelected}
                    className={getInputClass("address", !!fieldState.error)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Postnummer</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0123"
                      {...field}
                      disabled={isBrregSelected}
                      className={getInputClass(
                        "postalCode",
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
              name="city"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Poststed</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Oslo"
                      {...field}
                      disabled={isBrregSelected}
                      className={getInputClass("city", !!fieldState.error)}
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
              Opprett kunde
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
