// Core CRM entity types for Straye Relation

export type OfferPhase =
  | "draft"
  | "in_progress"
  | "sent"
  | "order" // Customer accepted, work in progress
  | "completed" // Work finished
  | "lost"
  | "expired";

export type OfferStatus = "active" | "inactive" | "archived";

export type ProjectPhase =
  | "tilbud"
  | "working"
  | "on_hold"
  | "completed"
  | "cancelled";

export type ProjectStatus =
  | "planning"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled";

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
  companyId: CompanyId;
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

  // Execution tracking (for order/completed phases)
  managerId?: string;
  managerName?: string;
  teamMembers?: string[];
  spent?: number;
  invoiced?: number;
  orderReserve?: number;
  health?: "on_track" | "at_risk" | "delayed" | "over_budget";
  completionPercent?: number;
  startDate?: string;
  endDate?: string;
  estimatedCompletionDate?: string;
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

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  customerId?: string;
  customerName?: string;
  projectId?: string;
  projectName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  customerId: string;
  customerName?: string;
  companyId: CompanyId;
  phase: ProjectPhase;
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
  // Legacy support if needed, but user asked to remove status field usage
  status?: string;
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

export type CompanyId =
  | "all"
  | "gruppe"
  | "stalbygg"
  | "hybridbygg"
  | "industri"
  | "tak"
  | "montasje";

export interface Company {
  id: CompanyId;
  name: string;
  shortName: string;
  color: string;
  logo?: string;
}

export interface PipelinePhaseData {
  phase: OfferPhase;
  count: number;
  totalValue: number;
  weightedValue: number;
  offers?: Offer[];
}

export interface DisciplineStats {
  name: string;
  totalValue: number;
  offerCount: number;
  projectCount: number;
  avgMargin: number;
}

export interface TeamMemberStats {
  userId: string;
  name: string;
  avatar?: string;
  offerCount: number;
  wonCount: number;
  totalValue: number;
  wonValue: number;
  winRate: number;
}

export interface DashboardMetrics {
  totalOffers: number;
  activeOffers: number;
  wonOffers: number;
  lostOffers: number;
  totalValue: number;
  weightedValue: number;
  averageProbability: number;
  offersByPhase: Record<OfferPhase, number>;
  pipeline: PipelinePhaseData[];
  offerReserve: number;
  winRate: number;
  revenueForecast30Days: number;
  revenueForecast90Days: number;
  topDisciplines: DisciplineStats[];
  activeProjects: Project[];
  topCustomers: Customer[];
  teamPerformance: TeamMemberStats[];
  recentOffers: Offer[];
  recentProjects: Project[];
  recentActivities: Notification[];
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

// Search types
export type SearchEntityType = "customer" | "project" | "offer" | "contact";

export interface SearchResult {
  id: string;
  type: SearchEntityType;
  title: string;
  subtitle?: string;
  metadata?: string;
  entity: Customer | Project | Offer | Contact;
}

export interface SearchResults {
  customers: Customer[];
  projects: Project[];
  offers: Offer[];
  contacts: Contact[];
  total: number;
}
