import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useOffers, useOffer } from "@/hooks/useOffers";
import { ReactNode } from "react";

// Mock dependencies
vi.mock("@/lib/api/api-provider", () => ({
  useApi: () => ({
    offers: {
      offersList: vi.fn().mockResolvedValue({
        data: {
          data: [
            {
              id: "1",
              title: "Test Offer",
              customerId: "cust-1",
              phase: "draft",
              probability: 50,
              value: 10000,
              items: [],
            },
          ],
        },
      }),
      offersDetail: vi.fn().mockImplementation(({ id }) => {
        if (id === "1") {
          return Promise.resolve({
            data: {
              id: "1",
              title: "Test Offer",
              customerId: "cust-1",
              phase: "draft",
              probability: 50,
              value: 10000,
              items: [],
            },
          });
        }
        return Promise.reject(new Error("Not found"));
      }),
    },
  }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: true,
  }),
}));

vi.mock("@/store/company-store", () => ({
  useCompanyStore: () => ({
    selectedCompanyId: "comp-1",
  }),
}));

// Create wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "QueryClientWrapper";

  return Wrapper;
};

describe("useOffers", () => {
  it("should fetch offers successfully", async () => {
    const { result } = renderHook(() => useOffers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.data).toBeDefined();
    expect(result.current.data?.data.length).toBeGreaterThan(0);
  });

  it("should have correct offer structure", async () => {
    const { result } = renderHook(() => useOffers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const firstOffer = result.current.data!.data[0];
    expect(firstOffer).toHaveProperty("id");
    expect(firstOffer).toHaveProperty("title");
    expect(firstOffer).toHaveProperty("customerId");
    expect(firstOffer).toHaveProperty("phase");
    expect(firstOffer).toHaveProperty("probability");
    expect(firstOffer).toHaveProperty("value");
    expect(firstOffer).toHaveProperty("items");
  });
});

describe("useOffer", () => {
  it("should fetch single offer by id", async () => {
    const { result } = renderHook(() => useOffer("1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data!.id).toBe("1");
  });

  it("should return undefined or error for non-existent offer", async () => {
    const { result } = renderHook(() => useOffer("non-existent-id"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
