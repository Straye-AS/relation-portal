import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CompanyId, Company } from "@/types";

export const companies: Company[] = [
    {
        id: "all",
        name: "Hele Straye",
        shortName: "Straye",
        color: "#0066CC",
    },
    {
        id: "gruppe",
        name: "Straye Gruppen",
        shortName: "Gruppen",
        color: "#0066CC",
    },
    {
        id: "stalbygg",
        name: "Straye Stålbygg",
        shortName: "Stålbygg",
        color: "#FF6B35",
    },
    {
        id: "hybridbygg",
        name: "Straye Hybridbygg",
        shortName: "Hybridbygg",
        color: "#00B4D8",
    },
    {
        id: "industri",
        name: "Straye Industri",
        shortName: "Industri",
        color: "#8338EC",
    },
    {
        id: "tak",
        name: "Straye Tak",
        shortName: "Tak",
        color: "#06D6A0",
    },
    {
        id: "montasje",
        name: "Straye Montasje",
        shortName: "Montasje",
        color: "#FFD60A",
    },
];

interface CompanyStore {
    selectedCompanyId: CompanyId;
    setSelectedCompany: (companyId: CompanyId) => void;
    getSelectedCompany: () => Company;
}

export const useCompanyStore = create<CompanyStore>()(
    persist(
        (set, get) => ({
            selectedCompanyId: "all",
            setSelectedCompany: (companyId) => set({ selectedCompanyId: companyId }),
            getSelectedCompany: () => {
                const companyId = get().selectedCompanyId;
                return companies.find((c) => c.id === companyId) || companies[0];
            },
        }),
        {
            name: "straye-company-selection",
        }
    )
);

