import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuth } from "@/hooks/useAuth";

// Mock the MSAL module
vi.mock("@azure/msal-react", () => ({
  useMsal: vi.fn(() => ({
    instance: {
      loginRedirect: vi.fn(),
      logoutRedirect: vi.fn(),
      acquireTokenSilent: vi
        .fn()
        .mockResolvedValue({ accessToken: "test-token" }),
      handleRedirectPromise: vi.fn().mockResolvedValue(null),
    },
    accounts: [],
    inProgress: "none",
  })),
}));

// Mock the local auth context
const mockLocalAuthContext = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
};

vi.mock("@/lib/auth/LocalAuthContext", () => ({
  useLocalAuth: vi.fn(() => mockLocalAuthContext),
}));

// Mock the local auth config
let mockLocalAuthEnabled = false;
let mockAuthModePreference: "local" | "microsoft" = "local";

vi.mock("@/lib/auth/localAuthConfig", () => ({
  isLocalAuthEnabled: vi.fn(() => mockLocalAuthEnabled),
  getAuthModePreference: vi.fn(() => mockAuthModePreference),
}));

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalAuthEnabled = false;
    mockAuthModePreference = "local";
  });

  describe("when local auth is disabled", () => {
    it("returns not authenticated when no MSAL accounts", () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.account).toBeNull();
    });

    it("returns isLoading false when inProgress is none", () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("when local auth is enabled", () => {
    beforeEach(() => {
      mockLocalAuthEnabled = true;
      mockAuthModePreference = "local";
    });

    it("returns local auth context when local auth is enabled", () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it("uses local auth login function", async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login();
      });

      expect(mockLocalAuthContext.login).toHaveBeenCalled();
    });

    it("uses local auth logout function", async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockLocalAuthContext.logout).toHaveBeenCalled();
    });
  });

  describe("getAccessToken", () => {
    it("returns null when not authenticated in local mode", async () => {
      mockLocalAuthEnabled = true;
      mockAuthModePreference = "local";

      const { result } = renderHook(() => useAuth());

      const token = await result.current.getAccessToken();

      expect(token).toBeNull();
    });

    it("returns mock token when authenticated in local mode", async () => {
      mockLocalAuthEnabled = true;
      mockAuthModePreference = "local";
      mockLocalAuthContext.isAuthenticated = true;

      const { result } = renderHook(() => useAuth());

      const token = await result.current.getAccessToken();

      expect(token).toBe("local-dev-token");

      // Reset
      mockLocalAuthContext.isAuthenticated = false;
    });
  });
});
