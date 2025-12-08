import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useOffers, useOffer } from "@/hooks/useOffers";
import { ReactNode } from "react";

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
    expect(Array.isArray(result.current.data)).toBe(true);
    expect(result.current.data!.data.length).toBeGreaterThan(0);
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

  it("should return undefined for non-existent offer", async () => {
    const { result } = renderHook(() => useOffer("non-existent-id"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeUndefined();
  });
});
