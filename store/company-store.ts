/**
 * Company Store
 *
 * Zustand store for managing the selected company context.
 * Persists the user's company selection in localStorage.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type CompanyId, COMPANIES, type Company } from "@/lib/api/types";

interface CompanyState {
  /**
   * Currently selected company ID for filtering data.
   * 'all' means show data from all companies (super admin view).
   */
  selectedCompanyId: CompanyId;

  /**
   * The user's assigned company from their profile.
   * Non-super admins can only see their own company.
   */
  userCompany: Company | null;

  /**
   * Whether the user can view all companies.
   * True for super admins only.
   */
  canViewAllCompanies: boolean;

  // Actions
  setSelectedCompany: (id: CompanyId) => void;
  setUserCompany: (company: Company | null) => void;
  setCanViewAllCompanies: (can: boolean) => void;
  reset: () => void;
}

const initialState = {
  selectedCompanyId: "all" as CompanyId,
  userCompany: null,
  canViewAllCompanies: false,
};

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSelectedCompany: (id: CompanyId) => {
        const { canViewAllCompanies, userCompany } = get();

        // Non-super admins can only select their own company
        if (!canViewAllCompanies && id !== userCompany?.id) {
          console.warn(
            "[CompanyStore] User cannot select company they do not belong to"
          );
          return;
        }

        set({ selectedCompanyId: id });
      },

      setUserCompany: (company: Company | null) => {
        set({ userCompany: company });

        // If user has a specific company and can't view all, lock to their company
        const { canViewAllCompanies } = get();
        if (company && !canViewAllCompanies) {
          set({ selectedCompanyId: company.id });
        }
      },

      setCanViewAllCompanies: (can: boolean) => {
        set({ canViewAllCompanies: can });

        // If user loses all-company access, reset to their own company
        if (!can) {
          const { userCompany } = get();
          if (userCompany) {
            set({ selectedCompanyId: userCompany.id });
          }
        }
      },

      reset: () => set(initialState),
    }),
    {
      name: "straye-company-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist the selected company ID
        selectedCompanyId: state.selectedCompanyId,
      }),
    }
  )
);

/**
 * Get company details by ID
 */
export function getCompanyById(id: CompanyId): Company | undefined {
  return COMPANIES[id];
}

/**
 * Get list of companies the current user can access
 */
export function getAccessibleCompanies(
  canViewAll: boolean,
  userCompany: Company | null
): Company[] {
  if (canViewAll) {
    return Object.values(COMPANIES);
  }

  if (userCompany) {
    // Return just the "all" option and user's company
    return [COMPANIES.all, userCompany];
  }

  return [];
}
