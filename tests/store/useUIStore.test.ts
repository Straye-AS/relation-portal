import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useUIStore } from "@/store/useUIStore";

describe("useUIStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    const { setState } = useUIStore;
    setState({
      sidebarOpen: true,
      theme: "system",
      language: "no",
    });
  });

  it("should have default values", () => {
    const { result } = renderHook(() => useUIStore());

    expect(result.current.sidebarOpen).toBe(true);
    expect(result.current.theme).toBe("system");
    expect(result.current.language).toBe("no");
  });

  it("should toggle sidebar", () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.sidebarOpen).toBe(false);

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.sidebarOpen).toBe(true);
  });

  it("should set theme", () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.setTheme("dark");
    });

    expect(result.current.theme).toBe("dark");
  });

  it("should set language", () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.setLanguage("en");
    });

    expect(result.current.language).toBe("en");
  });
});
