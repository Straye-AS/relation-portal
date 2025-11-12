"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCompanyStore, companies } from "@/store/useCompanyStore";
import { Building2, Check } from "lucide-react";
import { motion } from "framer-motion";

export function CompanySelector() {
    const { selectedCompanyId, setSelectedCompany, getSelectedCompany } = useCompanyStore();
    const selectedCompany = getSelectedCompany();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="hidden md:inline">{selectedCompany.shortName}</span>
                    <span className="md:hidden">{selectedCompany.shortName}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Velg selskap</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {companies.map((company) => (
                    <DropdownMenuItem
                        key={company.id}
                        onClick={() => setSelectedCompany(company.id)}
                        className="cursor-pointer"
                    >
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: company.color }}
                                />
                                <span>{company.name}</span>
                            </div>
                            {selectedCompanyId === company.id && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                >
                                    <Check className="h-4 w-4 text-primary" />
                                </motion.div>
                            )}
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

