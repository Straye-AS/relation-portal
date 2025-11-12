"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/hooks/useSearch";
import { useCompanyStore } from "@/store/useCompanyStore";
import { Customer, Project, Offer, Contact } from "@/types";
import {
    Building2,
    Briefcase,
    FileText,
    User,
    Search,
    Clock,
    Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

interface GlobalSearchProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const phaseLabels: Record<string, string> = {
    draft: "Kladd",
    in_progress: "I gang",
    sent: "Sendt",
    won: "Vunnet",
    lost: "Tapt",
    expired: "Utløpt",
};

const statusLabels: Record<string, string> = {
    planning: "Planlegger",
    active: "Aktiv",
    on_hold: "På vent",
    completed: "Ferdig",
    cancelled: "Kansellert",
};

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const router = useRouter();
    const { selectedCompanyId } = useCompanyStore();
    const { data, isLoading } = useSearch(query, selectedCompanyId);
    const inputRef = useRef<HTMLInputElement>(null);

    // Flatten all results for keyboard navigation
    const allResults = data ? [
        ...data.customers.map(c => ({ type: "customer" as const, data: c })),
        ...data.projects.map(p => ({ type: "project" as const, data: p })),
        ...data.offers.map(o => ({ type: "offer" as const, data: o })),
        ...data.contacts.map(c => ({ type: "contact" as const, data: c })),
    ] : [];

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

    const handleSelectResult = useCallback((result: typeof allResults[0]) => {
        const { type, data } = result;
        let path = "";

        switch (type) {
            case "customer":
                path = `/customers/${data.id}`;
                break;
            case "project":
                path = `/projects/${data.id}`;
                break;
            case "offer":
                path = `/offers/${data.id}`;
                break;
            case "contact":
                // Navigate to the customer page
                path = data.customerId ? `/customers/${data.customerId}` : "#";
                break;
        }

        if (path !== "#") {
            router.push(path);
            onOpenChange(false);
        }
    }, [router, onOpenChange]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, allResults.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === "Enter" && allResults[selectedIndex]) {
            e.preventDefault();
            handleSelectResult(allResults[selectedIndex]);
        }
    }, [allResults, selectedIndex, handleSelectResult]);

    const renderCustomer = (customer: Customer, index: number) => (
        <motion.div
            key={`customer-${customer.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            onClick={() => handleSelectResult({ type: "customer", data: customer })}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-colors ${allResults.findIndex(r => r.type === "customer" && r.data.id === customer.id) === selectedIndex
                ? "bg-primary/10"
                : "hover:bg-muted"
                }`}
        >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{customer.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                    {customer.orgNumber} • {customer.email}
                </p>
            </div>
            {customer.activeOffers && customer.activeOffers > 0 && (
                <Badge variant="outline" className="text-xs">
                    {customer.activeOffers} tilbud
                </Badge>
            )}
        </motion.div>
    );

    const renderProject = (project: Project, index: number) => (
        <motion.div
            key={`project-${project.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            onClick={() => handleSelectResult({ type: "project", data: project })}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-colors ${allResults.findIndex(r => r.type === "project" && r.data.id === project.id) === selectedIndex
                ? "bg-primary/10"
                : "hover:bg-muted"
                }`}
        >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900">
                <Briefcase className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{project.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                    {project.customerName} • {statusLabels[project.status]}
                </p>
            </div>
            <div className="text-right">
                <p className="text-xs font-semibold">{formatCurrency(project.budget)}</p>
            </div>
        </motion.div>
    );

    const renderOffer = (offer: Offer, index: number) => (
        <motion.div
            key={`offer-${offer.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            onClick={() => handleSelectResult({ type: "offer", data: offer })}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-colors ${allResults.findIndex(r => r.type === "offer" && r.data.id === offer.id) === selectedIndex
                ? "bg-primary/10"
                : "hover:bg-muted"
                }`}
        >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{offer.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                    {offer.customerName} • {phaseLabels[offer.phase]}
                </p>
            </div>
            <div className="text-right">
                <p className="text-xs font-semibold">{formatCurrency(offer.value)}</p>
                <p className="text-xs text-muted-foreground">{offer.probability}%</p>
            </div>
        </motion.div>
    );

    const renderContact = (contact: Contact, index: number) => (
        <motion.div
            key={`contact-${contact.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            onClick={() => handleSelectResult({ type: "contact", data: contact })}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-colors ${allResults.findIndex(r => r.type === "contact" && r.data.id === contact.id) === selectedIndex
                ? "bg-primary/10"
                : "hover:bg-muted"
                }`}
        >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900">
                <User className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{contact.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                    {contact.role} • {contact.customerName}
                </p>
            </div>
            <div className="text-right">
                <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
            </div>
        </motion.div>
    );

    const hasResults = data && data.total > 0;
    const isSearchingMode = query.trim().length > 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-0 gap-0">
                <DialogTitle className="sr-only">Global søk</DialogTitle>
                <div className="flex items-center border-b px-4">
                    <Search className="h-5 w-5 text-muted-foreground mr-2" />
                    <Input
                        ref={inputRef}
                        placeholder="Søk etter kunder, prosjekter, tilbud eller kontakter..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2" />}
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {!isSearchingMode && (
                        <div className="px-4 py-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Nylig besøkte
                        </div>
                    )}

                    {!hasResults && !isLoading && isSearchingMode && (
                        <div className="text-center py-12">
                            <p className="text-sm text-muted-foreground">Ingen resultater funnet</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Prøv et annet søkeord eller sjekk selskapsfilter
                            </p>
                        </div>
                    )}

                    {!hasResults && !isLoading && !isSearchingMode && (
                        <div className="text-center py-12">
                            <p className="text-sm text-muted-foreground">Ingen nylige elementer</p>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {data && (
                            <div className="space-y-4">
                                {data.customers.length > 0 && (
                                    <div>
                                        <div className="px-4 py-2 flex items-center justify-between">
                                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                Kunder
                                            </h3>
                                            <Badge variant="secondary" className="text-xs">
                                                {data.customers.length}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1">
                                            {data.customers.map((customer, idx) => renderCustomer(customer, idx))}
                                        </div>
                                    </div>
                                )}

                                {data.projects.length > 0 && (
                                    <div>
                                        <div className="px-4 py-2 flex items-center justify-between">
                                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                Prosjekter
                                            </h3>
                                            <Badge variant="secondary" className="text-xs">
                                                {data.projects.length}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1">
                                            {data.projects.map((project, idx) => renderProject(project, idx))}
                                        </div>
                                    </div>
                                )}

                                {data.offers.length > 0 && (
                                    <div>
                                        <div className="px-4 py-2 flex items-center justify-between">
                                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                Tilbud
                                            </h3>
                                            <Badge variant="secondary" className="text-xs">
                                                {data.offers.length}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1">
                                            {data.offers.map((offer, idx) => renderOffer(offer, idx))}
                                        </div>
                                    </div>
                                )}

                                {data.contacts.length > 0 && (
                                    <div>
                                        <div className="px-4 py-2 flex items-center justify-between">
                                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                Kontakter
                                            </h3>
                                            <Badge variant="secondary" className="text-xs">
                                                {data.contacts.length}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1">
                                            {data.contacts.map((contact, idx) => renderContact(contact, idx))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="border-t px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <kbd className="px-2 py-1 bg-muted rounded text-xs">↑↓</kbd>
                            <span>Naviger</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <kbd className="px-2 py-1 bg-muted rounded text-xs">↵</kbd>
                            <span>Åpne</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd>
                            <span>Lukk</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

