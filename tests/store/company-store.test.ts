import { describe, it, expect, beforeEach, vi } from "vitest";
import { act } from "@testing-library/react";
import {
  useCompanyStore,
  getCompanyById,
  getAccessibleCompanies,
} from "@/store/company-store";
import { COMPANIES, type CompanyId } from "@/lib/api/types";

describe("company-store", () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useCompanyStore.getState().reset();
    });
    // Also clear localStorage mock
    localStorage.clear();
  });

  describe("initial state", () => {
    it("has correct initial values", () => {
      const state = useCompanyStore.getState();

      expect(state.selectedCompanyId).toBe("all");
      expect(state.userCompany).toBeNull();
      expect(state.canViewAllCompanies).toBe(false);
    });
  });

  describe("setSelectedCompany", () => {
    it("allows super admin to select any company", () => {
      act(() => {
        useCompanyStore.getState().setCanViewAllCompanies(true);
        useCompanyStore.getState().setSelectedCompany("stalbygg");
      });

      expect(useCompanyStore.getState().selectedCompanyId).toBe("stalbygg");
    });

    it("prevents non-super admin from selecting other companies", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      act(() => {
        useCompanyStore.getState().setUserCompany(COMPANIES.stalbygg);
        useCompanyStore.getState().setCanViewAllCompanies(false);
        // Try to select a different company
        useCompanyStore.getState().setSelectedCompany("hybridbygg");
      });

      // Should remain on user's company
      expect(useCompanyStore.getState().selectedCompanyId).toBe("stalbygg");
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("allows user to select their own company", () => {
      act(() => {
        useCompanyStore.getState().setUserCompany(COMPANIES.stalbygg);
        useCompanyStore.getState().setCanViewAllCompanies(false);
        useCompanyStore.getState().setSelectedCompany("stalbygg");
      });

      expect(useCompanyStore.getState().selectedCompanyId).toBe("stalbygg");
    });
  });

  describe("setUserCompany", () => {
    it("locks selection to user company when canViewAllCompanies is false", () => {
      act(() => {
        useCompanyStore.getState().setCanViewAllCompanies(false);
        useCompanyStore.getState().setUserCompany(COMPANIES.hybridbygg);
      });

      expect(useCompanyStore.getState().selectedCompanyId).toBe("hybridbygg");
    });

    it("does not lock selection when canViewAllCompanies is true", () => {
      act(() => {
        useCompanyStore.getState().setSelectedCompany("all");
        useCompanyStore.getState().setCanViewAllCompanies(true);
        useCompanyStore.getState().setUserCompany(COMPANIES.stalbygg);
      });

      // Should remain on "all" since user can view all companies
      expect(useCompanyStore.getState().selectedCompanyId).toBe("all");
    });
  });

  describe("setCanViewAllCompanies", () => {
    it("resets to user company when losing all-company access", () => {
      act(() => {
        useCompanyStore.getState().setUserCompany(COMPANIES.stalbygg);
        useCompanyStore.getState().setCanViewAllCompanies(true);
        useCompanyStore.getState().setSelectedCompany("all");
        // Now remove all-company access
        useCompanyStore.getState().setCanViewAllCompanies(false);
      });

      // Should reset to user's company
      expect(useCompanyStore.getState().selectedCompanyId).toBe("stalbygg");
    });
  });

  describe("reset", () => {
    it("resets all state to initial values", () => {
      act(() => {
        useCompanyStore.getState().setUserCompany(COMPANIES.stalbygg);
        useCompanyStore.getState().setCanViewAllCompanies(true);
        useCompanyStore.getState().setSelectedCompany("hybridbygg");
        useCompanyStore.getState().reset();
      });

      const state = useCompanyStore.getState();
      expect(state.selectedCompanyId).toBe("all");
      expect(state.userCompany).toBeNull();
      expect(state.canViewAllCompanies).toBe(false);
    });
  });
});

describe("getCompanyById", () => {
  it("returns company for valid id", () => {
    const company = getCompanyById("stalbygg");
    expect(company).toBeDefined();
    expect(company?.id).toBe("stalbygg");
  });

  it("returns undefined for invalid id", () => {
    // Cast to CompanyId to test invalid input handling
    const company = getCompanyById("invalid" as CompanyId);
    expect(company).toBeUndefined();
  });
});

describe("getAccessibleCompanies", () => {
  it("returns all companies when canViewAll is true", () => {
    const companies = getAccessibleCompanies(true, null);
    expect(companies.length).toBeGreaterThan(0);
    expect(companies).toContain(COMPANIES.all);
  });

  it("returns only user company and all when canViewAll is false", () => {
    const companies = getAccessibleCompanies(false, COMPANIES.stalbygg);
    expect(companies).toHaveLength(2);
    expect(companies).toContain(COMPANIES.all);
    expect(companies).toContain(COMPANIES.stalbygg);
  });

  it("returns empty array when no access", () => {
    const companies = getAccessibleCompanies(false, null);
    expect(companies).toHaveLength(0);
  });
});
