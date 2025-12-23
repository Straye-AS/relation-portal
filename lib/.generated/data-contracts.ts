/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum DomainTimeRange {
  TimeRangeRolling12Months = "rolling12months",
  TimeRangeAllTime = "allTime",
  TimeRangeCustom = "custom",
}

export enum DomainSupplierStatus {
  SupplierStatusActive = "active",
  SupplierStatusInactive = "inactive",
  SupplierStatusPending = "pending",
  SupplierStatusBlacklisted = "blacklisted",
}

export enum DomainProjectPhase {
  ProjectPhaseTilbud = "tilbud",
  ProjectPhaseWorking = "working",
  ProjectPhaseOnHold = "on_hold",
  ProjectPhaseCompleted = "completed",
  ProjectPhaseCancelled = "cancelled",
}

export enum DomainOfferSupplierStatus {
  OfferSupplierStatusActive = "active",
  OfferSupplierStatusDone = "done",
}

export enum DomainOfferStatus {
  OfferStatusActive = "active",
  OfferStatusInactive = "inactive",
  OfferStatusArchived = "archived",
}

export enum DomainOfferPhase {
  OfferPhaseDraft = "draft",
  OfferPhaseInProgress = "in_progress",
  OfferPhaseSent = "sent",
  /** Customer accepted, work in progress */
  OfferPhaseOrder = "order",
  /** Work finished */
  OfferPhaseCompleted = "completed",
  OfferPhaseLost = "lost",
  OfferPhaseExpired = "expired",
}

export enum DomainOfferHealth {
  OfferHealthOnTrack = "on_track",
  OfferHealthAtRisk = "at_risk",
  OfferHealthDelayed = "delayed",
  OfferHealthOverBudget = "over_budget",
}

export enum DomainLossReasonCategory {
  LossReasonPrice = "price",
  LossReasonTiming = "timing",
  LossReasonCompetitor = "competitor",
  LossReasonRequirements = "requirements",
  LossReasonOther = "other",
}

export enum DomainDealStage {
  DealStageLead = "lead",
  DealStageQualified = "qualified",
  DealStageProposal = "proposal",
  DealStageNegotiation = "negotiation",
  DealStageWon = "won",
  DealStageLost = "lost",
}

export enum DomainCustomerTier {
  CustomerTierBronze = "bronze",
  CustomerTierSilver = "silver",
  CustomerTierGold = "gold",
  CustomerTierPlatinum = "platinum",
}

export enum DomainCustomerStatus {
  CustomerStatusActive = "active",
  CustomerStatusInactive = "inactive",
  CustomerStatusLead = "lead",
  CustomerStatusChurned = "churned",
}

export enum DomainCustomerIndustry {
  CustomerIndustryConstruction = "construction",
  CustomerIndustryManufacturing = "manufacturing",
  CustomerIndustryRetail = "retail",
  CustomerIndustryLogistics = "logistics",
  CustomerIndustryAgriculture = "agriculture",
  CustomerIndustryEnergy = "energy",
  CustomerIndustryPublicSector = "public_sector",
  CustomerIndustryRealEstate = "real_estate",
  CustomerIndustryOther = "other",
}

export enum DomainContactType {
  ContactTypePrimary = "primary",
  ContactTypeSecondary = "secondary",
  ContactTypeBilling = "billing",
  ContactTypeTechnical = "technical",
  ContactTypeExecutive = "executive",
  ContactTypeOther = "other",
}

export enum DomainContactEntityType {
  ContactEntityCustomer = "customer",
  ContactEntityProject = "project",
  ContactEntityDeal = "deal",
}

export enum DomainCompanyID {
  CompanyAll = "all",
  CompanyGruppen = "gruppen",
  CompanyStalbygg = "stalbygg",
  CompanyHybridbygg = "hybridbygg",
  CompanyIndustri = "industri",
  CompanyTak = "tak",
  CompanyMontasje = "montasje",
}

export enum DomainBudgetParentType {
  BudgetParentOffer = "offer",
  BudgetParentProject = "project",
}

export enum DomainAuditAction {
  AuditActionCreate = "create",
  AuditActionUpdate = "update",
  AuditActionDelete = "delete",
  AuditActionLogin = "login",
  AuditActionLogout = "logout",
  AuditActionPermissionGrant = "permission_grant",
  AuditActionPermissionRevoke = "permission_revoke",
  AuditActionRoleAssign = "role_assign",
  AuditActionRoleRemove = "role_remove",
  AuditActionExport = "export",
  AuditActionImport = "import",
  AuditActionAPICall = "api_call",
}

export enum DomainActivityType {
  ActivityTypeMeeting = "meeting",
  ActivityTypeCall = "call",
  ActivityTypeEmail = "email",
  ActivityTypeTask = "task",
  ActivityTypeNote = "note",
  ActivityTypeSystem = "system",
}

export enum DomainActivityTargetType {
  ActivityTargetCustomer = "Customer",
  ActivityTargetContact = "Contact",
  ActivityTargetProject = "Project",
  ActivityTargetOffer = "Offer",
  ActivityTargetDeal = "Deal",
  ActivityTargetFile = "File",
  ActivityTargetNotification = "Notification",
  ActivityTargetSupplier = "Supplier",
}

export enum DomainActivityStatus {
  ActivityStatusPlanned = "planned",
  ActivityStatusInProgress = "in_progress",
  ActivityStatusCompleted = "completed",
  ActivityStatusCancelled = "cancelled",
}

export interface DomainAPIError {
  detail?: string;
  errors?: Record<string, string>;
  status?: number;
  title?: string;
  type?: string;
}

export interface DomainAcceptOfferRequest {
  /** If true, create a project from this offer */
  createProject?: boolean;
  /** @maxLength 100 */
  managerId?: string;
  /** @maxLength 200 */
  projectName?: string;
}

export interface DomainAcceptOfferResponse {
  offer?: DomainOfferDTO;
  /** Only present if createProject was true */
  project?: DomainProjectDTO;
}

export interface DomainAcceptOrderRequest {
  /**
   * Notes is an optional note about why this order was accepted
   * @maxLength 500
   */
  notes?: string;
}

export interface DomainAcceptOrderResponse {
  offer?: DomainOfferDTO;
}

export interface DomainActivityDTO {
  activityType?: DomainActivityType;
  assignedToId?: string;
  attendees?: string[];
  body?: string;
  companyId?: DomainCompanyID;
  completedAt?: string;
  createdAt?: string;
  creatorId?: string;
  creatorName?: string;
  dueDate?: string;
  durationMinutes?: number;
  id?: string;
  isPrivate?: boolean;
  occurredAt?: string;
  parentActivityId?: string;
  priority?: number;
  scheduledAt?: string;
  status?: DomainActivityStatus;
  targetId?: string;
  targetName?: string;
  targetType?: DomainActivityTargetType;
  title?: string;
}

export interface DomainActivityStatusCounts {
  cancelled?: number;
  completed?: number;
  inProgress?: number;
  planned?: number;
}

export interface DomainAddAttendeeRequest {
  /** @maxLength 100 */
  userId: string;
}

export interface DomainAddContactRelationshipRequest {
  entityId: string;
  entityType: DomainContactEntityType;
  isPrimary?: boolean;
  /** @maxLength 100 */
  role?: string;
}

export interface DomainAddOfferBudgetItemRequest {
  description?: string;
  /** @min 0 */
  displayOrder?: number;
  /** @min 0 */
  expectedCost?: number;
  /**
   * @min 0
   * @max 100
   */
  expectedMargin?: number;
  /** @maxLength 200 */
  name: string;
  /** @min 0 */
  pricePerItem?: number;
  /** @min 0 */
  quantity?: number;
}

export interface DomainAddOfferSupplierRequest {
  contactId?: string;
  notes?: string;
  status?: DomainOfferSupplierStatus;
  supplierId: string;
}

export interface DomainAdvanceOfferRequest {
  /** If true and no ProjectID, auto-create a project when advancing from draft */
  createProject?: boolean;
  phase: DomainOfferPhase;
  /** Link to existing project */
  projectId?: string;
}

export interface DomainAuditLog {
  action?: DomainAuditAction;
  changes?: string;
  companyID?: DomainCompanyID;
  createdAt?: string;
  entityID?: string;
  entityName?: string;
  entityType?: string;
  id?: string;
  ipaddress?: string;
  metadata?: string;
  newValues?: string;
  oldValues?: string;
  performedAt?: string;
  requestID?: string;
  userAgent?: string;
  userEmail?: string;
  userID?: string;
  userName?: string;
}

export interface DomainAuthUserDTO {
  company?: DomainCompanyDTO;
  email?: string;
  id?: string;
  initials?: string;
  isCompanyAdmin?: boolean;
  isSuperAdmin?: boolean;
  name?: string;
  roles?: string[];
}

export interface DomainBudgetItemDTO {
  createdAt?: string;
  description?: string;
  displayOrder?: number;
  expectedCost?: number;
  expectedMargin?: number;
  expectedProfit?: number;
  expectedRevenue?: number;
  id?: string;
  name?: string;
  parentId?: string;
  parentType?: DomainBudgetParentType;
  pricePerItem?: number;
  quantity?: number;
  updatedAt?: string;
}

export interface DomainBudgetSummaryDTO {
  itemCount?: number;
  marginPercent?: number;
  parentId?: string;
  parentType?: DomainBudgetParentType;
  totalCost?: number;
  totalProfit?: number;
  totalRevenue?: number;
}

export interface DomainCloneOfferRequest {
  /** Default true - clone budget items (nil treated as true) */
  includeBudget?: boolean;
  /** Default false - files are not cloned by default */
  includeFiles?: boolean;
  /** @maxLength 200 */
  newTitle?: string;
}

export interface DomainCompany {
  color?: string;
  createdAt?: string;
  defaultOfferResponsibleId?: string;
  defaultProjectResponsibleId?: string;
  id?: DomainCompanyID;
  isActive?: boolean;
  logo?: string;
  name?: string;
  orgNumber?: string;
  shortName?: string;
  updatedAt?: string;
}

export interface DomainCompanyDTO {
  id?: string;
  name?: string;
}

export interface DomainCompanyDetailDTO {
  color?: string;
  createdAt?: string;
  defaultOfferResponsibleId?: string;
  defaultProjectResponsibleId?: string;
  id?: string;
  isActive?: boolean;
  logo?: string;
  name?: string;
  orgNumber?: string;
  shortName?: string;
  updatedAt?: string;
}

export interface DomainCompleteActivityRequest {
  /** @maxLength 500 */
  outcome?: string;
}

export interface DomainContactDTO {
  address?: string;
  city?: string;
  contactType?: DomainContactType;
  country?: string;
  /** ISO 8601 */
  createdAt?: string;
  /** User tracking fields */
  createdById?: string;
  createdByName?: string;
  department?: string;
  email?: string;
  firstName?: string;
  fullName?: string;
  id?: string;
  isActive?: boolean;
  lastName?: string;
  linkedInUrl?: string;
  mobile?: string;
  notes?: string;
  phone?: string;
  postalCode?: string;
  preferredContactMethod?: string;
  primaryCustomerId?: string;
  primaryCustomerName?: string;
  relationships?: DomainContactRelationshipDTO[];
  title?: string;
  /** ISO 8601 */
  updatedAt?: string;
  updatedById?: string;
  updatedByName?: string;
}

export interface DomainContactRelationshipDTO {
  contactId?: string;
  createdAt?: string;
  entityId?: string;
  entityType?: DomainContactEntityType;
  id?: string;
  isPrimary?: boolean;
  role?: string;
}

export interface DomainConversionRateDTO {
  conversionRate?: number;
  dealsConverted?: number;
  fromStage?: string;
  toStage?: string;
  totalDeals?: number;
}

export interface DomainConvertInquiryRequest {
  companyId?: DomainCompanyID;
  /** @maxLength 100 */
  responsibleUserId?: string;
}

export interface DomainConvertInquiryResponse {
  offer?: DomainOfferDTO;
  offerNumber?: string;
}

export interface DomainCreateActivityRequest {
  activityType: DomainActivityType;
  /** @maxLength 100 */
  assignedToId?: string;
  attendees?: string[];
  /** @maxLength 2000 */
  body?: string;
  companyId?: DomainCompanyID;
  dueDate?: string;
  /** @min 1 */
  durationMinutes?: number;
  isPrivate?: boolean;
  /**
   * @min 0
   * @max 5
   */
  priority?: number;
  scheduledAt?: string;
  status?: DomainActivityStatus;
  targetId: string;
  targetType: DomainActivityTargetType;
  /** @maxLength 200 */
  title: string;
}

export interface DomainCreateContactRequest {
  /** @maxLength 500 */
  address?: string;
  /** @maxLength 100 */
  city?: string;
  contactType?: DomainContactType;
  /** @maxLength 100 */
  country?: string;
  /** @maxLength 100 */
  department?: string;
  /** @maxLength 255 */
  email?: string;
  /** @maxLength 100 */
  firstName: string;
  /** @maxLength 100 */
  lastName: string;
  /** @maxLength 500 */
  linkedInUrl?: string;
  /** @maxLength 50 */
  mobile?: string;
  notes?: string;
  /** @maxLength 50 */
  phone?: string;
  /** @maxLength 20 */
  postalCode?: string;
  /** @maxLength 50 */
  preferredContactMethod?: string;
  primaryCustomerId?: string;
  /** @maxLength 100 */
  title?: string;
}

export interface DomainCreateCustomerRequest {
  /** @maxLength 500 */
  address?: string;
  /** @maxLength 100 */
  city?: string;
  contactEmail?: string;
  /** @maxLength 200 */
  contactPerson?: string;
  /** @maxLength 50 */
  contactPhone?: string;
  /** @maxLength 100 */
  country: string;
  /** @maxLength 100 */
  county?: string;
  creditLimit?: number;
  /** @maxLength 50 */
  customerClass?: string;
  email?: string;
  industry?: DomainCustomerIndustry;
  isInternal?: boolean;
  /** @maxLength 100 */
  municipality?: string;
  /** @maxLength 200 */
  name: string;
  notes?: string;
  /** @maxLength 20 */
  orgNumber?: string;
  /** @maxLength 50 */
  phone?: string;
  /** @maxLength 20 */
  postalCode?: string;
  status?: DomainCustomerStatus;
  tier?: DomainCustomerTier;
  /** @maxLength 500 */
  website?: string;
}

export interface DomainCreateDealRequest {
  companyId: DomainCompanyID;
  /** @maxLength 3 */
  currency?: string;
  customerId: string;
  description?: string;
  expectedCloseDate?: string;
  notes?: string;
  offerId?: string;
  /** @maxLength 100 */
  ownerId: string;
  /**
   * @min 0
   * @max 100
   */
  probability?: number;
  /** @maxLength 100 */
  source?: string;
  stage?: DomainDealStage;
  /** @maxLength 200 */
  title: string;
  /** @min 0 */
  value?: number;
}

export interface DomainCreateFollowUpRequest {
  /** @maxLength 100 */
  assignedToId?: string;
  /** @maxLength 2000 */
  description?: string;
  dueDate?: string;
  /** @maxLength 200 */
  title: string;
}

export interface DomainCreateInquiryRequest {
  customerId: string;
  description?: string;
  dueDate?: string;
  notes?: string;
  /** @maxLength 200 */
  title: string;
}

export interface DomainCreateOfferFromDealRequest {
  /** Optional: copy budget dimensions from this offer */
  templateOfferId?: string;
  /** @maxLength 200 */
  title?: string;
}

export interface DomainCreateOfferFromDealResponse {
  deal?: DomainDealDTO;
  offer?: DomainOfferDTO;
}

export interface DomainCreateOfferItemRequest {
  /** @min 0 */
  cost: number;
  description?: string;
  /** @maxLength 200 */
  discipline: string;
  /** @min 0 */
  quantity?: number;
  /** @min 0 */
  revenue: number;
  /** @maxLength 50 */
  unit?: string;
}

export interface DomainCreateOfferRequest {
  companyId?: DomainCompanyID;
  /** @min 0 */
  cost?: number;
  /** If true and no ProjectID, auto-create a project */
  createProject?: boolean;
  /** Optional if projectId is provided (inherits from project) */
  customerId?: string;
  description?: string;
  dueDate?: string;
  /** Optional, defaults to 60 days after sent date */
  expirationDate?: string;
  items?: DomainCreateOfferItemRequest[];
  /** @maxLength 200 */
  location?: string;
  notes?: string;
  phase?: DomainOfferPhase;
  /**
   * @min 0
   * @max 100
   */
  probability?: number;
  /** Link to existing project */
  projectId?: string;
  responsibleUserId?: string;
  sentDate?: string;
  status?: DomainOfferStatus;
  /** @maxLength 200 */
  title: string;
}

export interface DomainCreateProjectRequest {
  /** Optional - projects can be cross-company */
  customerId?: string;
  dealId?: string;
  description?: string;
  endDate?: string;
  /** @maxLength 100 */
  externalReference?: string;
  /** @maxLength 200 */
  location?: string;
  /** @maxLength 200 */
  name: string;
  /** Updated phases */
  phase?: DomainCreateProjectRequestPhaseEnum;
  /** @maxLength 50 */
  projectNumber?: string;
  startDate?: string;
  summary?: string;
}

export interface DomainCreateSupplierContactRequest {
  email?: string;
  /** @maxLength 100 */
  firstName: string;
  isPrimary?: boolean;
  /** @maxLength 100 */
  lastName: string;
  notes?: string;
  /** @maxLength 50 */
  phone?: string;
  /** @maxLength 200 */
  title?: string;
}

export interface DomainCreateSupplierRequest {
  /** @maxLength 500 */
  address?: string;
  /** @maxLength 200 */
  category?: string;
  /** @maxLength 100 */
  city?: string;
  contactEmail?: string;
  /** @maxLength 200 */
  contactPerson?: string;
  /** @maxLength 50 */
  contactPhone?: string;
  /** @maxLength 100 */
  country: string;
  /** @maxLength 100 */
  county?: string;
  email?: string;
  /** @maxLength 100 */
  municipality?: string;
  /** @maxLength 200 */
  name: string;
  notes?: string;
  /** @maxLength 20 */
  orgNumber?: string;
  /** @maxLength 200 */
  paymentTerms?: string;
  /** @maxLength 50 */
  phone?: string;
  /** @maxLength 20 */
  postalCode?: string;
  status?: DomainSupplierStatus;
  /** @maxLength 500 */
  website?: string;
}

export interface DomainCustomerDTO {
  activeOffers?: number;
  address?: string;
  city?: string;
  contactEmail?: string;
  contactPerson?: string;
  contactPhone?: string;
  country?: string;
  county?: string;
  /** ISO 8601 */
  createdAt?: string;
  /** User tracking fields */
  createdById?: string;
  createdByName?: string;
  creditLimit?: number;
  customerClass?: string;
  email?: string;
  id?: string;
  industry?: DomainCustomerIndustry;
  isInternal?: boolean;
  municipality?: string;
  name?: string;
  notes?: string;
  orgNumber?: string;
  phone?: string;
  postalCode?: string;
  status?: DomainCustomerStatus;
  tier?: DomainCustomerTier;
  /** Value of offers in in_progress or sent phases */
  totalValueActive?: number;
  /** Value of offers in order or completed phases */
  totalValueWon?: number;
  /** ISO 8601 */
  updatedAt?: string;
  updatedById?: string;
  updatedByName?: string;
  website?: string;
}

export interface DomainCustomerERPDifferencesResponse {
  /** Whether data warehouse is available */
  dataWarehouseEnabled?: boolean;
  /** Total customers in ERP */
  erpCustomerCount?: number;
  /** Total customers in our DB */
  localCustomerCount?: number;
  /** Customers in local DB but not in ERP */
  missingInERP?: DomainLocalCustomerDTO[];
  /** Customers in ERP but not in local DB */
  missingInLocal?: DomainERPCustomerDTO[];
  /** ISO 8601 - When the comparison was performed */
  syncedAt?: string;
}

export interface DomainCustomerMinimalDTO {
  id?: string;
  name?: string;
}

export interface DomainCustomerStatsDTO {
  activeDeals?: number;
  /** Count of offers in order phase (active orders) */
  activeOffers?: number;
  activeProjects?: number;
  /** Count of offers in completed phase */
  completedOffers?: number;
  /** Count of files attached to the customer */
  fileCount?: number;
  totalContacts?: number;
  totalOffers?: number;
  totalProjects?: number;
  /** Value of offers in order phase (active orders) */
  totalValueActive?: number;
  /** Value of offers in order or completed phases */
  totalValueWon?: number;
  /** Count of offers in in_progress or sent phases */
  workingOffers?: number;
}

export interface DomainCustomerWithDetailsDTO {
  activeDeals?: DomainDealDTO[];
  activeOffers?: number;
  activeProjects?: DomainProjectDTO[];
  address?: string;
  city?: string;
  contactEmail?: string;
  contactPerson?: string;
  contactPhone?: string;
  contacts?: DomainContactDTO[];
  country?: string;
  county?: string;
  /** ISO 8601 */
  createdAt?: string;
  /** User tracking fields */
  createdById?: string;
  createdByName?: string;
  creditLimit?: number;
  customerClass?: string;
  email?: string;
  id?: string;
  industry?: DomainCustomerIndustry;
  isInternal?: boolean;
  municipality?: string;
  name?: string;
  notes?: string;
  orgNumber?: string;
  phone?: string;
  postalCode?: string;
  stats?: DomainCustomerStatsDTO;
  status?: DomainCustomerStatus;
  tier?: DomainCustomerTier;
  /** Value of offers in in_progress or sent phases */
  totalValueActive?: number;
  /** Value of offers in order or completed phases */
  totalValueWon?: number;
  /** ISO 8601 */
  updatedAt?: string;
  updatedById?: string;
  updatedByName?: string;
  website?: string;
}

export interface DomainDashboardMetrics {
  /**
   * Order Metrics (from offers in order and completed phases)
   * Execution tracking has moved from projects to offers
   */
  activeOrderCount?: number;
  /** Average completion_percent for order phase offers */
  averageOrderProgress?: number;
  /** Average probability of active offers */
  averageProbability?: number;
  /** Count of offers in completed phase */
  completedOrderCount?: number;
  /** FromDate is set when using custom date range (start of range, 00:00:00) */
  fromDate?: string;
  /** Count of order phase offers by health status */
  healthDistribution?: DomainHealthDistribution;
  /** Total value of active offers - best per project (avoids double-counting) */
  offerReserve?: number;
  /** Sum of (value - invoiced) for order phase offers */
  orderReserve?: number;
  /** Total value of offers in order phase */
  orderValue?: number;
  /**
   * Pipeline Data (phases: in_progress, sent, order, lost - excludes draft and expired)
   * Uses aggregation: for projects with multiple offers, only the highest value per phase is counted
   */
  pipeline?: DomainPipelinePhaseData[];
  /** Last activities */
  recentActivities?: DomainActivityDTO[];
  /** Recent Lists (limit 5 each) */
  recentOffers?: DomainOfferDTO[];
  /** Offers in order phase (Siste ordre), sorted by updated_at DESC */
  recentOrders?: DomainOfferDTO[];
  /** TimeRange indicates the time range used for the metrics */
  timeRange?: DomainTimeRange;
  /** ToDate is set when using custom date range (end of range, 23:59:59) */
  toDate?: string;
  /** Top Customers (limit 5) */
  topCustomers?: DomainTopCustomerDTO[];
  /** Sum of invoiced for order phase offers */
  totalInvoiced?: number;
  /** Offer Metrics (excluding drafts and expired) */
  totalOfferCount?: number;
  /** Count of unique projects with offers (excludes orphan offers) */
  totalProjectCount?: number;
  /** Sum of spent for order phase offers */
  totalSpent?: number;
  /** Financial Summary */
  totalValue?: number;
  /** Sum of (value * probability/100) for active offers */
  weightedOfferReserve?: number;
  /** Win Rate Metrics */
  winRateMetrics?: DomainWinRateMetrics;
}

export interface DomainDataWarehouseFinancialsDTO {
  /** Whether data warehouse connection was successful */
  connected?: boolean;
  /** Sum of employee cost accounts (5000-5999) */
  employeeCosts?: number;
  /** Sum of material cost accounts (4000-4999) */
  materialCosts?: number;
  /** totalIncome - all costs */
  netResult?: number;
  /** Sum of other cost accounts (>=6000) */
  otherCosts?: number;
  /** Sum of income accounts (3000-3999) */
  totalIncome?: number;
}

export interface DomainDealDTO {
  actualCloseDate?: string;
  companyId?: DomainCompanyID;
  createdAt?: string;
  currency?: string;
  customerId?: string;
  customerName?: string;
  description?: string;
  expectedCloseDate?: string;
  id?: string;
  lossReasonCategory?: DomainLossReasonCategory;
  lostReason?: string;
  notes?: string;
  offerId?: string;
  ownerId?: string;
  ownerName?: string;
  probability?: number;
  source?: string;
  stage?: DomainDealStage;
  title?: string;
  updatedAt?: string;
  value?: number;
  weightedValue?: number;
}

export interface DomainDealStageHistoryDTO {
  changedAt?: string;
  changedById?: string;
  changedByName?: string;
  dealId?: string;
  fromStage?: DomainDealStage;
  id?: string;
  notes?: string;
  toStage?: DomainDealStage;
}

export interface DomainERPCustomerDTO {
  name?: string;
  organizationNumber?: string;
}

export interface DomainErrorResponse {
  code?: number;
  error?: string;
  message?: string;
}

export interface DomainFileDTO {
  companyId?: DomainCompanyID;
  contentType?: string;
  createdAt?: string;
  customerId?: string;
  filename?: string;
  id?: string;
  offerId?: string;
  offerSupplierId?: string;
  projectId?: string;
  size?: number;
  supplierId?: string;
}

export interface DomainFuzzyCustomerSearchResponse {
  /** 0-1 score indicating match quality */
  confidence?: number;
  /** Single best match */
  customer?: DomainCustomerMinimalDTO;
  /** All customers (when query is "all") */
  customers?: DomainCustomerMinimalDTO[];
  found?: boolean;
}

export interface DomainHealthDistribution {
  /** Offers at risk */
  atRisk?: number;
  /** Delayed offers */
  delayed?: number;
  /** Offers on track */
  onTrack?: number;
  /** Over budget offers */
  overBudget?: number;
}

export interface DomainLocalCustomerDTO {
  id?: string;
  name?: string;
  organizationNumber?: string;
}

export interface DomainLoseDealRequest {
  /**
   * @minLength 10
   * @maxLength 500
   * @example "Lost to competitor XYZ who offered lower price"
   */
  notes: string;
  /** @example "competitor" */
  reason: DomainLoseDealRequestReasonEnum;
}

export interface DomainNextOfferNumberResponse {
  /** The company ID this number is for */
  companyId?: DomainCompanyID;
  /** The next offer number that would be assigned, e.g., "TK-2025-001" */
  nextOfferNumber?: string;
  /** The year component of the number */
  year?: number;
}

export interface DomainNotificationDTO {
  /** ISO 8601 */
  createdAt?: string;
  entityId?: string;
  entityType?: string;
  id?: string;
  message?: string;
  read?: boolean;
  title?: string;
  type?: string;
}

export interface DomainOfferDTO {
  companyId?: DomainCompanyID;
  /** 0-100 progress indicator */
  completionPercent?: number;
  /** Internal cost */
  cost?: number;
  /** ISO 8601 */
  createdAt?: string;
  /** User tracking fields */
  createdById?: string;
  createdByName?: string;
  /** Whether customer has won their project */
  customerHasWonProject?: boolean;
  /** Optional - offer can exist without customer */
  customerId?: string;
  customerName?: string;
  description?: string;
  /** ISO 8601 */
  dueDate?: string;
  /** Employee costs from data warehouse */
  dwEmployeeCosts?: number;
  /** ISO 8601 - Last sync timestamp */
  dwLastSyncedAt?: string;
  /** Material costs from data warehouse */
  dwMaterialCosts?: number;
  /** Net result from data warehouse */
  dwNetResult?: number;
  /** Other costs from data warehouse */
  dwOtherCosts?: number;
  /** Data Warehouse synced fields */
  dwTotalIncome?: number;
  /** ISO 8601 - Planned end date */
  endDate?: string;
  /** ISO 8601 - Current estimate for completion */
  estimatedCompletionDate?: string;
  /** ISO 8601 - When offer expires (default 60 days after sent) */
  expirationDate?: string;
  /** External/customer reference number */
  externalReference?: string;
  /** Health status during execution */
  health?: string;
  id?: string;
  /** Amount invoiced to customer */
  invoiced?: number;
  items?: DomainOfferItemDTO[];
  location?: string;
  /** Order phase execution fields (used when phase = "order" or "completed") */
  managerId?: string;
  managerName?: string;
  /** Calculated: Value - Cost */
  margin?: number;
  /** Dekningsgrad: (Value - Cost) / Value * 100 */
  marginPercent?: number;
  notes?: string;
  /** Internal number, e.g., "TK-2025-001" */
  offerNumber?: string;
  /** Generated column: value - invoiced (read-only) */
  orderReserve?: number;
  phase?: DomainOfferPhase;
  probability?: number;
  /** Link to project (nullable) */
  projectId?: string;
  projectName?: string;
  responsibleUserId?: string;
  responsibleUserName?: string;
  /** ISO 8601 */
  sentDate?: string;
  /** Actual costs incurred */
  spent?: number;
  /** ISO 8601 - When work started */
  startDate?: string;
  status?: DomainOfferStatus;
  teamMembers?: string[];
  title?: string;
  /** ISO 8601 */
  updatedAt?: string;
  updatedById?: string;
  updatedByName?: string;
  value?: number;
}

export interface DomainOfferDetailDTO {
  budgetItems?: DomainBudgetItemDTO[];
  budgetSummary?: DomainBudgetSummaryDTO;
  companyId?: DomainCompanyID;
  /** 0-100 progress indicator */
  completionPercent?: number;
  /** Internal cost */
  cost?: number;
  /** ISO 8601 */
  createdAt?: string;
  /** User tracking fields */
  createdById?: string;
  createdByName?: string;
  /** Whether customer has won their project */
  customerHasWonProject?: boolean;
  /** Optional - offer can exist without customer */
  customerId?: string;
  customerName?: string;
  description?: string;
  /** ISO 8601 */
  dueDate?: string;
  /** Employee costs from data warehouse */
  dwEmployeeCosts?: number;
  /** ISO 8601 - Last sync timestamp */
  dwLastSyncedAt?: string;
  /** Material costs from data warehouse */
  dwMaterialCosts?: number;
  /** Net result from data warehouse */
  dwNetResult?: number;
  /** Other costs from data warehouse */
  dwOtherCosts?: number;
  /** Data Warehouse synced fields */
  dwTotalIncome?: number;
  /** ISO 8601 - Planned end date */
  endDate?: string;
  /** ISO 8601 - Current estimate for completion */
  estimatedCompletionDate?: string;
  /** ISO 8601 - When offer expires (default 60 days after sent) */
  expirationDate?: string;
  /** External/customer reference number */
  externalReference?: string;
  filesCount?: number;
  /** Health status during execution */
  health?: string;
  id?: string;
  /** Amount invoiced to customer */
  invoiced?: number;
  items?: DomainOfferItemDTO[];
  location?: string;
  /** Order phase execution fields (used when phase = "order" or "completed") */
  managerId?: string;
  managerName?: string;
  /** Calculated: Value - Cost */
  margin?: number;
  /** Dekningsgrad: (Value - Cost) / Value * 100 */
  marginPercent?: number;
  notes?: string;
  /** Internal number, e.g., "TK-2025-001" */
  offerNumber?: string;
  /** Generated column: value - invoiced (read-only) */
  orderReserve?: number;
  phase?: DomainOfferPhase;
  probability?: number;
  /** Link to project (nullable) */
  projectId?: string;
  projectName?: string;
  responsibleUserId?: string;
  responsibleUserName?: string;
  /** ISO 8601 */
  sentDate?: string;
  /** Actual costs incurred */
  spent?: number;
  /** ISO 8601 - When work started */
  startDate?: string;
  status?: DomainOfferStatus;
  teamMembers?: string[];
  title?: string;
  /** ISO 8601 */
  updatedAt?: string;
  updatedById?: string;
  updatedByName?: string;
  value?: number;
}

export interface DomainOfferExternalSyncResponse {
  companyId?: DomainCompanyID;
  dataWarehouse?: DomainDataWarehouseFinancialsDTO;
  /** Persisted DW employee costs */
  dwEmployeeCosts?: number;
  /** Persisted DW material costs */
  dwMaterialCosts?: number;
  /** Persisted DW net result */
  dwNetResult?: number;
  /** Persisted DW other costs */
  dwOtherCosts?: number;
  /** Current offer financial values after sync */
  dwTotalIncome?: number;
  externalReference?: string;
  /** Updated if was 0, otherwise unchanged */
  invoiced?: number;
  offerId?: string;
  /** Whether data was persisted to the offer */
  persisted?: boolean;
  /** Updated if was 0, otherwise unchanged */
  spent?: number;
  /** ISO 8601 - When the sync was performed */
  syncedAt?: string;
}

export interface DomainOfferItemDTO {
  cost?: number;
  description?: string;
  discipline?: string;
  id?: string;
  margin?: number;
  quantity?: number;
  revenue?: number;
  unit?: string;
}

export interface DomainOfferSupplierDTO {
  createdAt?: string;
  id?: string;
  notes?: string;
  offerId?: string;
  offerTitle?: string;
  status?: DomainOfferSupplierStatus;
  supplierId?: string;
  supplierName?: string;
  updatedAt?: string;
}

export interface DomainOfferSupplierWithDetailsDTO {
  contact?: DomainSupplierContactDTO;
  /** Contact person for this offer (optional) */
  contactId?: string;
  contactName?: string;
  createdAt?: string;
  /** Relationship fields */
  id?: string;
  notes?: string;
  offerId?: string;
  status?: DomainOfferSupplierStatus;
  /** Supplier details */
  supplier?: DomainSupplierDTO;
  updatedAt?: string;
}

export interface DomainOfferWithItemsDTO {
  companyId?: DomainCompanyID;
  createdAt?: string;
  /** Optional - offer can exist without customer */
  customerId?: string;
  customerName?: string;
  description?: string;
  /** External/customer reference number */
  externalReference?: string;
  id?: string;
  items?: DomainOfferItemDTO[];
  notes?: string;
  /** Internal number, e.g., "TK-2025-001" */
  offerNumber?: string;
  phase?: DomainOfferPhase;
  probability?: number;
  responsibleUserId?: string;
  responsibleUserName?: string;
  status?: DomainOfferStatus;
  title?: string;
  updatedAt?: string;
  value?: number;
}

export interface DomainPaginatedResponse {
  data?: any;
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
}

export interface DomainPermissionDTO {
  action?: string;
  allowed?: boolean;
  resource?: string;
}

export interface DomainPermissionsResponseDTO {
  isSuperAdmin?: boolean;
  permissions?: DomainPermissionDTO[];
  roles?: string[];
}

export interface DomainPipelineAnalyticsDTO {
  conversionRates?: DomainConversionRateDTO[];
  forecast30Days?: DomainRevenueForecastDTO;
  forecast90Days?: DomainRevenueForecastDTO;
  generatedAt?: string;
  summary?: DomainStageSummaryDTO[];
  winRateAnalysis?: DomainWinRateAnalysisDTO;
}

export interface DomainPipelinePhaseData {
  /** Total offer count in this phase */
  count?: number;
  offers?: DomainOfferDTO[];
  phase?: DomainOfferPhase;
  /** Unique projects in this phase (excludes orphan offers) */
  projectCount?: number;
  /** Sum of best offer value per project (avoids double-counting) */
  totalValue?: number;
  /** Weighted by probability */
  weightedValue?: number;
}

export interface DomainProjectDTO {
  /** ISO 8601 */
  createdAt?: string;
  /** User tracking fields */
  createdById?: string;
  createdByName?: string;
  /** Optional - projects can be cross-company */
  customerId?: string;
  customerName?: string;
  dealId?: string;
  description?: string;
  /** ISO 8601 */
  endDate?: string;
  externalReference?: string;
  /** Count of files attached to this project */
  fileCount?: number;
  id?: string;
  location?: string;
  name?: string;
  /** Count of offers linked to this project */
  offerCount?: number;
  phase?: DomainProjectPhase;
  projectNumber?: string;
  /** ISO 8601 */
  startDate?: string;
  summary?: string;
  /** ISO 8601 */
  updatedAt?: string;
  updatedById?: string;
  updatedByName?: string;
}

export interface DomainProjectWithDetailsDTO {
  budgetSummary?: DomainBudgetSummaryDTO;
  /** ISO 8601 */
  createdAt?: string;
  /** User tracking fields */
  createdById?: string;
  createdByName?: string;
  /** Optional - projects can be cross-company */
  customerId?: string;
  customerName?: string;
  deal?: DomainDealDTO;
  dealId?: string;
  description?: string;
  /** ISO 8601 */
  endDate?: string;
  externalReference?: string;
  /** Count of files attached to this project */
  fileCount?: number;
  id?: string;
  location?: string;
  name?: string;
  offer?: DomainOfferDTO;
  /** Count of offers linked to this project */
  offerCount?: number;
  phase?: DomainProjectPhase;
  projectNumber?: string;
  recentActivities?: DomainActivityDTO[];
  /** ISO 8601 */
  startDate?: string;
  summary?: string;
  /** ISO 8601 */
  updatedAt?: string;
  updatedById?: string;
  updatedByName?: string;
}

export interface DomainRejectOfferRequest {
  /** @maxLength 500 */
  reason?: string;
}

export interface DomainReopenProjectRequest {
  /** @maxLength 1000 */
  notes?: string;
  targetPhase: DomainReopenProjectRequestTargetPhaseEnum;
}

export interface DomainReopenProjectResponse {
  /** Whether WinningOfferID was cleared */
  clearedOfferId?: boolean;
  /** Whether economic values were cleared */
  clearedOfferValue?: boolean;
  previousPhase?: string;
  project?: DomainProjectDTO;
  /** Offer that was reverted to sent (if any) */
  revertedOffer?: DomainOfferDTO;
}

export interface DomainReorderBudgetItemsRequest {
  /** @minItems 1 */
  orderedIds: string[];
}

export interface DomainRevenueForecastDTO {
  dealCount?: number;
  /** "30d" or "90d" */
  period?: string;
  totalValue?: number;
  weightedValue?: number;
}

export interface DomainSearchResult {
  id?: string;
  metadata?: string;
  subtitle?: string;
  title?: string;
  type?: string;
}

export interface DomainStageSummaryDTO {
  avgDealValue?: number;
  avgProbability?: number;
  dealCount?: number;
  overdueCount?: number;
  stage?: string;
  totalValue?: number;
  weightedValue?: number;
}

export interface DomainSupplierContactDTO {
  createdAt?: string;
  email?: string;
  firstName?: string;
  fullName?: string;
  id?: string;
  isPrimary?: boolean;
  lastName?: string;
  notes?: string;
  phone?: string;
  supplierId?: string;
  title?: string;
  updatedAt?: string;
}

export interface DomainSupplierDTO {
  address?: string;
  category?: string;
  city?: string;
  contactEmail?: string;
  contactPerson?: string;
  contactPhone?: string;
  country?: string;
  county?: string;
  createdAt?: string;
  createdById?: string;
  createdByName?: string;
  email?: string;
  /** Count of files attached to this supplier */
  fileCount?: number;
  id?: string;
  municipality?: string;
  name?: string;
  notes?: string;
  orgNumber?: string;
  paymentTerms?: string;
  phone?: string;
  postalCode?: string;
  status?: DomainSupplierStatus;
  updatedAt?: string;
  updatedById?: string;
  updatedByName?: string;
  website?: string;
}

export interface DomainSupplierStatsDTO {
  activeOffers?: number;
  completedOffers?: number;
  totalOffers?: number;
  totalProjects?: number;
}

export interface DomainSupplierWithDetailsDTO {
  address?: string;
  category?: string;
  city?: string;
  contactEmail?: string;
  contactPerson?: string;
  contactPhone?: string;
  contacts?: DomainSupplierContactDTO[];
  country?: string;
  county?: string;
  createdAt?: string;
  createdById?: string;
  createdByName?: string;
  email?: string;
  /** Count of files attached to this supplier */
  fileCount?: number;
  id?: string;
  municipality?: string;
  name?: string;
  notes?: string;
  orgNumber?: string;
  paymentTerms?: string;
  phone?: string;
  postalCode?: string;
  recentOffers?: DomainOfferSupplierDTO[];
  stats?: DomainSupplierStatsDTO;
  status?: DomainSupplierStatus;
  updatedAt?: string;
  updatedById?: string;
  updatedByName?: string;
  website?: string;
}

export interface DomainTopCustomerDTO {
  id?: string;
  name?: string;
  orgNumber?: string;
  /** Count of offers in order or completed phases */
  wonOfferCount?: number;
  /** Total value of won offers (order + completed) */
  wonOfferValue?: number;
}

export interface DomainUnreadCountDTO {
  count?: number;
}

export interface DomainUpdateActivityRequest {
  /** @maxLength 100 */
  assignedToId?: string;
  attendees?: string[];
  /** @maxLength 2000 */
  body?: string;
  dueDate?: string;
  /** @min 1 */
  durationMinutes?: number;
  isPrivate?: boolean;
  /**
   * @min 0
   * @max 5
   */
  priority?: number;
  scheduledAt?: string;
  status?: DomainActivityStatus;
  /** @maxLength 200 */
  title: string;
}

export interface DomainUpdateBudgetItemRequest {
  description?: string;
  /** @min 0 */
  displayOrder?: number;
  /** @min 0 */
  expectedCost?: number;
  /**
   * @min 0
   * @max 100
   */
  expectedMargin?: number;
  /** @maxLength 200 */
  name: string;
  /** @min 0 */
  pricePerItem?: number;
  /** @min 0 */
  quantity?: number;
}

export interface DomainUpdateCompanyRequest {
  /** @maxLength 100 */
  defaultOfferResponsibleId?: string;
  /** @maxLength 100 */
  defaultProjectResponsibleId?: string;
}

export interface DomainUpdateContactRequest {
  /** @maxLength 500 */
  address?: string;
  /** @maxLength 100 */
  city?: string;
  contactType?: DomainContactType;
  /** @maxLength 100 */
  country?: string;
  /** @maxLength 100 */
  department?: string;
  /** @maxLength 255 */
  email?: string;
  /** @maxLength 100 */
  firstName: string;
  isActive?: boolean;
  /** @maxLength 100 */
  lastName: string;
  /** @maxLength 500 */
  linkedInUrl?: string;
  /** @maxLength 50 */
  mobile?: string;
  notes?: string;
  /** @maxLength 50 */
  phone?: string;
  /** @maxLength 20 */
  postalCode?: string;
  /** @maxLength 50 */
  preferredContactMethod?: string;
  primaryCustomerId?: string;
  /** @maxLength 100 */
  title?: string;
}

export interface DomainUpdateCustomerAddressRequest {
  /** @maxLength 500 */
  address?: string;
  /** @maxLength 100 */
  city?: string;
  /** @maxLength 100 */
  country?: string;
  /** @maxLength 20 */
  postalCode?: string;
}

export interface DomainUpdateCustomerCityRequest {
  /** @maxLength 100 */
  city?: string;
}

export interface DomainUpdateCustomerClassRequest {
  /** @maxLength 50 */
  customerClass?: string;
}

export interface DomainUpdateCustomerCompanyRequest {
  /** nullable to allow unassignment */
  companyId?: DomainCompanyID;
}

export interface DomainUpdateCustomerContactInfoRequest {
  contactEmail?: string;
  /** @maxLength 200 */
  contactPerson?: string;
  /** @maxLength 50 */
  contactPhone?: string;
}

export interface DomainUpdateCustomerCreditLimitRequest {
  /** nullable to allow clearing */
  creditLimit?: number;
}

export interface DomainUpdateCustomerIndustryRequest {
  industry?: DomainUpdateCustomerIndustryRequestIndustryEnum;
}

export interface DomainUpdateCustomerIsInternalRequest {
  isInternal?: boolean;
}

export interface DomainUpdateCustomerNotesRequest {
  notes?: string;
}

export interface DomainUpdateCustomerPostalCodeRequest {
  /** @maxLength 20 */
  postalCode?: string;
}

export interface DomainUpdateCustomerRequest {
  /** @maxLength 500 */
  address?: string;
  /** @maxLength 100 */
  city?: string;
  contactEmail?: string;
  /** @maxLength 200 */
  contactPerson?: string;
  /** @maxLength 50 */
  contactPhone?: string;
  /** @maxLength 100 */
  country?: string;
  /** @maxLength 100 */
  county?: string;
  creditLimit?: number;
  /** @maxLength 50 */
  customerClass?: string;
  email?: string;
  industry?: DomainCustomerIndustry;
  /** @maxLength 100 */
  municipality?: string;
  /** @maxLength 200 */
  name?: string;
  notes?: string;
  /** @maxLength 50 */
  phone?: string;
  /** @maxLength 20 */
  postalCode?: string;
  status?: DomainCustomerStatus;
  tier?: DomainCustomerTier;
  /** @maxLength 500 */
  website?: string;
}

export interface DomainUpdateCustomerStatusRequest {
  status: DomainUpdateCustomerStatusRequestStatusEnum;
}

export interface DomainUpdateCustomerTierRequest {
  tier: DomainUpdateCustomerTierRequestTierEnum;
}

export interface DomainUpdateCustomerWebsiteRequest {
  /** @maxLength 500 */
  website?: string;
}

export interface DomainUpdateDealRequest {
  actualCloseDate?: string;
  /** @maxLength 3 */
  currency?: string;
  description?: string;
  expectedCloseDate?: string;
  /** @maxLength 500 */
  lostReason?: string;
  notes?: string;
  /** @maxLength 100 */
  ownerId?: string;
  /**
   * @min 0
   * @max 100
   */
  probability?: number;
  /** @maxLength 100 */
  source?: string;
  stage?: DomainDealStage;
  /** @maxLength 200 */
  title: string;
  /** @min 0 */
  value?: number;
}

export interface DomainUpdateDealStageRequest {
  notes?: string;
  stage: DomainDealStage;
}

export interface DomainUpdateOfferCostRequest {
  /** @min 0 */
  cost: number;
}

export interface DomainUpdateOfferCustomerHasWonProjectRequest {
  customerHasWonProject?: boolean;
}

export interface DomainUpdateOfferCustomerRequest {
  customerId: string;
}

export interface DomainUpdateOfferDescriptionRequest {
  /** @maxLength 10000 */
  description?: string;
}

export interface DomainUpdateOfferDueDateRequest {
  /** nullable to allow clearing */
  dueDate?: string;
}

export interface DomainUpdateOfferEndDateRequest {
  /** nullable to allow clearing */
  endDate?: string;
}

export interface DomainUpdateOfferExpirationDateRequest {
  /** nullable to allow clearing (though not recommended) */
  expirationDate?: string;
}

export interface DomainUpdateOfferExternalReferenceRequest {
  /** @maxLength 100 */
  externalReference?: string;
}

export interface DomainUpdateOfferHealthRequest {
  /**
   * Optional completion percentage (0-100)
   * @min 0
   * @max 100
   */
  completionPercent?: number;
  /** Health status enum */
  health: DomainUpdateOfferHealthRequestHealthEnum;
}

export interface DomainUpdateOfferInvoicedRequest {
  /**
   * Amount invoiced to customer
   * @min 0
   */
  invoiced?: number;
}

export interface DomainUpdateOfferNotesRequest {
  /** @maxLength 10000 */
  notes?: string;
}

export interface DomainUpdateOfferNumberRequest {
  /** @maxLength 50 */
  offerNumber: string;
}

export interface DomainUpdateOfferProbabilityRequest {
  /**
   * @min 0
   * @max 100
   */
  probability: number;
}

export interface DomainUpdateOfferProjectRequest {
  projectId: string;
}

export interface DomainUpdateOfferRequest {
  /** @min 0 */
  cost?: number;
  description?: string;
  dueDate?: string;
  /** Optional, defaults to 60 days after sent date */
  expirationDate?: string;
  /** @maxLength 200 */
  location?: string;
  notes?: string;
  phase: DomainOfferPhase;
  /**
   * @min 0
   * @max 100
   */
  probability?: number;
  responsibleUserId: string;
  sentDate?: string;
  status: DomainOfferStatus;
  /** @maxLength 200 */
  title: string;
}

export interface DomainUpdateOfferResponsibleRequest {
  /** @maxLength 100 */
  responsibleUserId: string;
}

export interface DomainUpdateOfferSentDateRequest {
  /** nullable to allow clearing */
  sentDate?: string;
}

export interface DomainUpdateOfferSpentRequest {
  /**
   * Amount spent on this order
   * @min 0
   */
  spent?: number;
}

export interface DomainUpdateOfferStartDateRequest {
  /** nullable to allow clearing */
  startDate?: string;
}

export interface DomainUpdateOfferSupplierContactRequest {
  contactId?: string;
}

export interface DomainUpdateOfferSupplierNotesRequest {
  notes?: string;
}

export interface DomainUpdateOfferSupplierRequest {
  contactId?: string;
  notes?: string;
  status?: DomainOfferSupplierStatus;
}

export interface DomainUpdateOfferSupplierStatusRequest {
  status: DomainUpdateOfferSupplierStatusRequestStatusEnum;
}

export interface DomainUpdateOfferTitleRequest {
  /** @maxLength 200 */
  title: string;
}

export interface DomainUpdateOfferValueRequest {
  /** @min 0 */
  value: number;
}

export interface DomainUpdateProjectDatesRequest {
  endDate?: string;
  startDate?: string;
}

export interface DomainUpdateProjectDescriptionRequest {
  description?: string;
  /** @maxLength 500 */
  summary?: string;
}

export interface DomainUpdateProjectNameRequest {
  /**
   * @minLength 1
   * @maxLength 200
   */
  name: string;
}

export interface DomainUpdateProjectNumberRequest {
  /** @maxLength 50 */
  projectNumber?: string;
}

export interface DomainUpdateProjectPhaseRequest {
  phase: DomainUpdateProjectPhaseRequestPhaseEnum;
}

export interface DomainUpdateProjectRequest {
  /** Optional - can update customer assignment */
  customerId?: string;
  dealId?: string;
  description?: string;
  endDate?: string;
  /** @maxLength 100 */
  externalReference?: string;
  /** @maxLength 200 */
  location?: string;
  /** @maxLength 200 */
  name: string;
  phase?: DomainUpdateProjectRequestPhaseEnum;
  /** @maxLength 50 */
  projectNumber?: string;
  startDate?: string;
  summary?: string;
}

export interface DomainUpdateSupplierAddressRequest {
  /** @maxLength 500 */
  address?: string;
}

export interface DomainUpdateSupplierCategoryRequest {
  /** @maxLength 200 */
  category?: string;
}

export interface DomainUpdateSupplierCityRequest {
  /** @maxLength 100 */
  city?: string;
}

export interface DomainUpdateSupplierContactRequest {
  email?: string;
  /** @maxLength 100 */
  firstName: string;
  isPrimary?: boolean;
  /** @maxLength 100 */
  lastName: string;
  notes?: string;
  /** @maxLength 50 */
  phone?: string;
  /** @maxLength 200 */
  title?: string;
}

export interface DomainUpdateSupplierEmailRequest {
  email?: string;
}

export interface DomainUpdateSupplierNotesRequest {
  notes?: string;
}

export interface DomainUpdateSupplierPaymentTermsRequest {
  /** @maxLength 200 */
  paymentTerms?: string;
}

export interface DomainUpdateSupplierPhoneRequest {
  /** @maxLength 50 */
  phone?: string;
}

export interface DomainUpdateSupplierPostalCodeRequest {
  /** @maxLength 20 */
  postalCode?: string;
}

export interface DomainUpdateSupplierRequest {
  /** @maxLength 500 */
  address?: string;
  /** @maxLength 200 */
  category?: string;
  /** @maxLength 100 */
  city?: string;
  contactEmail?: string;
  /** @maxLength 200 */
  contactPerson?: string;
  /** @maxLength 50 */
  contactPhone?: string;
  /** @maxLength 100 */
  country?: string;
  /** @maxLength 100 */
  county?: string;
  email?: string;
  /** @maxLength 100 */
  municipality?: string;
  /** @maxLength 200 */
  name?: string;
  notes?: string;
  /** @maxLength 200 */
  paymentTerms?: string;
  /** @maxLength 50 */
  phone?: string;
  /** @maxLength 20 */
  postalCode?: string;
  status?: DomainSupplierStatus;
  /** @maxLength 500 */
  website?: string;
}

export interface DomainUpdateSupplierStatusRequest {
  status: DomainUpdateSupplierStatusRequestStatusEnum;
}

export interface DomainUpdateSupplierWebsiteRequest {
  /** @maxLength 500 */
  website?: string;
}

export interface DomainUserDTO {
  avatar?: string;
  department?: string;
  email?: string;
  id?: string;
  name?: string;
  roles?: string[];
}

export interface DomainWinOfferRequest {
  /**
   * Notes is an optional note about why this offer was selected
   * @maxLength 500
   */
  notes?: string;
}

export interface DomainWinOfferResponse {
  /** Count of sibling offers that were expired */
  expiredCount?: number;
  /** Sibling offers that were expired */
  expiredOffers?: DomainOfferDTO[];
  offer?: DomainOfferDTO;
  project?: DomainProjectDTO;
}

export interface DomainWinRateAnalysisDTO {
  avgDaysToClose?: number;
  avgLostDealValue?: number;
  avgWonDealValue?: number;
  lostValue?: number;
  totalClosed?: number;
  totalLost?: number;
  totalWon?: number;
  winRate?: number;
  wonValue?: number;
}

export interface DomainWinRateMetrics {
  /** won_value / (won_value + lost_value), 0-1 scale */
  economicWinRate?: number;
  lostCount?: number;
  lostValue?: number;
  /** won_count / (won_count + lost_count), 0-1 scale */
  winRate?: number;
  wonCount?: number;
  wonValue?: number;
}

export interface HandlerAuditLogDTO {
  action?: string;
  changes?: Record<string, any>;
  companyId?: string;
  entityId?: string;
  entityName?: string;
  entityType?: string;
  id?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
  newValues?: Record<string, any>;
  oldValues?: Record<string, any>;
  performedAt?: string;
  requestId?: string;
  userAgent?: string;
  userEmail?: string;
  userId?: string;
  userName?: string;
}

export interface HandlerAuditLogListResponse {
  data?: HandlerAuditLogDTO[];
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
}

export interface HandlerAuditStatsResponse {
  actionCounts?: Record<string, number>;
  endTime?: string;
  startTime?: string;
}

export interface HandlerDealWithHistoryResponse {
  deal?: DomainDealDTO;
  stageHistory?: DomainDealStageHistoryDTO[];
}

export interface HandlerWinDealResponse {
  deal?: DomainDealDTO;
  project?: DomainProjectDTO;
}

export interface RepositoryForecastPeriod {
  /** @format int64 */
  dealCount?: number;
  periodEnd?: string;
  periodStart?: string;
  /** @format float64 */
  totalValue?: number;
  /** @format float64 */
  weightedValue?: number;
}

export interface RepositoryPipelineStats {
  byStage?: Record<string, RepositoryStageStats>;
  /** @format int64 */
  totalCount?: number;
  /** @format float64 */
  totalValue?: number;
  /** @format float64 */
  weightedValue?: number;
}

export interface RepositoryStageStats {
  /** @format int64 */
  count?: number;
  /** @format float64 */
  totalValue?: number;
  /** @format float64 */
  weightedValue?: number;
}

/** Updated phases */
export enum DomainCreateProjectRequestPhaseEnum {
  Tilbud = "tilbud",
  Working = "working",
  OnHold = "on_hold",
  Completed = "completed",
  Cancelled = "cancelled",
}

/** @example "competitor" */
export enum DomainLoseDealRequestReasonEnum {
  Price = "price",
  Timing = "timing",
  Competitor = "competitor",
  Requirements = "requirements",
  Other = "other",
}

export enum DomainReopenProjectRequestTargetPhaseEnum {
  Tilbud = "tilbud",
  Working = "working",
}

export enum DomainUpdateCustomerIndustryRequestIndustryEnum {
  Construction = "construction",
  Manufacturing = "manufacturing",
  Retail = "retail",
  Logistics = "logistics",
  Agriculture = "agriculture",
  Energy = "energy",
  PublicSector = "public_sector",
  RealEstate = "real_estate",
  Other = "other",
}

export enum DomainUpdateCustomerStatusRequestStatusEnum {
  Active = "active",
  Inactive = "inactive",
  Lead = "lead",
  Churned = "churned",
}

export enum DomainUpdateCustomerTierRequestTierEnum {
  Bronze = "bronze",
  Silver = "silver",
  Gold = "gold",
  Platinum = "platinum",
}

/** Health status enum */
export enum DomainUpdateOfferHealthRequestHealthEnum {
  OnTrack = "on_track",
  AtRisk = "at_risk",
  Delayed = "delayed",
  OverBudget = "over_budget",
}

export enum DomainUpdateOfferSupplierStatusRequestStatusEnum {
  Active = "active",
  Done = "done",
}

export enum DomainUpdateProjectPhaseRequestPhaseEnum {
  Tilbud = "tilbud",
  Working = "working",
  OnHold = "on_hold",
  Completed = "completed",
  Cancelled = "cancelled",
}

export enum DomainUpdateProjectRequestPhaseEnum {
  Tilbud = "tilbud",
  Working = "working",
  OnHold = "on_hold",
  Completed = "completed",
  Cancelled = "cancelled",
}

export enum DomainUpdateSupplierStatusRequestStatusEnum {
  Active = "active",
  Inactive = "inactive",
  Pending = "pending",
  Blacklisted = "blacklisted",
}

export interface ActivitiesListParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page (max 200)
   * @default 20
   */
  pageSize?: number;
  /** Filter by activity type (meeting, task, call, email, note) */
  type?: string;
  /** Filter by status (planned, in_progress, completed, cancelled) */
  status?: string;
  /** Filter by target type (customer, project, offer, deal) */
  targetType?: string;
  /**
   * Filter by target entity ID
   * @format uuid
   */
  targetId?: string;
  /** Filter by assigned user ID */
  assignedTo?: string;
  /** Filter activities from this date (YYYY-MM-DD), inclusive from 00:00:00 */
  from?: string;
  /** Filter activities to this date (YYYY-MM-DD), inclusive until 23:59:59 */
  to?: string;
}

export interface MyTasksListParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page (max 200)
   * @default 20
   */
  pageSize?: number;
}

export interface UpcomingListParams {
  /**
   * Number of days to look ahead (1-90)
   * @default 7
   */
  daysAhead?: number;
  /**
   * Maximum number of activities to return (1-100)
   * @default 20
   */
  limit?: number;
}

export interface ActivitiesDetailParams {
  /**
   * Activity ID
   * @format uuid
   */
  id: string;
}

export interface ActivitiesUpdateParams {
  /**
   * Activity ID
   * @format uuid
   */
  id: string;
}

export interface ActivitiesDeleteParams {
  /**
   * Activity ID
   * @format uuid
   */
  id: string;
}

export interface AttendeesCreateParams {
  /**
   * Activity ID
   * @format uuid
   */
  id: string;
}

export interface AttendeesDeleteParams {
  /**
   * Activity ID
   * @format uuid
   */
  id: string;
  /** User ID to remove */
  userId: string;
}

export interface CompleteCreateParams {
  /**
   * Activity ID
   * @format uuid
   */
  id: string;
}

export interface FollowUpCreateParams {
  /**
   * Activity ID
   * @format uuid
   */
  id: string;
}

export interface AuditListParams {
  /** Page number (default: 1) */
  page?: number;
  /** Page size (default: 20, max: 100) */
  pageSize?: number;
  /** Filter by user ID */
  userId?: string;
  /** Filter by action type */
  action?: string;
  /** Filter by entity type */
  entityType?: string;
  /** Filter by entity ID */
  entityId?: string;
  /** Filter by start time (RFC3339) */
  startTime?: string;
  /** Filter by end time (RFC3339) */
  endTime?: string;
}

export interface EntityDetailParams {
  /** Maximum number of entries (default: 50) */
  limit?: number;
  /** Entity type (e.g., Customer, Project) */
  entityType: string;
  /** Entity ID */
  entityId: string;
}

export interface ExportListParams {
  /** Start time (RFC3339) */
  startTime: string;
  /** End time (RFC3339) */
  endTime: string;
}

export interface StatsListParams1 {
  /** Start time (RFC3339) */
  startTime: string;
  /** End time (RFC3339) */
  endTime: string;
}

export interface AuditDetailParams {
  /** Audit log ID */
  id: string;
}

export interface CompaniesDetailParams {
  /** Company ID (e.g., gruppen, stalbygg, hybridbygg, industri, tak, montasje) */
  id: string;
}

export interface CompaniesUpdateParams {
  /** Company ID (e.g., gruppen, stalbygg, hybridbygg, industri, tak, montasje) */
  id: string;
}

export interface ContactsListParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page
   * @default 20
   */
  pageSize?: number;
  /** Search by name or email */
  search?: string;
  /** Filter by job title */
  title?: string;
  /** Filter by contact type */
  contactType?: ContactTypeEnum;
  /** Filter by related entity type */
  entityType?: EntityTypeEnum;
  /** Filter by related entity ID */
  entityId?: string;
  /** Sort option */
  sortBy?: SortByEnum;
}

/** Filter by contact type */
export enum ContactTypeEnum {
  Primary = "primary",
  Secondary = "secondary",
  Billing = "billing",
  Technical = "technical",
  Executive = "executive",
  Other = "other",
}

/** Filter by related entity type */
export enum EntityTypeEnum {
  Customer = "customer",
  Deal = "deal",
  Project = "project",
}

/** Sort option */
export enum SortByEnum {
  NameAsc = "name_asc",
  NameDesc = "name_desc",
  EmailAsc = "email_asc",
  CreatedDesc = "created_desc",
}

/** Filter by contact type */
export enum ContactsListParams1ContactTypeEnum {
  Primary = "primary",
  Secondary = "secondary",
  Billing = "billing",
  Technical = "technical",
  Executive = "executive",
  Other = "other",
}

/** Filter by related entity type */
export enum ContactsListParams1EntityTypeEnum {
  Customer = "customer",
  Deal = "deal",
  Project = "project",
}

/** Sort option */
export enum ContactsListParams1SortByEnum {
  NameAsc = "name_asc",
  NameDesc = "name_desc",
  EmailAsc = "email_asc",
  CreatedDesc = "created_desc",
}

export interface ContactsDetailParams {
  /** Contact ID */
  id: string;
}

export interface ContactsUpdateParams {
  /** Contact ID */
  id: string;
}

export interface ContactsDeleteParams {
  /** Contact ID */
  id: string;
}

export interface RelationshipsCreateParams {
  /** Contact ID */
  id: string;
}

export interface RelationshipsDeleteParams {
  /** Contact ID */
  id: string;
  /** Relationship ID */
  relationshipId: string;
}

export interface CustomersListParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page (max 200)
   * @default 20
   */
  pageSize?: number;
  /** Search by name or organization number */
  search?: string;
  /** Filter by city */
  city?: string;
  /** Filter by country */
  country?: string;
  /** Filter by status */
  status?: StatusEnum;
  /** Filter by tier */
  tier?: TierEnum;
  /** Filter by industry */
  industry?: IndustryEnum;
  /** Sort field */
  sortBy?: SortByEnum1;
  /**
   * Sort order
   * @default "desc"
   */
  sortOrder?: SortOrderEnum;
}

/** Filter by status */
export enum StatusEnum {
  Active = "active",
  Inactive = "inactive",
  Lead = "lead",
  Churned = "churned",
}

/** Filter by tier */
export enum TierEnum {
  Bronze = "bronze",
  Silver = "silver",
  Gold = "gold",
  Platinum = "platinum",
}

/** Filter by industry */
export enum IndustryEnum {
  Construction = "construction",
  Manufacturing = "manufacturing",
  Retail = "retail",
  Logistics = "logistics",
  Agriculture = "agriculture",
  Energy = "energy",
  PublicSector = "public_sector",
  RealEstate = "real_estate",
  Other = "other",
}

/** Sort field */
export enum SortByEnum1 {
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  Name = "name",
  City = "city",
  Country = "country",
  Status = "status",
  Tier = "tier",
  Industry = "industry",
  OrgNumber = "orgNumber",
}

/**
 * Sort order
 * @default "desc"
 */
export enum SortOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

/** Filter by status */
export enum CustomersListParams1StatusEnum {
  Active = "active",
  Inactive = "inactive",
  Lead = "lead",
  Churned = "churned",
}

/** Filter by tier */
export enum CustomersListParams1TierEnum {
  Bronze = "bronze",
  Silver = "silver",
  Gold = "gold",
  Platinum = "platinum",
}

/** Filter by industry */
export enum CustomersListParams1IndustryEnum {
  Construction = "construction",
  Manufacturing = "manufacturing",
  Retail = "retail",
  Logistics = "logistics",
  Agriculture = "agriculture",
  Energy = "energy",
  PublicSector = "public_sector",
  RealEstate = "real_estate",
  Other = "other",
}

/** Sort field */
export enum CustomersListParams1SortByEnum {
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  Name = "name",
  City = "city",
  Country = "country",
  Status = "status",
  Tier = "tier",
  Industry = "industry",
  OrgNumber = "orgNumber",
}

/**
 * Sort order
 * @default "desc"
 */
export enum CustomersListParams1SortOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface SearchListParams {
  /** Search query (e.g., 'AF', 'NTN', 'Veidikke', 'all' for all customers, or email like 'user@company.no') */
  q: string;
}

export interface CustomersDetailParams {
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

export interface CustomersUpdateParams {
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

export interface CustomersDeleteParams {
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

export interface AddressUpdateParams {
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

export interface CityUpdateParams {
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

export interface CompanyUpdateParams {
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

export interface ContactInfoUpdateParams {
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

export interface ContactsListParams2 {
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

export interface ContactsCreateParams1 {
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

export interface CreditLimitUpdateParams {
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

export interface CustomerClassUpdateParams {
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

export interface FilesListParams {
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

export interface FilesCreatePayload {
  /** File to upload */
  file: File;
}

export interface FilesCreateParams {
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

export interface IndustryUpdateParams {
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

export interface IsInternalUpdateParams {
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

export interface NotesUpdateParams {
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

export interface OffersListParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page (max 200)
   * @default 20
   */
  pageSize?: number;
  /** Filter by phase */
  phase?: PhaseEnum;
  /** Sort field */
  sortBy?: SortByEnum2;
  /**
   * Sort order
   * @default "desc"
   */
  sortOrder?: SortOrderEnum1;
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

/** Filter by phase */
export enum PhaseEnum {
  Draft = "draft",
  InProgress = "in_progress",
  Sent = "sent",
  Won = "won",
  Lost = "lost",
  Expired = "expired",
}

/** Sort field */
export enum SortByEnum2 {
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  Title = "title",
  Value = "value",
  Probability = "probability",
  Phase = "phase",
  Status = "status",
  DueDate = "dueDate",
  CustomerName = "customerName",
}

/**
 * Sort order
 * @default "desc"
 */
export enum SortOrderEnum1 {
  Asc = "asc",
  Desc = "desc",
}

/** Filter by phase */
export enum OffersListParams1PhaseEnum {
  Draft = "draft",
  InProgress = "in_progress",
  Sent = "sent",
  Won = "won",
  Lost = "lost",
  Expired = "expired",
}

/** Sort field */
export enum OffersListParams1SortByEnum {
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  Title = "title",
  Value = "value",
  Probability = "probability",
  Phase = "phase",
  Status = "status",
  DueDate = "dueDate",
  CustomerName = "customerName",
}

/**
 * Sort order
 * @default "desc"
 */
export enum OffersListParams1SortOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostalCodeUpdateParams {
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

export interface ProjectsListParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page (max 200)
   * @default 20
   */
  pageSize?: number;
  /** Filter by phase */
  phase?: PhaseEnum1;
  /** Sort field */
  sortBy?: SortByEnum3;
  /**
   * Sort order
   * @default "desc"
   */
  sortOrder?: SortOrderEnum2;
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

/** Filter by phase */
export enum PhaseEnum1 {
  Tilbud = "tilbud",
  Active = "active",
  Working = "working",
  Completed = "completed",
  Cancelled = "cancelled",
}

/** Sort field */
export enum SortByEnum3 {
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  Name = "name",
  Phase = "phase",
  Health = "health",
  Budget = "budget",
  Spent = "spent",
  StartDate = "startDate",
  EndDate = "endDate",
  CustomerName = "customerName",
  WonAt = "wonAt",
}

/**
 * Sort order
 * @default "desc"
 */
export enum SortOrderEnum2 {
  Asc = "asc",
  Desc = "desc",
}

/** Filter by phase */
export enum ProjectsListParams1PhaseEnum {
  Tilbud = "tilbud",
  Active = "active",
  Working = "working",
  Completed = "completed",
  Cancelled = "cancelled",
}

/** Sort field */
export enum ProjectsListParams1SortByEnum {
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  Name = "name",
  Phase = "phase",
  Health = "health",
  Budget = "budget",
  Spent = "spent",
  StartDate = "startDate",
  EndDate = "endDate",
  CustomerName = "customerName",
  WonAt = "wonAt",
}

/**
 * Sort order
 * @default "desc"
 */
export enum ProjectsListParams1SortOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface StatusUpdateParams {
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

export interface TierUpdateParams {
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

export interface WebsiteUpdateParams {
  /**
   * Customer ID
   * @format uuid
   */
  id: string;
}

export interface MetricsListParams {
  /**
   * Time range for metrics (ignored if fromDate/toDate provided)
   * @default "rolling12months"
   */
  timeRange?: TimeRangeEnum;
  /** Start date for custom range (YYYY-MM-DD format, 00:00:00) */
  fromDate?: string;
  /** End date for custom range (YYYY-MM-DD format, 23:59:59) */
  toDate?: string;
}

/**
 * Time range for metrics (ignored if fromDate/toDate provided)
 * @default "rolling12months"
 */
export enum TimeRangeEnum {
  Rolling12Months = "rolling12months",
  AllTime = "allTime",
}

/**
 * Time range for metrics (ignored if fromDate/toDate provided)
 * @default "rolling12months"
 */
export enum MetricsListParams1TimeRangeEnum {
  Rolling12Months = "rolling12months",
  AllTime = "allTime",
}

export interface DealsListParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Page size
   * @default 20
   */
  pageSize?: number;
  /** Filter by stage (lead, qualified, proposal, negotiation, won, lost) */
  stage?: string;
  /** Filter by owner ID */
  ownerId?: string;
  /** Filter by customer ID */
  customerId?: string;
  /** Filter by company ID */
  companyId?: string;
  /** Filter by source */
  source?: string;
  /** Minimum value */
  minValue?: number;
  /** Maximum value */
  maxValue?: number;
  /** Created after date (YYYY-MM-DD) */
  createdAfter?: string;
  /** Created before date (YYYY-MM-DD) */
  createdBefore?: string;
  /** Expected close after date (YYYY-MM-DD) */
  closeAfter?: string;
  /** Expected close before date (YYYY-MM-DD) */
  closeBefore?: string;
  /** Sort by (created_desc, created_asc, value_desc, value_asc, probability_desc, probability_asc, close_date_desc, close_date_asc, weighted_desc, weighted_asc) */
  sort?: string;
}

export interface AnalyticsListParams {
  /** Filter by company ID */
  companyId?: string;
  /** Filter by owner ID */
  ownerId?: string;
  /** Filter by date from (YYYY-MM-DD) */
  dateFrom?: string;
  /** Filter by date to (YYYY-MM-DD) */
  dateTo?: string;
}

export interface ForecastListParams {
  /**
   * Number of months to forecast
   * @default 3
   */
  months?: number;
}

export interface DealsDetailParams {
  /** Deal ID */
  id: string;
}

export interface DealsUpdateParams {
  /** Deal ID */
  id: string;
}

export interface DealsDeleteParams {
  /** Deal ID */
  id: string;
}

export interface ActivitiesListParams2 {
  /**
   * Limit results
   * @default 50
   */
  limit?: number;
  /** Deal ID */
  id: string;
}

export interface AdvanceCreateParams {
  /** Deal ID */
  id: string;
}

export interface CreateOfferCreateParams {
  /** Deal ID */
  id: string;
}

export interface HistoryListParams {
  /** Deal ID */
  id: string;
}

export interface LoseCreateParams {
  /** Deal ID */
  id: string;
}

export interface ReopenCreateParams {
  /** Deal ID */
  id: string;
}

export interface PostDealsParams {
  /**
   * Create a project from the deal
   * @default true
   */
  createProject?: boolean;
  /** Deal ID */
  id: string;
}

export interface FilesDetailParams {
  /**
   * File ID
   * @format uuid
   */
  id: string;
}

export interface FilesDeleteParams {
  /**
   * File ID
   * @format uuid
   */
  id: string;
}

export interface DownloadListParams {
  /**
   * File ID
   * @format uuid
   */
  id: string;
}

export interface InquiriesListParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Page size
   * @default 20
   */
  pageSize?: number;
  /** Filter by customer ID */
  customerId?: string;
}

export interface InquiriesDetailParams {
  /** Inquiry ID */
  id: string;
}

export interface InquiriesDeleteParams {
  /** Inquiry ID */
  id: string;
}

export interface ConvertCreateParams {
  /** Inquiry ID */
  id: string;
}

export interface NotificationsListParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page (max 200)
   * @default 20
   */
  pageSize?: number;
  /**
   * Filter to show only unread notifications
   * @default false
   */
  unreadOnly?: boolean;
  /** Filter by notification type */
  type?: TypeEnum;
}

/** Filter by notification type */
export enum TypeEnum {
  TaskAssigned = "task_assigned",
  BudgetAlert = "budget_alert",
  DealStageChanged = "deal_stage_changed",
  OfferAccepted = "offer_accepted",
  OfferRejected = "offer_rejected",
  ActivityReminder = "activity_reminder",
  ProjectUpdate = "project_update",
}

/** Filter by notification type */
export enum NotificationsListParams1TypeEnum {
  TaskAssigned = "task_assigned",
  BudgetAlert = "budget_alert",
  DealStageChanged = "deal_stage_changed",
  OfferAccepted = "offer_accepted",
  OfferRejected = "offer_rejected",
  ActivityReminder = "activity_reminder",
  ProjectUpdate = "project_update",
}

export interface NotificationsDetailParams {
  /**
   * Notification ID
   * @format uuid
   */
  id: string;
}

export interface ReadUpdateParams {
  /**
   * Notification ID
   * @format uuid
   */
  id: string;
}

export interface OffersListParams2 {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Page size
   * @default 20
   */
  pageSize?: number;
  /** Filter by customer ID */
  customerId?: string;
  /** Filter by project ID */
  projectId?: string;
  /** Filter by phase */
  phase?: string;
  /** Sort field */
  sortBy?: SortByEnum4;
  /**
   * Sort order
   * @default "desc"
   */
  sortOrder?: SortOrderEnum3;
}

/** Sort field */
export enum SortByEnum4 {
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  Title = "title",
  Value = "value",
  Probability = "probability",
  Phase = "phase",
  Status = "status",
  DueDate = "dueDate",
  CustomerName = "customerName",
}

/**
 * Sort order
 * @default "desc"
 */
export enum SortOrderEnum3 {
  Asc = "asc",
  Desc = "desc",
}

/** Sort field */
export enum OffersListParams3SortByEnum {
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  Title = "title",
  Value = "value",
  Probability = "probability",
  Phase = "phase",
  Status = "status",
  DueDate = "dueDate",
  CustomerName = "customerName",
}

/**
 * Sort order
 * @default "desc"
 */
export enum OffersListParams3SortOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface NextNumberListParams {
  /** Company ID */
  companyId: CompanyIdEnum;
}

/** Company ID */
export enum CompanyIdEnum {
  Gruppen = "gruppen",
  Stalbygg = "stalbygg",
  Hybridbygg = "hybridbygg",
  Industri = "industri",
  Tak = "tak",
  Montasje = "montasje",
}

/** Company ID */
export enum NextNumberListParams1CompanyIdEnum {
  Gruppen = "gruppen",
  Stalbygg = "stalbygg",
  Hybridbygg = "hybridbygg",
  Industri = "industri",
  Tak = "tak",
  Montasje = "montasje",
}

export interface OffersDetailParams {
  /** Offer ID */
  id: string;
}

export interface OffersUpdateParams {
  /** Offer ID */
  id: string;
}

export interface OffersDeleteParams {
  /** Offer ID */
  id: string;
}

export interface AcceptCreateParams {
  /** Offer ID */
  id: string;
}

export interface AcceptOrderCreateParams {
  /** Offer ID */
  id: string;
}

export interface ActivitiesListParams4 {
  /**
   * Limit
   * @default 50
   */
  limit?: number;
  /** Offer ID */
  id: string;
}

export interface AdvanceCreateParams2 {
  /** Offer ID */
  id: string;
}

export interface BudgetListParams {
  /** Offer ID */
  id: string;
}

export interface BudgetDimensionsListParams {
  /** Offer ID */
  id: string;
}

export interface BudgetDimensionsCreateParams {
  /** Offer ID */
  id: string;
}

export interface BudgetDimensionsUpdateParams {
  /** Offer ID */
  id: string;
  /** Budget Item ID */
  dimensionId: string;
}

export interface BudgetDimensionsDeleteParams {
  /** Offer ID */
  id: string;
  /** Budget Item ID */
  dimensionId: string;
}

export interface BudgetReorderUpdateParams {
  /** Offer ID */
  id: string;
}

export interface CloneCreateParams {
  /** Source Offer ID */
  id: string;
}

export interface CompleteCreateParams2 {
  /** Offer ID */
  id: string;
}

export interface CostUpdateParams {
  /** Offer ID */
  id: string;
}

export interface CustomerUpdateParams {
  /** Offer ID */
  id: string;
}

export interface CustomerHasWonProjectUpdateParams {
  /** Offer ID */
  id: string;
}

export interface DescriptionUpdateParams {
  /** Offer ID */
  id: string;
}

export interface DetailListParams {
  /** Offer ID */
  id: string;
}

export interface DueDateUpdateParams {
  /** Offer ID */
  id: string;
}

export interface EndDateUpdateParams {
  /** Offer ID */
  id: string;
}

export interface ExpirationDateUpdateParams {
  /** Offer ID */
  id: string;
}

export interface ExternalReferenceUpdateParams {
  /** Offer ID */
  id: string;
}

export interface ExternalSyncListParams {
  /** Offer ID */
  id: string;
}

export interface FilesList2Params {
  /**
   * Offer ID
   * @format uuid
   */
  id: string;
}

export interface FilesCreate2Payload {
  /** File to upload */
  file: File;
}

export interface FilesCreate2Params {
  /**
   * Offer ID
   * @format uuid
   */
  id: string;
}

export interface HealthUpdateParams {
  /** Offer ID */
  id: string;
}

export interface InvoicedUpdateParams {
  /** Offer ID */
  id: string;
}

export interface ItemsListParams {
  /** Offer ID */
  id: string;
}

export interface ItemsCreateParams {
  /** Offer ID */
  id: string;
}

export interface NotesUpdateParams2 {
  /** Offer ID */
  id: string;
}

export interface OfferNumberUpdateParams {
  /** Offer ID */
  id: string;
}

export interface ProbabilityUpdateParams {
  /** Offer ID */
  id: string;
}

export interface ProjectUpdateParams {
  /** Offer ID */
  id: string;
}

export interface ProjectDeleteParams {
  /** Offer ID */
  id: string;
}

export interface RecalculateCreateParams {
  /** Offer ID */
  id: string;
}

export interface RejectCreateParams {
  /** Offer ID */
  id: string;
}

export interface ReopenCreateParams2 {
  /** Offer ID */
  id: string;
}

export interface ResponsibleUpdateParams {
  /** Offer ID */
  id: string;
}

export interface SendCreateParams {
  /** Offer ID */
  id: string;
}

export interface SentDateUpdateParams {
  /** Offer ID */
  id: string;
}

export interface SpentUpdateParams {
  /** Offer ID */
  id: string;
}

export interface StartDateUpdateParams {
  /** Offer ID */
  id: string;
}

export interface SuppliersListParams {
  /** Offer ID */
  id: string;
}

export interface SuppliersCreateParams {
  /** Offer ID */
  id: string;
}

export interface SuppliersUpdateParams {
  /** Offer ID */
  id: string;
  /** Supplier ID */
  supplierId: string;
}

export interface SuppliersDeleteParams {
  /** Offer ID */
  id: string;
  /** Supplier ID */
  supplierId: string;
}

export interface SuppliersContactUpdateParams {
  /** Offer ID */
  id: string;
  /** Supplier ID */
  supplierId: string;
}

export interface SuppliersNotesUpdateParams {
  /** Offer ID */
  id: string;
  /** Supplier ID */
  supplierId: string;
}

export interface SuppliersStatusUpdateParams {
  /** Offer ID */
  id: string;
  /** Supplier ID */
  supplierId: string;
}

export interface TitleUpdateParams {
  /** Offer ID */
  id: string;
}

export interface ValueUpdateParams {
  /** Offer ID */
  id: string;
}

export interface PostOffersParams {
  /** Offer ID */
  id: string;
}

export interface SuppliersFilesListParams {
  /**
   * Offer ID
   * @format uuid
   */
  offerId: string;
  /**
   * Supplier ID
   * @format uuid
   */
  supplierId: string;
}

export interface SuppliersFilesCreatePayload {
  /** File to upload */
  file: File;
}

export interface SuppliersFilesCreateParams {
  /**
   * Offer ID
   * @format uuid
   */
  offerId: string;
  /**
   * Supplier ID
   * @format uuid
   */
  supplierId: string;
}

export interface ProjectsListParams2 {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page (max 200)
   * @default 20
   */
  pageSize?: number;
  /**
   * Filter by customer ID
   * @format uuid
   */
  customerId?: string;
  /** Filter by phase */
  phase?: PhaseEnum2;
  /** Sort field */
  sortBy?: SortByEnum5;
  /**
   * Sort order
   * @default "desc"
   */
  sortOrder?: SortOrderEnum4;
}

/** Filter by phase */
export enum PhaseEnum2 {
  Tilbud = "tilbud",
  Working = "working",
  OnHold = "on_hold",
  Completed = "completed",
  Cancelled = "cancelled",
}

/** Sort field */
export enum SortByEnum5 {
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  Name = "name",
  Phase = "phase",
  StartDate = "startDate",
  EndDate = "endDate",
  CustomerName = "customerName",
}

/**
 * Sort order
 * @default "desc"
 */
export enum SortOrderEnum4 {
  Asc = "asc",
  Desc = "desc",
}

/** Filter by phase */
export enum ProjectsListParams3PhaseEnum {
  Tilbud = "tilbud",
  Working = "working",
  OnHold = "on_hold",
  Completed = "completed",
  Cancelled = "cancelled",
}

/** Sort field */
export enum ProjectsListParams3SortByEnum {
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  Name = "name",
  Phase = "phase",
  StartDate = "startDate",
  EndDate = "endDate",
  CustomerName = "customerName",
}

/**
 * Sort order
 * @default "desc"
 */
export enum ProjectsListParams3SortOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface ProjectsDetailParams {
  /**
   * Project ID
   * @format uuid
   */
  id: string;
}

export interface ProjectsUpdateParams {
  /**
   * Project ID
   * @format uuid
   */
  id: string;
}

export interface ProjectsDeleteParams {
  /**
   * Project ID
   * @format uuid
   */
  id: string;
}

export interface ActivitiesListParams6 {
  /**
   * Limit
   * @max 200
   * @default 50
   */
  limit?: number;
  /**
   * Project ID
   * @format uuid
   */
  id: string;
}

export interface DatesUpdateParams {
  /**
   * Project ID
   * @format uuid
   */
  id: string;
}

export interface DescriptionUpdateParams2 {
  /**
   * Project ID
   * @format uuid
   */
  id: string;
}

export interface FilesList3Params {
  /**
   * Project ID
   * @format uuid
   */
  id: string;
}

export interface FilesCreate3Payload {
  /** File to upload */
  file: File;
}

export interface FilesCreate3Params {
  /**
   * Project ID
   * @format uuid
   */
  id: string;
}

export interface NameUpdateParams {
  /**
   * Project ID
   * @format uuid
   */
  id: string;
}

export interface OffersListParams4 {
  /**
   * Project ID
   * @format uuid
   */
  id: string;
}

export interface PhaseUpdateParams {
  /**
   * Project ID
   * @format uuid
   */
  id: string;
}

export interface ProjectNumberUpdateParams {
  /**
   * Project ID
   * @format uuid
   */
  id: string;
}

export interface ReopenCreateParams4 {
  /**
   * Project ID
   * @format uuid
   */
  id: string;
}

export interface SearchListParams2 {
  /** Search query */
  q: string;
}

export interface SuppliersListParams2 {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page (max 200)
   * @default 20
   */
  pageSize?: number;
  /** Search by name or organization number */
  search?: string;
  /** Filter by city */
  city?: string;
  /** Filter by country */
  country?: string;
  /** Filter by status */
  status?: StatusEnum1;
  /** Filter by category */
  category?: string;
  /** Sort field */
  sortBy?: SortByEnum6;
  /**
   * Sort order
   * @default "desc"
   */
  sortOrder?: SortOrderEnum5;
}

/** Filter by status */
export enum StatusEnum1 {
  Active = "active",
  Inactive = "inactive",
  Pending = "pending",
  Blacklisted = "blacklisted",
}

/** Sort field */
export enum SortByEnum6 {
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  Name = "name",
  City = "city",
  Country = "country",
  Status = "status",
  Category = "category",
  OrgNumber = "orgNumber",
}

/**
 * Sort order
 * @default "desc"
 */
export enum SortOrderEnum5 {
  Asc = "asc",
  Desc = "desc",
}

/** Filter by status */
export enum SuppliersListParams3StatusEnum {
  Active = "active",
  Inactive = "inactive",
  Pending = "pending",
  Blacklisted = "blacklisted",
}

/** Sort field */
export enum SuppliersListParams3SortByEnum {
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  Name = "name",
  City = "city",
  Country = "country",
  Status = "status",
  Category = "category",
  OrgNumber = "orgNumber",
}

/**
 * Sort order
 * @default "desc"
 */
export enum SuppliersListParams3SortOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface SuppliersDetailParams {
  /**
   * Supplier ID
   * @format uuid
   */
  id: string;
}

export interface SuppliersUpdateParams2 {
  /**
   * Supplier ID
   * @format uuid
   */
  id: string;
}

export interface SuppliersDeleteParams2 {
  /**
   * Supplier ID
   * @format uuid
   */
  id: string;
}

export interface AddressUpdateParams2 {
  /**
   * Supplier ID
   * @format uuid
   */
  id: string;
}

export interface CategoryUpdateParams {
  /**
   * Supplier ID
   * @format uuid
   */
  id: string;
}

export interface CityUpdateParams2 {
  /**
   * Supplier ID
   * @format uuid
   */
  id: string;
}

export interface ContactsListParams4 {
  /**
   * Supplier ID
   * @format uuid
   */
  id: string;
}

export interface ContactsCreateParams3 {
  /**
   * Supplier ID
   * @format uuid
   */
  id: string;
}

export interface ContactsDetailParams2 {
  /**
   * Supplier ID
   * @format uuid
   */
  id: string;
  /**
   * Contact ID
   * @format uuid
   */
  contactId: string;
}

export interface ContactsUpdateParams2 {
  /**
   * Supplier ID
   * @format uuid
   */
  id: string;
  /**
   * Contact ID
   * @format uuid
   */
  contactId: string;
}

export interface ContactsDeleteParams2 {
  /**
   * Supplier ID
   * @format uuid
   */
  id: string;
  /**
   * Contact ID
   * @format uuid
   */
  contactId: string;
}

export interface EmailUpdateParams {
  /**
   * Supplier ID
   * @format uuid
   */
  id: string;
}

export interface FilesList4Params {
  /**
   * Supplier ID
   * @format uuid
   */
  id: string;
}

export interface FilesCreate4Payload {
  /** File to upload */
  file: File;
}

export interface FilesCreate4Params {
  /**
   * Supplier ID
   * @format uuid
   */
  id: string;
}

export interface NotesUpdateParams4 {
  /**
   * Supplier ID
   * @format uuid
   */
  id: string;
}

export interface OffersListParams6 {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page (max 200)
   * @default 20
   */
  pageSize?: number;
  /** Filter by phase */
  phase?: PhaseEnum3;
  /** Sort field */
  sortBy?: SortByEnum7;
  /**
   * Sort order
   * @default "desc"
   */
  sortOrder?: SortOrderEnum6;
  /**
   * Supplier ID
   * @format uuid
   */
  id: string;
}

/** Filter by phase */
export enum PhaseEnum3 {
  Draft = "draft",
  InProgress = "in_progress",
  Sent = "sent",
  Order = "order",
  Completed = "completed",
  Won = "won",
  Lost = "lost",
  Expired = "expired",
}

/** Sort field */
export enum SortByEnum7 {
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  Title = "title",
  Value = "value",
  Probability = "probability",
  Phase = "phase",
  Status = "status",
  DueDate = "dueDate",
  CustomerName = "customerName",
}

/**
 * Sort order
 * @default "desc"
 */
export enum SortOrderEnum6 {
  Asc = "asc",
  Desc = "desc",
}

/** Filter by phase */
export enum OffersListParams7PhaseEnum {
  Draft = "draft",
  InProgress = "in_progress",
  Sent = "sent",
  Order = "order",
  Completed = "completed",
  Won = "won",
  Lost = "lost",
  Expired = "expired",
}

/** Sort field */
export enum OffersListParams7SortByEnum {
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  Title = "title",
  Value = "value",
  Probability = "probability",
  Phase = "phase",
  Status = "status",
  DueDate = "dueDate",
  CustomerName = "customerName",
}

/**
 * Sort order
 * @default "desc"
 */
export enum OffersListParams7SortOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PaymentTermsUpdateParams {
  /**
   * Supplier ID
   * @format uuid
   */
  id: string;
}

export interface PhoneUpdateParams {
  /**
   * Supplier ID
   * @format uuid
   */
  id: string;
}

export interface PostalCodeUpdateParams2 {
  /**
   * Supplier ID
   * @format uuid
   */
  id: string;
}

export interface StatusUpdateParams2 {
  /**
   * Supplier ID
   * @format uuid
   */
  id: string;
}

export interface WebsiteUpdateParams2 {
  /**
   * Supplier ID
   * @format uuid
   */
  id: string;
}

export interface ContactsList2Params {
  /** Entity type */
  entityType: EntityTypeEnum1;
  /** Entity ID */
  id: string;
}

/** Entity type */
export enum EntityTypeEnum1 {
  Customers = "customers",
  Deals = "deals",
  Projects = "projects",
}

/** Entity type */
export enum ContactsList2Params1EntityTypeEnum {
  Customers = "customers",
  Deals = "deals",
  Projects = "projects",
}

export enum ContactsList2Params1Enum {
  Customers = "customers",
  Deals = "deals",
  Projects = "projects",
}
