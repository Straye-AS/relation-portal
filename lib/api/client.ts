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
} from "@/types";
import { mockOffers } from "@/lib/mocks/offers";
import { mockCustomers } from "@/lib/mocks/customers";
import { mockProjects } from "@/lib/mocks/projects";
import { mockNotifications } from "@/lib/mocks/notifications";

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

  create: async (
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => {
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

// Dashboard API
export const dashboardApi = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    await delay(600);

    const activeOffers = mockOffers.filter((o) => o.status === "Active");
    const wonOffers = mockOffers.filter((o) => o.phase === "Won");
    const lostOffers = mockOffers.filter((o) => o.phase === "Lost");

    const totalValue = activeOffers.reduce((sum, o) => sum + o.value, 0);
    const avgProbability =
      activeOffers.reduce((sum, o) => sum + o.probability, 0) /
      (activeOffers.length || 1);

    const offersByPhase = mockOffers.reduce(
      (acc, offer) => {
        acc[offer.phase] = (acc[offer.phase] || 0) + 1;
        return acc;
      },
      {} as Record<OfferPhase, number>
    );

    return {
      totalOffers: mockOffers.length,
      activeOffers: activeOffers.length,
      wonOffers: wonOffers.length,
      lostOffers: lostOffers.length,
      totalValue,
      averageProbability: Math.round(avgProbability),
      offersByPhase,
      recentOffers: mockOffers.slice(0, 5),
      recentProjects: mockProjects.slice(0, 5),
    };
  },
};
