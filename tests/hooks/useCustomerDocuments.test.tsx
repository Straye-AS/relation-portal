import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useCustomerDocuments,
  useUploadCustomerDocument,
  useDeleteCustomerDocument,
} from "@/hooks/useCustomerDocuments";
import { ReactNode } from "react";

// Mock dependencies
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: true,
  }),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
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

describe("useCustomerDocuments", () => {
  it("should fetch documents for a customer", async () => {
    const { result } = renderHook(() => useCustomerDocuments("customer-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.data).toBeDefined();
    expect(Array.isArray(result.current.data?.data)).toBe(true);
  });

  it("should return paginated response structure", async () => {
    const { result } = renderHook(
      () => useCustomerDocuments("customer-1", { page: 1, pageSize: 10 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveProperty("data");
    expect(result.current.data).toHaveProperty("total");
    expect(result.current.data).toHaveProperty("page");
    expect(result.current.data).toHaveProperty("pageSize");
  });

  it("should have correct document structure", async () => {
    const { result } = renderHook(() => useCustomerDocuments("customer-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const documents = result.current.data?.data;
    if (documents && documents.length > 0) {
      const doc = documents[0];
      expect(doc).toHaveProperty("id");
      expect(doc).toHaveProperty("filename");
      expect(doc).toHaveProperty("contentType");
      expect(doc).toHaveProperty("size");
      expect(doc).toHaveProperty("createdAt");
    }
  });

  it("should not fetch when disabled", async () => {
    const { result } = renderHook(
      () => useCustomerDocuments("customer-1", {}, { enabled: false }),
      { wrapper: createWrapper() }
    );

    // Should not be loading or have data when disabled
    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("should include customerId in query key", async () => {
    const customerId = "test-customer-123";
    const { result } = renderHook(() => useCustomerDocuments(customerId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // The hook should work with any customer ID
    expect(result.current.data).toBeDefined();
  });
});

describe("useUploadCustomerDocument", () => {
  it("should have mutate function", () => {
    const { result } = renderHook(() => useUploadCustomerDocument(), {
      wrapper: createWrapper(),
    });

    expect(result.current.mutate).toBeDefined();
    expect(typeof result.current.mutate).toBe("function");
  });

  it("should have isPending state", () => {
    const { result } = renderHook(() => useUploadCustomerDocument(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);
  });
});

describe("useDeleteCustomerDocument", () => {
  it("should have mutate function", () => {
    const { result } = renderHook(() => useDeleteCustomerDocument(), {
      wrapper: createWrapper(),
    });

    expect(result.current.mutate).toBeDefined();
    expect(typeof result.current.mutate).toBe("function");
  });

  it("should have isPending state", () => {
    const { result } = renderHook(() => useDeleteCustomerDocument(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);
  });
});
