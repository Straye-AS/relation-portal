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
import {
  useCompanyStore,
  getAccessibleCompanies,
  getCompanyById,
} from "@/store/company-store";
import { Building2, Check } from "lucide-react";
import { motion } from "framer-motion";

export function CompanySelector() {
  const {
    selectedCompanyId,
    setSelectedCompany,
    userCompany,
    canViewAllCompanies,
  } = useCompanyStore();
  const selectedCompany = getCompanyById(selectedCompanyId);
  const accessibleCompanies = getAccessibleCompanies(
    canViewAllCompanies,
    userCompany
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
          style={
            selectedCompany
              ? {
                  backgroundColor: `${selectedCompany.color}15`,
                  color: selectedCompany.color,
                  borderColor: `${selectedCompany.color}40`,
                }
              : undefined
          }
        >
          <Building2 className="h-4 w-4" />
          <span className="hidden md:inline">{selectedCompany?.shortName}</span>
          <span className="md:hidden">{selectedCompany?.shortName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Velg selskap</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {accessibleCompanies.map((company) => (
          <DropdownMenuItem
            key={company.id}
            onClick={() => setSelectedCompany(company.id)}
            className="cursor-pointer"
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
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
