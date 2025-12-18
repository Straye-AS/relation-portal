"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/hooks/useSearch";
import {
  Building2,
  Briefcase,
  FileText,
  User,
  Search,
  Clock,
  Loader2,
  DollarSign,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectPhaseBadge } from "../projects/project-phase-badge";
import { OfferStatusBadge } from "../offers/offer-status-badge";

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Map search result types to display information
const typeConfig: Record<
  string,
  {
    label: string;
    labelPlural: string;
    icon: typeof Building2;
    color: string;
    route: string;
  }
> = {
  customer: {
    label: "Kunde",
    labelPlural: "Kunder",
    icon: Building2,
    color: "blue",
    route: "/customers",
  },
  project: {
    label: "Prosjekt",
    labelPlural: "Prosjekter",
    icon: Briefcase,
    color: "green",
    route: "/projects",
  },
  offer: {
    label: "Tilbud",
    labelPlural: "Tilbud",
    icon: FileText,
    color: "purple",
    route: "/offers",
  },
  deal: {
    label: "Salg",
    labelPlural: "Salg",
    icon: DollarSign,
    color: "amber",
    route: "/deals",
  },
  contact: {
    label: "Kontakt",
    labelPlural: "Kontakter",
    icon: User,
    color: "orange",
    route: "/contacts",
  },
};

interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: React.ReactNode;
  header?: string;
  type: string;
  metadata?: React.ReactNode;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { data, isLoading } = useSearch(debouncedQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Convert API response to usable format
  const results: SearchResultItem[] = useMemo(() => {
    if (!data) return [];

    // The API returns a categorized object
    const response = data as {
      customers?: any[];
      projects?: any[];
      offers?: any[];
      deals?: any[];
      contacts?: any[];
    };

    const mappedResults: SearchResultItem[] = [];

    if (response.customers?.length) {
      mappedResults.push(
        ...response.customers.map((item) => ({
          id: item.id,
          title: item.name,
          subtitle: (
            <Badge variant="outline" className="font-normal">
              {item.orgNumber ? `Org.nr: ${item.orgNumber}` : "Privatperson"}
            </Badge>
          ),
          type: "customer",
          metadata: (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{item.city}</span>
            </div>
          ),
        }))
      );
    }

    if (response.projects?.length) {
      mappedResults.push(
        ...response.projects.map((item) => {
          return {
            id: item.id,
            title: item.name || item.title,
            header: item.projectNumber,
            subtitle: `${item.customerName ?? ""}`,
            type: "project",
            metadata: <ProjectPhaseBadge phase={item.phase} />,
          };
        })
      );
    }

    if (response.offers?.length) {
      mappedResults.push(
        ...response.offers.map((item) => {
          const extRef = item.externalReference
            ? ` • Ref: ${item.externalReference}`
            : "";

          return {
            id: item.id,
            title: item.title,
            header: item.offerNumber + extRef,
            subtitle: `${item.customerName}`,
            type: "offer",
            metadata: (
              <div className="flex items-center gap-2">
                <OfferStatusBadge phase={item.phase} />
                <span className="hidden min-w-[120px] text-right md:block">
                  {(item.value || 0).toLocaleString()} NOK
                </span>
              </div>
            ),
          };
        })
      );
    }

    if (response.deals?.length) {
      mappedResults.push(
        ...response.deals.map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.customerName,
          type: "deal",
          metadata: item.stage,
        }))
      );
    }

    if (response.contacts?.length) {
      mappedResults.push(
        ...response.contacts.map((item) => ({
          id: item.id,
          title:
            `${item.firstName} ${item.lastName}`.trim() ||
            item.name ||
            item.email,
          subtitle: item.email,
          type: "contact",
          metadata: item.phone,
        }))
      );
    }

    return mappedResults;
  }, [data]);

  // Group results by type
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResultItem[]> = {};

    for (const result of results) {
      const type = result.type || "other";
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(result);
    }

    return groups;
  }, [results]);

  // Flatten all results for keyboard navigation
  const allResults = results;

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [data]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [open]);

  const handleSelectResult = useCallback(
    (result: SearchResultItem) => {
      const config = typeConfig[result.type];
      if (config) {
        router.push(`${config.route}/${result.id}`);
        onOpenChange(false);
      }
    },
    [router, onOpenChange]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, allResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && allResults[selectedIndex]) {
        e.preventDefault();
        handleSelectResult(allResults[selectedIndex]);
      }
    },
    [allResults, selectedIndex, handleSelectResult]
  );

  const getIconColor = (colorName: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      blue: {
        bg: "bg-blue-100 dark:bg-blue-900",
        text: "text-blue-600 dark:text-blue-400",
      },
      green: {
        bg: "bg-green-100 dark:bg-green-900",
        text: "text-green-600 dark:text-green-400",
      },
      purple: {
        bg: "bg-purple-100 dark:bg-purple-900",
        text: "text-purple-600 dark:text-purple-400",
      },
      orange: {
        bg: "bg-orange-100 dark:bg-orange-900",
        text: "text-orange-600 dark:text-orange-400",
      },
      amber: {
        bg: "bg-amber-100 dark:bg-amber-900",
        text: "text-amber-600 dark:text-amber-400",
      },
    };
    return colors[colorName] || colors.blue;
  };

  const renderResult = (result: SearchResultItem, globalIndex: number) => {
    const config = typeConfig[result.type] || typeConfig.customer;
    const Icon = config.icon;
    const colors = getIconColor(config.color);
    const isSelected = globalIndex === selectedIndex;

    return (
      <motion.div
        key={`${result.type}-${result.id}`}
        id={`search-result-${globalIndex}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: globalIndex * 0.02 }}
        onClick={() => handleSelectResult(result)}
        className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
          isSelected ? "bg-primary/10" : "hover:bg-muted"
        }`}
      >
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${colors.bg}`}
        >
          <Icon className={`h-5 w-5 ${colors.text}`} />
        </div>
        <div className="min-w-0 flex-1">
          {result.header && (
            <p className="truncate font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {result.header}
            </p>
          )}
          <p className="truncate text-sm font-semibold">{result.title}</p>
          {result.subtitle && (
            <div className="truncate text-xs text-muted-foreground">
              {result.subtitle}
            </div>
          )}
        </div>
        {result.metadata && (
          <div className="text-right text-xs text-muted-foreground">
            {result.metadata}
          </div>
        )}
      </motion.div>
    );
  };

  // Scroll active item into view
  useEffect(() => {
    const element = document.getElementById(`search-result-${selectedIndex}`);
    if (element) {
      element.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex]);

  const hasResults = results.length > 0;
  const isSearchingMode = query.trim().length > 0;

  // Calculate global index for each result
  let globalIndex = 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 p-0">
        <DialogTitle className="sr-only">Global søk</DialogTitle>
        <div className="flex items-center border-b px-4">
          <Search className="mr-2 h-5 w-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Søk etter kunder, prosjekter, tilbud eller kontakter..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {isLoading && (
            <Loader2 className="ml-2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!isSearchingMode && (
            <div className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Begynn å skrive for å søke
            </div>
          )}

          {!hasResults && !isLoading && isSearchingMode && (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Ingen resultater funnet
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Prøv et annet søkeord
              </p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {hasResults && (
              <div className="space-y-4">
                {Object.entries(groupedResults).map(([type, items]) => {
                  const config = typeConfig[type] || {
                    labelPlural: type,
                    label: type,
                  };

                  return (
                    <div key={type}>
                      <div className="flex items-center justify-between px-4 py-2">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {config.labelPlural}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {items.length}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        {items.map((item) => {
                          const currentIndex = globalIndex;
                          globalIndex++;
                          return renderResult(item, currentIndex);
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="rounded bg-muted px-2 py-1 text-xs">↑↓</kbd>
              <span>Naviger</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="rounded bg-muted px-2 py-1 text-xs">↵</kbd>
              <span>Åpne</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="rounded bg-muted px-2 py-1 text-xs">Esc</kbd>
              <span>Lukk</span>
            </div>
          </div>
          {hasResults && (
            <span>
              {results.length} resultat{results.length !== 1 ? "er" : ""}
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
