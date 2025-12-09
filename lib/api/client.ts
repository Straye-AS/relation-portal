/**
 * API Client for Straye Relation
 * Currently uses mock data, but structured for easy migration to real backend
 */

import {
  Offer,
  Customer,
  Project,
  Notification,
  DashboardMetrics,
  OfferPhase,
  CompanyId,
  PipelinePhaseData,
  DisciplineStats,
  TeamMemberStats,
  SearchResults,
} from "@/types";
import { mockOffers } from "@/lib/mocks/offers";
import { mockCustomers } from "@/lib/mocks/customers";
import { mockProjects } from "@/lib/mocks/projects";
import { mockNotifications } from "@/lib/mocks/notifications";
import { mockContacts } from "@/lib/mocks/contacts";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Offers API
export const offersApi = {
  getAll: async (): Promise<Offer[]> => {
    await delay(500);
    return mockOffers;
  },

  getById: async (id: string): Promise<Offer | undefined> => {
    await delay(300);
    return mockOffers.find((offer) => offer.id === id);
  },

  create: async (offer: Omit<Offer, "id" | "createdAt" | "updatedAt">) => {
    await delay(500);
    const newOffer: Offer = {
      ...offer,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockOffers.push(newOffer);
    return newOffer;
  },

  update: async (id: string, updates: Partial<Offer>) => {
    await delay(500);
    const index = mockOffers.findIndex((offer) => offer.id === id);
    if (index === -1) throw new Error("Offer not found");
    mockOffers[index] = {
      ...mockOffers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockOffers[index];
  },

  delete: async (id: string) => {
    await delay(500);
    const index = mockOffers.findIndex((offer) => offer.id === id);
    if (index === -1) throw new Error("Offer not found");
    mockOffers.splice(index, 1);
  },
};

// Customers API
export const customersApi = {
  getAll: async (): Promise<Customer[]> => {
    await delay(500);
    return mockCustomers;
  },

  getById: async (id: string): Promise<Customer | undefined> => {
    await delay(300);
    return mockCustomers.find((customer) => customer.id === id);
  },

  create: async (
    customer: Omit<Customer, "id" | "createdAt" | "updatedAt">
  ) => {
    await delay(500);
    const newCustomer: Customer = {
      ...customer,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockCustomers.push(newCustomer);
    return newCustomer;
  },

  update: async (id: string, updates: Partial<Customer>) => {
    await delay(500);
    const index = mockCustomers.findIndex((customer) => customer.id === id);
    if (index === -1) throw new Error("Customer not found");
    mockCustomers[index] = {
      ...mockCustomers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockCustomers[index];
  },

  delete: async (id: string) => {
    await delay(500);
    const index = mockCustomers.findIndex((customer) => customer.id === id);
    if (index === -1) throw new Error("Customer not found");
    mockCustomers.splice(index, 1);
  },
};

// Projects API
export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    await delay(500);
    return mockProjects;
  },

  getById: async (id: string): Promise<Project | undefined> => {
    await delay(300);
    return mockProjects.find((project) => project.id === id);
  },

  create: async (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    await delay(500);
    const newProject: Project = {
      ...project,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProjects.push(newProject);
    return newProject;
  },

  update: async (id: string, updates: Partial<Project>) => {
    await delay(500);
    const index = mockProjects.findIndex((project) => project.id === id);
    if (index === -1) throw new Error("Project not found");
    mockProjects[index] = {
      ...mockProjects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockProjects[index];
  },

  delete: async (id: string) => {
    await delay(500);
    const index = mockProjects.findIndex((project) => project.id === id);
    if (index === -1) throw new Error("Project not found");
    mockProjects.splice(index, 1);
  },
};

// Notifications API
export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    await delay(300);
    return mockNotifications;
  },

  markAsRead: async (id: string) => {
    await delay(200);
    const notification = mockNotifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
    }
  },

  markAllAsRead: async () => {
    await delay(300);
    mockNotifications.forEach((n) => (n.read = true));
  },

  delete: async (id: string) => {
    await delay(200);
    const index = mockNotifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      mockNotifications.splice(index, 1);
    }
  },
};

// Search API
export const searchApi = {
  search: async (
    query: string,
    companyId?: CompanyId
  ): Promise<SearchResults> => {
    await delay(200);

    if (!query || query.trim().length === 0) {
      return {
        customers: [],
        projects: [],
        offers: [],
        contacts: [],
        total: 0,
      };
    }

    const searchTerm = query.toLowerCase().trim();

    // Filter by company if specified
    const filterByCompany = <T extends { companyId?: CompanyId }>(
      items: T[]
    ) => {
      if (!companyId || companyId === "all") return items;
      return items.filter((item) => item.companyId === companyId);
    };

    // Search customers
    const customers = mockCustomers
      .filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm) ||
          c.orgNumber.includes(searchTerm) ||
          c.email.toLowerCase().includes(searchTerm) ||
          c.contactPerson?.toLowerCase().includes(searchTerm)
      )
      .slice(0, 7);

    // Search projects (filter by company)
    const allProjects = filterByCompany(mockProjects);
    const projects = allProjects
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.customerName?.toLowerCase().includes(searchTerm) ||
          p.description?.toLowerCase().includes(searchTerm)
      )
      .slice(0, 7);

    // Search offers (filter by company)
    const allOffers = filterByCompany(mockOffers);
    const offers = allOffers
      .filter(
        (o) =>
          o.title.toLowerCase().includes(searchTerm) ||
          o.customerName?.toLowerCase().includes(searchTerm) ||
          o.responsibleUserName?.toLowerCase().includes(searchTerm) ||
          o.description?.toLowerCase().includes(searchTerm)
      )
      .slice(0, 7);

    // Search contacts
    const contacts = mockContacts
      .filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm) ||
          c.email.toLowerCase().includes(searchTerm) ||
          c.phone.includes(searchTerm) ||
          c.customerName?.toLowerCase().includes(searchTerm) ||
          c.role?.toLowerCase().includes(searchTerm)
      )
      .slice(0, 7);

    return {
      customers,
      projects,
      offers,
      contacts,
      total:
        customers.length + projects.length + offers.length + contacts.length,
    };
  },

  getRecentItems: async (companyId?: CompanyId): Promise<SearchResults> => {
    await delay(200);

    // Filter by company if specified
    const filterByCompany = <T extends { companyId?: CompanyId }>(
      items: T[]
    ) => {
      if (!companyId || companyId === "all") return items;
      return items.filter((item) => item.companyId === companyId);
    };

    // Return recent items (sorted by updatedAt)
    const recentCustomers = mockCustomers
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 3);

    const recentProjects = filterByCompany(mockProjects)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 3);

    const recentOffers = filterByCompany(mockOffers)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 3);

    const recentContacts = mockContacts
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 3);

    return {
      customers: recentCustomers,
      projects: recentProjects,
      offers: recentOffers,
      contacts: recentContacts,
      total:
        recentCustomers.length +
        recentProjects.length +
        recentOffers.length +
        recentContacts.length,
    };
  },
};

// Dashboard API
export const dashboardApi = {
  getMetrics: async (companyId?: CompanyId): Promise<DashboardMetrics> => {
    await delay(600);

    // Filter by company if specified
    const offers =
      companyId && companyId !== "all"
        ? mockOffers.filter((o) => o.companyId === companyId)
        : mockOffers;

    const projects =
      companyId && companyId !== "all"
        ? mockProjects.filter((p) => p.companyId === companyId)
        : mockProjects;

    const activeOffers = offers.filter((o) => o.status === "active");
    const wonOffers = offers.filter((o) => o.phase === "won");
    const lostOffers = offers.filter((o) => o.phase === "lost");

    const totalValue = activeOffers.reduce((sum, o) => sum + o.value, 0);
    const weightedValue = activeOffers.reduce(
      (sum, o) => sum + (o.value * o.probability) / 100,
      0
    );
    const avgProbability =
      activeOffers.reduce((sum, o) => sum + o.probability, 0) /
      (activeOffers.length || 1);

    const offersByPhase = offers.reduce(
      (acc, offer) => {
        acc[offer.phase] = (acc[offer.phase] || 0) + 1;
        return acc;
      },
      {} as Record<OfferPhase, number>
    );

    // Pipeline data
    const phases: OfferPhase[] = [
      "draft",
      "in_progress",
      "sent",
      "won",
      "lost",
      "expired",
    ];
    const pipeline: PipelinePhaseData[] = phases.map((phase) => {
      const phaseOffers = offers.filter((o) => o.phase === phase);
      return {
        phase,
        count: phaseOffers.length,
        totalValue: phaseOffers.reduce((sum, o) => sum + o.value, 0),
        weightedValue: phaseOffers.reduce(
          (sum, o) => sum + (o.value * o.probability) / 100,
          0
        ),
        offers: phaseOffers,
      };
    });

    // Top disciplines
    const disciplineMap = new Map<string, DisciplineStats>();
    offers.forEach((offer) => {
      offer.items.forEach((item) => {
        const existing = disciplineMap.get(item.discipline) || {
          name: item.discipline,
          totalValue: 0,
          offerCount: 0,
          projectCount: 0,
          avgMargin: 0,
        };
        existing.totalValue += item.revenue;
        existing.offerCount += 1;
        disciplineMap.set(item.discipline, existing);
      });
    });
    const topDisciplines = Array.from(disciplineMap.values())
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5)
      .map((d) => ({
        ...d,
        avgMargin:
          offers
            .flatMap((o) => o.items)
            .filter((i) => i.discipline === d.name)
            .reduce((sum, i) => sum + i.margin, 0) / d.offerCount,
      }));

    // Team performance
    const userMap = new Map<string, TeamMemberStats>();
    offers.forEach((offer) => {
      const existing = userMap.get(offer.responsibleUserId) || {
        userId: offer.responsibleUserId,
        name: offer.responsibleUserName || "Unknown",
        offerCount: 0,
        wonCount: 0,
        totalValue: 0,
        wonValue: 0,
        winRate: 0,
      };
      existing.offerCount += 1;
      existing.totalValue += offer.value;
      if (offer.phase === "won") {
        existing.wonCount += 1;
        existing.wonValue += offer.value;
      }
      userMap.set(offer.responsibleUserId, existing);
    });
    const teamPerformance = Array.from(userMap.values())
      .map((u) => ({
        ...u,
        winRate: u.offerCount > 0 ? (u.wonCount / u.offerCount) * 100 : 0,
      }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5);

    // Top customers
    const customerMap = new Map<string, Customer>();
    offers.forEach((offer) => {
      if (offer.customerId) {
        const existing =
          customerMap.get(offer.customerId) ||
          mockCustomers.find((c) => c.id === offer.customerId);
        if (existing) {
          const totalValue = (existing.totalValue || 0) + offer.value;
          const activeOffers =
            (existing.activeOffers || 0) + (offer.status === "active" ? 1 : 0);
          customerMap.set(offer.customerId, {
            ...existing,
            totalValue,
            activeOffers,
          });
        }
      }
    });
    const topCustomers = Array.from(customerMap.values())
      .sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0))
      .slice(0, 5);

    // Active projects
    const activeProjects = projects
      .filter((p) => p.status === "active" || p.status === "planning")
      .slice(0, 5);

    // Calculate win rate
    const totalDecidedOffers = wonOffers.length + lostOffers.length;
    const winRate =
      totalDecidedOffers > 0
        ? (wonOffers.length / totalDecidedOffers) * 100
        : 0;

    // Revenue forecast (simplified)
    //const now = new Date();
    //const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    //const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const revenueForecast30Days = activeOffers
      .filter((o) => o.phase === "sent" || o.phase === "in_progress")
      .reduce((sum, o) => sum + (o.value * o.probability) / 100, 0);

    const revenueForecast90Days = activeOffers.reduce(
      (sum, o) => sum + (o.value * o.probability) / 100,
      0
    );

    return {
      totalOffers: offers.length,
      activeOffers: activeOffers.length,
      wonOffers: wonOffers.length,
      lostOffers: lostOffers.length,
      totalValue,
      weightedValue,
      averageProbability: Math.round(avgProbability),
      offersByPhase,
      pipeline,
      offerReserve: weightedValue,
      winRate,
      revenueForecast30Days,
      revenueForecast90Days,
      topDisciplines,
      activeProjects,
      topCustomers,
      teamPerformance,
      recentOffers: offers
        .slice(0, 5)
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ),
      recentProjects: projects
        .slice(0, 5)
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ),
      recentActivities: mockNotifications.slice(0, 10),
    };
  },
};
