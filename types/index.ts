// Core CRM entity types for Straye Relation

export type OfferPhase =
  | "Lead"
  | "Qualification"
  | "Proposal"
  | "Sent"
  | "Negotiation"
  | "Won"
  | "Lost";

export type OfferStatus = "Active" | "Inactive" | "Archived";

export type ProjectStatus =
  | "Planning"
  | "Active"
  | "OnHold"
  | "Completed"
  | "Cancelled";

export interface Discipline {
  id: string;
  name: string;
  cost: number;
  revenue: number;
  margin: number; // percentage
}

export interface OfferItem {
  id: string;
  discipline: string;
  cost: number;
  revenue: number;
  margin: number; // percentage
  description?: string;
  quantity?: number;
  unit?: string;
}

export interface Offer {
  id: string;
  title: string;
  customerId: string;
  customerName?: string;
  phase: OfferPhase;
  probability: number; // 0-100
  value: number;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
  responsibleUserId: string;
  responsibleUserName?: string;
  items: OfferItem[];
  description?: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  orgNumber: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
  totalValue?: number;
  activeOffers?: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  customerId: string;
  customerName?: string;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  managerId: string;
  managerName?: string;
  teamMembers?: string[];
  teamsChannelId?: string;
  teamsChannelUrl?: string;
  createdAt: string;
  updatedAt: string;
  offerId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  department?: string;
  avatar?: string;
}

export interface Notification {
  id: string;
  type: "offer" | "project" | "customer" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  entityId?: string;
  entityType?: "offer" | "project" | "customer";
}

export interface DashboardMetrics {
  totalOffers: number;
  activeOffers: number;
  wonOffers: number;
  lostOffers: number;
  totalValue: number;
  averageProbability: number;
  offersByPhase: Record<OfferPhase, number>;
  recentOffers: Offer[];
  recentProjects: Project[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter and sort types
export interface OfferFilters {
  phase?: OfferPhase[];
  status?: OfferStatus[];
  customerId?: string;
  responsibleUserId?: string;
  minValue?: number;
  maxValue?: number;
  minProbability?: number;
  maxProbability?: number;
}

export interface ProjectFilters {
  status?: ProjectStatus[];
  customerId?: string;
  managerId?: string;
  startDateFrom?: string;
  startDateTo?: string;
}

export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: string;
  direction: SortDirection;
}
