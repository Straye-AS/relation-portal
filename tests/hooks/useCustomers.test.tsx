import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useCustomers,
  useCustomer,
  useAllCustomers,
  useCustomerContacts,
  useCustomerOffers,
  useCustomerProjects,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  useCreateCustomerContact,
  useUpdateCustomerContactInfo,
  useUpdateCustomerAddress,
} from "@/hooks/useCustomers";
import { ReactNode } from "react";

// Mock data
const mockCustomers = [
  {
    id: "cust-1",
    name: "Test Customer AS",
    organizationNumber: "123456789",
    contactPerson: "John Doe",
    contactEmail: "john@test.com",
    contactPhone: "+47 123 45 678",
    address: "Test Street 1",
    postalCode: "0123",
    city: "Oslo",
    country: "Norway",
    website: "https://test.com",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "cust-2",
    name: "Another Customer AS",
    organizationNumber: "987654321",
    contactPerson: "Jane Smith",
    contactEmail: "jane@another.com",
    contactPhone: "+47 987 65 432",
    address: "Another Street 2",
    postalCode: "4567",
    city: "Bergen",
    country: "Norway",
    website: null,
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z",
  },
];

const mockContacts = [
  {
    id: "contact-1",
    name: "John Doe",
    email: "john@test.com",
    phone: "+47 123 45 678",
    role: "Manager",
    customerId: "cust-1",
  },
  {
    id: "contact-2",
    name: "Jane Doe",
    email: "jane.doe@test.com",
    phone: "+47 111 22 333",
    role: "Developer",
    customerId: "cust-1",
  },
];

const mockCustomerOffers = [
  {
    id: "offer-1",
    title: "Customer Offer 1",
    customerId: "cust-1",
    phase: "sent",
    value: 100000,
  },
];

const mockCustomerProjects = [
  {
    id: "proj-1",
    name: "Customer Project 1",
    customerId: "cust-1",
    phase: "aktiv",
  },
];

// Mock API functions
const mockCustomersList = vi.fn().mockResolvedValue({
  data: {
    data: mockCustomers,
    total: mockCustomers.length,
    page: 1,
    pageSize: 20,
  },
});

const mockCustomersDetail = vi.fn().mockImplementation(({ id }) => {
  const customer = mockCustomers.find((c) => c.id === id);
  if (customer) {
    return Promise.resolve({ data: customer });
  }
  return Promise.reject(new Error("Not found"));
});

const mockContactsList = vi.fn().mockResolvedValue({
  data: mockContacts,
});

const mockOffersList = vi.fn().mockResolvedValue({
  data: {
    data: mockCustomerOffers,
    total: mockCustomerOffers.length,
  },
});

const mockProjectsList = vi.fn().mockResolvedValue({
  data: {
    data: mockCustomerProjects,
    total: mockCustomerProjects.length,
  },
});

const mockCustomersCreate = vi.fn().mockResolvedValue({
  data: { id: "cust-new", name: "New Customer AS" },
});

const mockCustomersUpdate = vi.fn().mockResolvedValue({
  data: { id: "cust-1", name: "Updated Customer AS" },
});

const mockCustomersDelete = vi.fn().mockResolvedValue({});

const mockContactsCreate = vi.fn().mockResolvedValue({
  data: { id: "contact-new", name: "New Contact" },
});

const mockContactInfoUpdate = vi.fn().mockResolvedValue({
  data: { id: "cust-1", contactPerson: "Updated Person" },
});

const mockAddressUpdate = vi.fn().mockResolvedValue({
  data: { id: "cust-1", address: "New Address" },
});

// Mock dependencies
vi.mock("@/lib/api/api-provider", () => ({
  useApi: () => ({
    customers: {
      customersList: mockCustomersList,
      customersDetail: mockCustomersDetail,
      contactsList: mockContactsList,
      offersList: mockOffersList,
      projectsList: mockProjectsList,
      customersCreate: mockCustomersCreate,
      customersUpdate: mockCustomersUpdate,
      customersDelete: mockCustomersDelete,
      contactsCreate: mockContactsCreate,
      contactInfoUpdate: mockContactInfoUpdate,
      addressUpdate: mockAddressUpdate,
    },
    contacts: {
      contactsDelete: vi.fn().mockResolvedValue({}),
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

vi.mock("@/lib/logging", () => ({
  createLogger: () => ({
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
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

describe("useCustomers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch customers successfully", async () => {
    const { result } = renderHook(() => useCustomers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.data).toHaveLength(2);
  });

  it("should have correct customer structure", async () => {
    const { result } = renderHook(() => useCustomers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const firstCustomer = result.current.data!.data[0];
    expect(firstCustomer).toHaveProperty("id");
    expect(firstCustomer).toHaveProperty("name");
    expect(firstCustomer).toHaveProperty("organizationNumber");
    expect(firstCustomer).toHaveProperty("contactEmail");
    expect(firstCustomer).toHaveProperty("address");
    expect(firstCustomer).toHaveProperty("city");
  });

  it("should pass params to API", async () => {
    const params = { page: 2, pageSize: 10 };
    renderHook(() => useCustomers(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(mockCustomersList).toHaveBeenCalledWith(params));
  });

  it("should include selectedCompanyId in query key", async () => {
    const { result } = renderHook(() => useCustomers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockCustomersList).toHaveBeenCalled();
  });
});

describe("useCustomer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch single customer by id", async () => {
    const { result } = renderHook(() => useCustomer("cust-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data!.id).toBe("cust-1");
    expect(result.current.data!.name).toBe("Test Customer AS");
  });

  it("should return error for non-existent customer", async () => {
    const { result } = renderHook(() => useCustomer("non-existent"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });

  it("should not fetch if id is empty", async () => {
    renderHook(() => useCustomer(""), {
      wrapper: createWrapper(),
    });

    await new Promise((r) => setTimeout(r, 50));
    expect(mockCustomersDetail).not.toHaveBeenCalled();
  });
});

describe("useAllCustomers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch all customers with large page size", async () => {
    const { result } = renderHook(() => useAllCustomers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockCustomersList).toHaveBeenCalledWith(
      expect.objectContaining({ pageSize: expect.any(Number) })
    );
  });

  it("should return array of customers", async () => {
    const { result } = renderHook(() => useAllCustomers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(Array.isArray(result.current.data)).toBe(true);
  });
});

describe("useCustomerContacts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch contacts for a customer", async () => {
    const { result } = renderHook(() => useCustomerContacts("cust-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data).toHaveLength(2);
  });

  it("should have correct contact structure", async () => {
    const { result } = renderHook(() => useCustomerContacts("cust-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const firstContact = result.current.data![0];
    expect(firstContact).toHaveProperty("id");
    expect(firstContact).toHaveProperty("name");
    expect(firstContact).toHaveProperty("email");
    expect(firstContact).toHaveProperty("phone");
  });

  it("should not fetch if customerId is empty", async () => {
    renderHook(() => useCustomerContacts(""), {
      wrapper: createWrapper(),
    });

    await new Promise((r) => setTimeout(r, 50));
    expect(mockContactsList).not.toHaveBeenCalled();
  });
});

describe("useCustomerOffers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch offers for a customer", async () => {
    const { result } = renderHook(() => useCustomerOffers("cust-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
  });

  it("should not fetch if customerId is empty", async () => {
    renderHook(() => useCustomerOffers(""), {
      wrapper: createWrapper(),
    });

    await new Promise((r) => setTimeout(r, 50));
    expect(mockOffersList).not.toHaveBeenCalled();
  });
});

describe("useCustomerProjects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch projects for a customer", async () => {
    const { result } = renderHook(() => useCustomerProjects("cust-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
  });

  it("should not fetch if customerId is empty", async () => {
    renderHook(() => useCustomerProjects(""), {
      wrapper: createWrapper(),
    });

    await new Promise((r) => setTimeout(r, 50));
    expect(mockProjectsList).not.toHaveBeenCalled();
  });
});

describe("useCreateCustomer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create customer successfully", async () => {
    const { result } = renderHook(() => useCreateCustomer(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        name: "New Customer AS",
        country: "Norway",
        orgNumber: "111222333",
      });
    });

    expect(mockCustomersCreate).toHaveBeenCalledWith({
      name: "New Customer AS",
      country: "Norway",
      orgNumber: "111222333",
    });
  });
});

describe("useUpdateCustomer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update customer successfully", async () => {
    const { result } = renderHook(() => useUpdateCustomer(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        id: "cust-1",
        data: { name: "Updated Customer AS" },
      });
    });

    expect(mockCustomersUpdate).toHaveBeenCalledWith(
      { id: "cust-1" },
      { name: "Updated Customer AS" }
    );
  });
});

describe("useDeleteCustomer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete customer successfully", async () => {
    const { result } = renderHook(() => useDeleteCustomer(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync("cust-1");
    });

    expect(mockCustomersDelete).toHaveBeenCalledWith({ id: "cust-1" });
  });
});

describe("useCreateCustomerContact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create contact successfully", async () => {
    const { result } = renderHook(() => useCreateCustomerContact(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        customerId: "cust-1",
        data: {
          firstName: "New",
          lastName: "Contact",
          email: "new@contact.com",
        },
      });
    });

    expect(mockContactsCreate).toHaveBeenCalledWith(
      { id: "cust-1" },
      { firstName: "New", lastName: "Contact", email: "new@contact.com" }
    );
  });
});

describe("useUpdateCustomerContactInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update customer contact info", async () => {
    const { result } = renderHook(() => useUpdateCustomerContactInfo(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        id: "cust-1",
        data: {
          contactPerson: "New Person",
          contactEmail: "new@email.com",
        },
      });
    });

    expect(mockContactInfoUpdate).toHaveBeenCalledWith(
      { id: "cust-1" },
      { contactPerson: "New Person", contactEmail: "new@email.com" }
    );
  });
});

describe("useUpdateCustomerAddress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update customer address", async () => {
    const { result } = renderHook(() => useUpdateCustomerAddress(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        id: "cust-1",
        data: {
          address: "New Street 123",
          postalCode: "9999",
          city: "Trondheim",
        },
      });
    });

    expect(mockAddressUpdate).toHaveBeenCalledWith(
      { id: "cust-1" },
      { address: "New Street 123", postalCode: "9999", city: "Trondheim" }
    );
  });
});
