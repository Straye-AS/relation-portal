/**
 * API Type Bridge Layer
 *
 * This module provides a bridge between the generated API types from Swagger
 * and the legacy types used throughout the application. It allows for gradual
 * migration while maintaining backward compatibility.
 */

// Re-export generated types with application-friendly aliases
// These will be the canonical types going forward
export type {
  // DTOs (Data Transfer Objects)
  DomainCustomerDTO as Customer,
  DomainContactDTO as Contact,
  DomainDealDTO as Deal,
  DomainOfferDTO as Offer,
  DomainOfferDetailDTO as OfferDetail,
  DomainProjectDTO as Project,
  DomainActivityDTO as Activity,
  DomainBudgetItemDTO as BudgetDimension,
  DomainNotificationDTO as Notification,
  DomainAuthUserDTO as AuthUser,
  DomainFileDTO as FileInfo,
  DomainAuditLog as AuditLog,
  DomainSearchResult as SearchResult,
  DomainDashboardMetrics,
  DomainPaginatedResponse,

  // Request types
  DomainCreateCustomerRequest as CreateCustomerRequest,
  DomainCreateContactRequest as CreateContactRequest,
  DomainCreateDealRequest as CreateDealRequest,
  DomainCreateOfferRequest as CreateOfferRequest,
  DomainCreateProjectRequest as CreateProjectRequest,
  DomainCreateActivityRequest as CreateActivityRequest,
  DomainUpdateCustomerRequest as UpdateCustomerRequest,
  DomainUpdateContactRequest as UpdateContactRequest,
  DomainUpdateDealRequest as UpdateDealRequest,
  DomainUpdateOfferRequest as UpdateOfferRequest,
  DomainUpdateProjectRequest as UpdateProjectRequest,
  DomainUpdateActivityRequest as UpdateActivityRequest,
  DomainLoseDealRequest as LoseDealRequest,
  DomainAcceptOfferRequest as AcceptOfferRequest,
  DomainRejectOfferRequest as RejectOfferRequest,
  DomainUpdateOfferTitleRequest,
  DomainUpdateOfferValueRequest,
  DomainUpdateOfferProbabilityRequest,
  DomainUpdateOfferResponsibleRequest,
  DomainUpdateOfferProjectRequest,
} from "@/lib/.generated/data-contracts";

// Re-export Enums (as values)
export {
  DomainCompanyID,
  DomainCustomerStatus,
  DomainCustomerTier,
  DomainCustomerIndustry,
  DomainOfferPhase,
  DomainOfferStatus,
  DomainDealStage,
  DomainProjectPhase,
  DomainProjectHealth,
  DomainActivityType,
  DomainActivityStatus,
  DomainContactType,
  DomainLossReasonCategory,
} from "@/lib/.generated/data-contracts";

// Company type (static, not from API)
export type CompanyId =
  | "all"
  | "gruppen"
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

// Static company definitions
export const COMPANIES: Record<CompanyId, Company> = {
  all: {
    id: "all",
    name: "Alle selskaper",
    shortName: "Alle",
    color: "#6366f1",
  },
  gruppen: {
    id: "gruppen",
    name: "Straye Gruppen",
    shortName: "Gruppen",
    color: "#2563eb",
  },
  stalbygg: {
    id: "stalbygg",
    name: "Straye Stalbygg",
    shortName: "Stalbygg",
    color: "#059669",
  },
  hybridbygg: {
    id: "hybridbygg",
    name: "Straye Hybridbygg",
    shortName: "Hybridbygg",
    color: "#7c3aed",
  },
  industri: {
    id: "industri",
    name: "Straye Industri",
    shortName: "Industri",
    color: "#dc2626",
  },
  tak: { id: "tak", name: "Straye Tak", shortName: "Tak", color: "#ea580c" },
  montasje: {
    id: "montasje",
    name: "Straye Montasje",
    shortName: "Montasje",
    color: "#0891b2",
  },
};

// Enum types for status and phase fields
export type OfferPhase =
  | "draft"
  | "in_progress"
  | "sent"
  | "won"
  | "lost"
  | "expired";

export type OfferStatus = "active" | "cancelled";

export type DealStage =
  | "lead"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

export type ProjectPhase =
  | "tilbud"
  | "working"
  | "active"
  | "completed"
  | "cancelled";

export type CustomerStatus = "active" | "inactive" | "prospect" | "churned";

export type CustomerTier = "standard" | "premium" | "enterprise";

export type ActivityType =
  | "call"
  | "meeting"
  | "email"
  | "task"
  | "note"
  | "follow_up";

export type ActivityStatus =
  | "planned"
  | "in_progress"
  | "completed"
  | "cancelled";

export type ContactType =
  | "primary"
  | "billing"
  | "technical"
  | "decision_maker"
  | "influencer"
  | "other";

export type NotificationType =
  | "deal_update"
  | "offer_update"
  | "project_update"
  | "task_assigned"
  | "mention"
  | "system";

export type LossReasonCategory =
  | "price"
  | "timing"
  | "competitor"
  | "requirements"
  | "other";

// Norwegian labels for UI display
export const OFFER_PHASE_LABELS: Record<OfferPhase, string> = {
  draft: "Kladd",
  in_progress: "I gang",
  sent: "Sendt",
  won: "Vunnet",
  lost: "Tapt",
  expired: "Utgått",
};

export const DEAL_STAGE_LABELS: Record<DealStage, string> = {
  lead: "Lead",
  qualified: "Kvalifisert",
  proposal: "Tilbud",
  negotiation: "Forhandling",
  won: "Vunnet",
  lost: "Tapt",
};

export const PROJECT_PHASE_LABELS: Record<ProjectPhase, string> = {
  tilbud: "Tilbud",
  active: "Aktiv",
  working: "I arbeid",
  completed: "Ferdig",
  cancelled: "Kansellert",
};

export const CUSTOMER_STATUS_LABELS: Record<CustomerStatus, string> = {
  active: "Aktiv",
  inactive: "Inaktiv",
  prospect: "Prospekt",
  churned: "Churnet",
};

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  call: "Telefonsamtale",
  meeting: "Møte",
  email: "E-post",
  task: "Oppgave",
  note: "Notat",
  follow_up: "Oppfølging",
};

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  planned: "Planlagt",
  in_progress: "Pågår",
  completed: "Fullført",
  cancelled: "Kansellert",
};

export const LOSS_REASON_LABELS: Record<LossReasonCategory, string> = {
  price: "Pris",
  timing: "Timing",
  competitor: "Konkurrent",
  requirements: "Krav",
  other: "Annet",
};

// Default probability values for deal stages
export const DEAL_STAGE_PROBABILITY: Record<DealStage, number> = {
  lead: 20,
  qualified: 40,
  proposal: 60,
  negotiation: 80,
  won: 100,
  lost: 0,
};

// Utility type for API responses
export interface ApiError {
  error: string;
  message: string;
  code: number;
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// Sort parameters
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

export interface DashboardMetrics {
  totalOfferCount: number;
  offerReserve: number;
  weightedOfferReserve: number;
  averageProbability: number;
  pipeline: {
    phase: string;
    count: number;
    totalValue: number;
    weightedValue: number;
  }[];
  winRateMetrics: {
    wonCount: number;
    lostCount: number;
    wonValue: number;
    lostValue: number;
    winRate: number;
    economicWinRate: number;
  };
  orderReserve: number;
  totalInvoiced: number;
  totalValue: number;
  recentOffers: any[];
  recentProjects: any[];
  recentActivities: any[];
  topCustomers: any[];
}
