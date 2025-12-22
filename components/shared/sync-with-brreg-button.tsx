"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, AlertTriangle, Check, ArrowRight } from "lucide-react";
import {
  fetchBrregData,
  mapBrregToEntityData,
  getCompanyWarnings,
  isValidOrgNumber,
  type BrregMappedData,
} from "@/lib/brreg";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CurrentData {
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  category?: string;
  country?: string;
}

interface FieldChange {
  field: string;
  label: string;
  current: string | undefined;
  new: string | undefined;
  hasChange: boolean;
}

interface SyncWithBrregButtonProps {
  type: "customer" | "supplier";
  orgNumber: string | undefined;
  currentData: CurrentData;
  onSync: (data: BrregMappedData) => Promise<void>;
  className?: string;
}

export function SyncWithBrregButton({
  type,
  orgNumber,
  currentData,
  onSync,
  className,
}: SyncWithBrregButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [brregData, setBrregData] = useState<BrregMappedData | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const hasValidOrgNumber = orgNumber && isValidOrgNumber(orgNumber);

  const handleOpen = async () => {
    if (!orgNumber) return;

    setIsOpen(true);
    setIsLoading(true);
    setError(null);
    setBrregData(null);
    setWarnings([]);

    try {
      const enhet = await fetchBrregData(orgNumber);
      console.log(enhet);

      if (!enhet) {
        setError("Fant ingen bedrift med dette organisasjonsnummeret");
        return;
      }

      const mapped = mapBrregToEntityData(enhet);
      setBrregData(mapped);
      setWarnings(getCompanyWarnings(enhet));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Kunne ikke hente data fra BRREG"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    if (!brregData) return;

    setIsSyncing(true);
    try {
      await onSync(brregData);
      toast.success("Data synkronisert fra Brønnøysundregistrene");
      setIsOpen(false);
    } catch {
      toast.error("Kunne ikke synkronisere data");
    } finally {
      setIsSyncing(false);
    }
  };

  const getFieldChanges = (): FieldChange[] => {
    if (!brregData) return [];

    // Map BRREG fields to our entity fields
    // Note: BRREG "industry" maps to our "category"
    const fields: {
      brregKey: keyof BrregMappedData;
      currentKey: keyof CurrentData;
      label: string;
      ignore?: boolean;
    }[] = [
      { brregKey: "email", currentKey: "email", label: "E-post" },
      { brregKey: "phone", currentKey: "phone", label: "Telefon" },
      { brregKey: "website", currentKey: "website", label: "Nettside" },
      { brregKey: "address", currentKey: "address", label: "Adresse" },
      { brregKey: "postalCode", currentKey: "postalCode", label: "Postnummer" },
      { brregKey: "city", currentKey: "city", label: "Sted" },
      {
        brregKey: "industry",
        currentKey: "category",
        label: "Kategori",
        ignore: type === "customer",
      },
      { brregKey: "country", currentKey: "country", label: "Land" },
    ];

    // Helper to normalize URLs for comparison (strip protocol)
    const normalizeUrl = (url: string | undefined): string => {
      if (!url) return "";
      return url
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "");
    };

    return fields
      .filter(({ ignore }) => !ignore)
      .map(({ brregKey, currentKey, label }) => {
        const currentValue = currentData[currentKey];
        const newValue = brregData[brregKey];

        // Special comparison for website URLs - ignore protocol differences
        const isMatch =
          brregKey === "website"
            ? normalizeUrl(currentValue) === normalizeUrl(newValue)
            : currentValue?.toLowerCase() === newValue?.toLowerCase();

        return {
          field: brregKey,
          label,
          current: currentValue,
          new: newValue,
          hasChange:
            newValue !== undefined &&
            newValue !== null &&
            newValue !== "" &&
            !isMatch,
        };
      });
  };

  const fieldChanges = getFieldChanges();
  const hasChanges = fieldChanges.some((f) => f.hasChange);

  if (!hasValidOrgNumber) {
    return null;
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpen}
        className={className}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Synk med BRREG
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[95vw] sm:w-[80vw] sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Synkroniser med Brønnøysundregistrene
            </DialogTitle>
            <DialogDescription>
              Hent oppdatert informasjon om{" "}
              <strong>{currentData.name ?? "bedriften"}</strong> fra
              Brønnøysundregistrene.
            </DialogDescription>
          </DialogHeader>

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                Henter data fra BRREG...
              </span>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {warnings.length > 0 && (
            <div className="rounded-lg border border-orange-500/50 bg-orange-500/10 p-4">
              <div className="flex items-start gap-2 text-orange-600 dark:text-orange-400">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <span className="font-medium">Advarsel</span>
                  <ul className="mt-1 list-inside list-disc text-sm">
                    {warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {brregData && !isLoading && (
            <div className="space-y-4">
              {!hasChanges ? (
                <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Check className="h-5 w-5" />
                    <span className="font-medium">
                      All informasjon er allerede oppdatert
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Følgende felter vil bli oppdatert:
                  </p>
                  <div className="rounded-lg border">
                    {fieldChanges
                      .filter((f) => f.hasChange)
                      .map((field, i, arr) => (
                        <div
                          key={field.field}
                          className={cn(
                            "px-3 py-2.5 sm:px-4 sm:py-3",
                            i < arr.length - 1 && "border-b"
                          )}
                        >
                          <div className="mb-1.5">
                            <Badge variant="outline" className="font-normal">
                              {field.label}
                            </Badge>
                          </div>
                          <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:gap-2">
                            <span className="break-words text-muted-foreground line-through">
                              {field.current || "(tom)"}
                            </span>
                            <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
                            <span className="text-xs text-muted-foreground sm:hidden">
                              ↓
                            </span>
                            <span className="break-words font-medium">
                              {field.new}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:gap-0">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Avbryt
            </Button>
            <Button
              onClick={handleSync}
              disabled={isLoading || !brregData || !hasChanges || isSyncing}
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Synkroniserer...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Oppdater informasjon
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
