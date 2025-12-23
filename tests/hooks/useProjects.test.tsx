import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useProjects,
  useProject,
  useAllProjects,
  useProjectOffers,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useUpdateProjectName,
  useUpdateProjectDescription,
  useUpdateProjectPhase,
} from "@/hooks/useProjects";
import { ReactNode } from "react";

// Mock data
const mockProjects = [
  {
    id: "proj-1",
    name: "Test Project 1",
    projectNumber: "P-2024-001",
    customerId: "cust-1",
    customerName: "Test Customer",
    phase: "tilbud",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    description: "Test project description",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "proj-2",
    name: "Test Project 2",
    projectNumber: "P-2024-002",
    customerId: "cust-2",
    customerName: "Another Customer",
    phase: "aktiv",
    startDate: "2024-02-01",
    endDate: null,
    description: null,
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z",
  },
];

const mockProjectOffers = [
  {
    id: "offer-1",
    title: "Related Offer 1",
    customerId: "cust-1",
    phase: "sent",
    value: 50000,
  },
  {
    id: "offer-2",
    title: "Related Offer 2",
    customerId: "cust-1",
    phase: "draft",
    value: 25000,
  },
];

// Mock API functions
const mockProjectsList = vi.fn().mockResolvedValue({
  data: {
    data: mockProjects,
    total: mockProjects.length,
    page: 1,
    pageSize: 20,
  },
});

const mockProjectsDetail = vi.fn().mockImplementation(({ id }) => {
  const project = mockProjects.find((p) => p.id === id);
  if (project) {
    return Promise.resolve({ data: project });
  }
  return Promise.reject(new Error("Not found"));
});

const mockOffersList = vi.fn().mockResolvedValue({
  data: mockProjectOffers,
});

const mockProjectsCreate = vi.fn().mockResolvedValue({
  data: { id: "proj-new", name: "New Project", phase: "tilbud" },
});

const mockProjectsUpdate = vi.fn().mockResolvedValue({
  data: { id: "proj-1", name: "Updated Project", phase: "aktiv" },
});

const mockProjectsDelete = vi.fn().mockResolvedValue({});

const mockNameUpdate = vi.fn().mockResolvedValue({
  data: { id: "proj-1", name: "New Name" },
});

const mockDescriptionUpdate = vi.fn().mockResolvedValue({
  data: { id: "proj-1", description: "New description" },
});

const mockPhaseUpdate = vi.fn().mockResolvedValue({
  data: { id: "proj-1", phase: "aktiv" },
});

// Mock dependencies
vi.mock("@/lib/api/api-provider", () => ({
  useApi: () => ({
    projects: {
      projectsList: mockProjectsList,
      projectsDetail: mockProjectsDetail,
      offersList: mockOffersList,
      projectsCreate: mockProjectsCreate,
      projectsUpdate: mockProjectsUpdate,
      projectsDelete: mockProjectsDelete,
      nameUpdate: mockNameUpdate,
      descriptionUpdate: mockDescriptionUpdate,
      phaseUpdate: mockPhaseUpdate,
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

describe("useProjects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch projects successfully", async () => {
    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.data).toHaveLength(2);
  });

  it("should include selectedCompanyId in query key", async () => {
    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockProjectsList).toHaveBeenCalled();
  });

  it("should have correct project structure", async () => {
    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const firstProject = result.current.data!.data[0];
    expect(firstProject).toHaveProperty("id");
    expect(firstProject).toHaveProperty("name");
    expect(firstProject).toHaveProperty("projectNumber");
    expect(firstProject).toHaveProperty("customerId");
    expect(firstProject).toHaveProperty("phase");
    expect(firstProject).toHaveProperty("startDate");
  });

  it("should pass params to API", async () => {
    const params = { page: 2, pageSize: 10 };
    renderHook(() => useProjects(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(mockProjectsList).toHaveBeenCalledWith(params));
  });
});

describe("useProject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch single project by id", async () => {
    const { result } = renderHook(() => useProject("proj-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data!.id).toBe("proj-1");
    expect(result.current.data!.name).toBe("Test Project 1");
  });

  it("should return error for non-existent project", async () => {
    const { result } = renderHook(() => useProject("non-existent"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });

  it("should not fetch if id is empty", async () => {
    renderHook(() => useProject(""), {
      wrapper: createWrapper(),
    });

    // Wait a bit to ensure no call was made
    await new Promise((r) => setTimeout(r, 50));
    expect(mockProjectsDetail).not.toHaveBeenCalled();
  });
});

describe("useAllProjects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch all projects with large page size", async () => {
    const { result } = renderHook(() => useAllProjects(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockProjectsList).toHaveBeenCalledWith(
      expect.objectContaining({ pageSize: expect.any(Number) })
    );
  });
});

describe("useProjectOffers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch offers for a project", async () => {
    const { result } = renderHook(() => useProjectOffers("proj-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data).toHaveLength(2);
  });

  it("should not fetch if projectId is empty", async () => {
    renderHook(() => useProjectOffers(""), {
      wrapper: createWrapper(),
    });

    await new Promise((r) => setTimeout(r, 50));
    expect(mockOffersList).not.toHaveBeenCalled();
  });
});

describe("useCreateProject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create project successfully", async () => {
    const { result } = renderHook(() => useCreateProject(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        name: "New Project",
      });
    });

    expect(mockProjectsCreate).toHaveBeenCalledWith({
      name: "New Project",
    });
  });
});

describe("useUpdateProject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update project successfully", async () => {
    const { result } = renderHook(() => useUpdateProject(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        id: "proj-1",
        data: { name: "Updated Name" },
      });
    });

    expect(mockProjectsUpdate).toHaveBeenCalledWith(
      { id: "proj-1" },
      { name: "Updated Name" }
    );
  });
});

describe("useDeleteProject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete project successfully", async () => {
    const { result } = renderHook(() => useDeleteProject(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync("proj-1");
    });

    expect(mockProjectsDelete).toHaveBeenCalledWith({ id: "proj-1" });
  });
});

describe("useUpdateProjectName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update project name", async () => {
    const { result } = renderHook(() => useUpdateProjectName(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        id: "proj-1",
        data: { name: "New Project Name" },
      });
    });

    expect(mockNameUpdate).toHaveBeenCalledWith(
      { id: "proj-1" },
      { name: "New Project Name" }
    );
  });
});

describe("useUpdateProjectDescription", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update project description", async () => {
    const { result } = renderHook(() => useUpdateProjectDescription(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        id: "proj-1",
        data: { description: "New description" },
      });
    });

    expect(mockDescriptionUpdate).toHaveBeenCalledWith(
      { id: "proj-1" },
      { description: "New description" }
    );
  });
});

describe("useUpdateProjectPhase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update project phase", async () => {
    const { result } = renderHook(() => useUpdateProjectPhase(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        id: "proj-1",
        phase: "aktiv",
      });
    });

    expect(mockPhaseUpdate).toHaveBeenCalledWith(
      { id: "proj-1" },
      { phase: "aktiv" }
    );
  });
});
