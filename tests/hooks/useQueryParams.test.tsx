import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useQueryParams } from "@/hooks/useQueryParams";

// Mock next/navigation
const mockReplace = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  usePathname: () => "/test",
  useSearchParams: () => mockSearchParams,
}));

describe("useQueryParams", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset search params
    Array.from(mockSearchParams.keys()).forEach((key) => {
      mockSearchParams.delete(key);
    });
  });

  describe("parsing URL parameters", () => {
    it("returns default values when URL has no params", () => {
      const schema = {
        page: { type: "number" as const, default: 1 },
        sortBy: { type: "string" as const, default: "name" },
        includeExpired: { type: "boolean" as const, default: false },
      };

      const { result } = renderHook(() => useQueryParams(schema));

      expect(result.current.params.page).toBe(1);
      expect(result.current.params.sortBy).toBe("name");
      expect(result.current.params.includeExpired).toBe(false);
    });

    it("parses number parameters from URL", () => {
      mockSearchParams.set("page", "5");

      const schema = {
        page: { type: "number" as const, default: 1 },
      };

      const { result } = renderHook(() => useQueryParams(schema));

      expect(result.current.params.page).toBe(5);
    });

    it("parses string parameters from URL", () => {
      mockSearchParams.set("sortBy", "createdAt");

      const schema = {
        sortBy: { type: "string" as const, default: "name" },
      };

      const { result } = renderHook(() => useQueryParams(schema));

      expect(result.current.params.sortBy).toBe("createdAt");
    });

    it("parses boolean parameters from URL", () => {
      mockSearchParams.set("includeExpired", "true");

      const schema = {
        includeExpired: { type: "boolean" as const, default: false },
      };

      const { result } = renderHook(() => useQueryParams(schema));

      expect(result.current.params.includeExpired).toBe(true);
    });

    it("returns default for invalid number", () => {
      mockSearchParams.set("page", "not-a-number");

      const schema = {
        page: { type: "number" as const, default: 1 },
      };

      const { result } = renderHook(() => useQueryParams(schema));

      expect(result.current.params.page).toBe(1);
    });
  });

  describe("setParam", () => {
    it("updates URL with new value", () => {
      const schema = {
        page: { type: "number" as const, default: 1 },
      };

      const { result } = renderHook(() => useQueryParams(schema));

      act(() => {
        result.current.setParam("page", 5);
      });

      expect(mockReplace).toHaveBeenCalledWith("/test?page=5", {
        scroll: false,
      });
    });

    it("removes param from URL when set to default value", () => {
      mockSearchParams.set("page", "5");

      const schema = {
        page: { type: "number" as const, default: 1 },
      };

      const { result } = renderHook(() => useQueryParams(schema));

      act(() => {
        result.current.setParam("page", 1);
      });

      expect(mockReplace).toHaveBeenCalledWith("/test", { scroll: false });
    });
  });

  describe("setParams", () => {
    it("updates multiple parameters at once", () => {
      const schema = {
        page: { type: "number" as const, default: 1 },
        sortBy: { type: "string" as const, default: "name" },
      };

      const { result } = renderHook(() => useQueryParams(schema));

      act(() => {
        result.current.setParams({ page: 3, sortBy: "date" });
      });

      expect(mockReplace).toHaveBeenCalled();
      const calledUrl = mockReplace.mock.calls[0][0];
      expect(calledUrl).toContain("page=3");
      expect(calledUrl).toContain("sortBy=date");
    });
  });

  describe("resetParams", () => {
    it("resets all parameters to defaults", () => {
      mockSearchParams.set("page", "5");
      mockSearchParams.set("sortBy", "date");

      const schema = {
        page: { type: "number" as const, default: 1 },
        sortBy: { type: "string" as const, default: "name" },
      };

      const { result } = renderHook(() => useQueryParams(schema));

      act(() => {
        result.current.resetParams();
      });

      // Should remove all params since they're all defaults
      expect(mockReplace).toHaveBeenCalledWith("/test", { scroll: false });
    });
  });
});
