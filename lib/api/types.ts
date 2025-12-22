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
  DomainActivityDTO as Activity,
  DomainBudgetItemDTO as BudgetDimension,
  DomainNotificationDTO as Notification,
  DomainAuthUserDTO as AuthUser,
  DomainFileDTO as FileInfo,
  DomainAuditLog as AuditLog,
  DomainSearchResult as SearchResult,
  DomainDashboardMetrics,
  DomainPaginatedResponse,

  // Supplier types
  DomainSupplierDTO as Supplier,
  DomainSupplierWithDetailsDTO as SupplierWithDetails,
  DomainSupplierContactDTO as SupplierContact,
  DomainOfferSupplierDTO as OfferSupplier,
  DomainSupplierStatsDTO as SupplierStats,
  DomainCreateSupplierRequest as CreateSupplierRequest,
  DomainUpdateSupplierRequest as UpdateSupplierRequest,
  DomainUpdateSupplierStatusRequest as UpdateSupplierStatusRequest,
  DomainUpdateSupplierCategoryRequest as UpdateSupplierCategoryRequest,
  DomainUpdateSupplierNotesRequest as UpdateSupplierNotesRequest,
  DomainUpdateSupplierPaymentTermsRequest as UpdateSupplierPaymentTermsRequest,

  // Request types
  DomainCreateCustomerRequest as CreateCustomerRequest,
  DomainCreateContactRequest as CreateContactRequest,
  DomainCreateDealRequest as CreateDealRequest,
  DomainCreateOfferRequest as CreateOfferRequest,
  DomainCreateActivityRequest as CreateActivityRequest,
  DomainUpdateCustomerRequest as UpdateCustomerRequest,
  DomainUpdateContactRequest as UpdateContactRequest,
  DomainUpdateDealRequest as UpdateDealRequest,
  DomainUpdateOfferRequest as UpdateOfferRequest,
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

import type {
  DomainProjectDTO as GeneratedProjectDTO,
  DomainCreateProjectRequest as GeneratedCreateProjectRequest,
  DomainUpdateProjectRequest as GeneratedUpdateProjectRequest,
} from "@/lib/.generated/data-contracts";

export interface Project extends GeneratedProjectDTO {
  location?: string;
  externalReference?: string;
}

export interface CreateProjectRequest extends GeneratedCreateProjectRequest {
  location?: string;
  externalReference?: string;
}

export interface UpdateProjectRequest extends GeneratedUpdateProjectRequest {
  location?: string;
  externalReference?: string;
}

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
  DomainActivityType,
  DomainActivityStatus,
  DomainContactType,
  DomainLossReasonCategory,
  DomainSupplierStatus,
  DomainOfferSupplierStatus,
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
    name: "Straye Stålbygg",
    shortName: "Stålbygg",
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
  | "order" // Customer accepted, work in progress
  | "completed" // Work finished
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
  | "on_hold"
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

export type SupplierStatus = "active" | "inactive" | "pending" | "blacklisted";

export type OfferSupplierStatusType = "active" | "done";

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
  order: "Ordre",
  completed: "Ferdig",
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
  working: "I arbeid",
  on_hold: "På vent",
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

// Supplier status labels (Norwegian)
export const SUPPLIER_STATUS_LABELS: Record<SupplierStatus, string> = {
  active: "Aktiv",
  inactive: "Inaktiv",
  pending: "Avventer",
  blacklisted: "Svartelistet",
};

// Supplier status badge variants (for shadcn/ui Badge component)
export const SUPPLIER_STATUS_VARIANTS: Record<
  SupplierStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  inactive: "secondary",
  pending: "outline",
  blacklisted: "destructive",
};

// Offer-Supplier status labels
export const OFFER_SUPPLIER_STATUS_LABELS: Record<
  OfferSupplierStatusType,
  string
> = {
  active: "Aktiv",
  done: "Ferdig",
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

/**
 * HTTP Error response from API client.
 * Covers different error shapes from fetch/axios/generated client.
 */
export interface HttpErrorResponse extends Error {
  /** Direct HTTP status code */
  status?: number;
  /** Nested response object (axios-style) */
  response?: {
    status?: number;
    data?: unknown;
  };
  /** Alternative status code property */
  statusCode?: number;
}

/**
 * Type guard to check if an error is an HTTP error response
 */
export function isHttpError(error: unknown): error is HttpErrorResponse {
  return (
    error instanceof Error &&
    (typeof (error as HttpErrorResponse).status === "number" ||
      typeof (error as HttpErrorResponse).response?.status === "number" ||
      typeof (error as HttpErrorResponse).statusCode === "number")
  );
}

/**
 * Get HTTP status code from various error shapes
 */
export function getHttpErrorStatus(error: unknown): number | undefined {
  if (!isHttpError(error)) return undefined;
  return error.status ?? error.response?.status ?? error.statusCode;
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
  recentOffers: import("@/lib/.generated/data-contracts").DomainOfferDTO[];
  recentOrders: import("@/lib/.generated/data-contracts").DomainOfferDTO[];
  recentActivities: import("@/lib/.generated/data-contracts").DomainActivityDTO[];
  topCustomers: import("@/lib/.generated/data-contracts").DomainTopCustomerDTO[];
}
