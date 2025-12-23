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

import {
  DomainAcceptOfferRequest,
  DomainAcceptOfferResponse,
  DomainAcceptOrderRequest,
  DomainAcceptOrderResponse,
  DomainActivityDTO,
  DomainAddOfferBudgetItemRequest,
  DomainAddOfferSupplierRequest,
  DomainAdvanceOfferRequest,
  DomainBudgetItemDTO,
  DomainCloneOfferRequest,
  DomainCreateOfferItemRequest,
  DomainCreateOfferRequest,
  DomainNextOfferNumberResponse,
  DomainOfferDTO,
  DomainOfferDetailDTO,
  DomainOfferExternalSyncResponse,
  DomainOfferItemDTO,
  DomainOfferSupplierWithDetailsDTO,
  DomainOfferWithItemsDTO,
  DomainPaginatedResponse,
  DomainRejectOfferRequest,
  DomainReorderBudgetItemsRequest,
  DomainUpdateBudgetItemRequest,
  DomainUpdateOfferCostRequest,
  DomainUpdateOfferCustomerHasWonProjectRequest,
  DomainUpdateOfferCustomerRequest,
  DomainUpdateOfferDescriptionRequest,
  DomainUpdateOfferDueDateRequest,
  DomainUpdateOfferEndDateRequest,
  DomainUpdateOfferExpirationDateRequest,
  DomainUpdateOfferExternalReferenceRequest,
  DomainUpdateOfferHealthRequest,
  DomainUpdateOfferInvoicedRequest,
  DomainUpdateOfferNotesRequest,
  DomainUpdateOfferNumberRequest,
  DomainUpdateOfferProbabilityRequest,
  DomainUpdateOfferProjectRequest,
  DomainUpdateOfferRequest,
  DomainUpdateOfferResponsibleRequest,
  DomainUpdateOfferSentDateRequest,
  DomainUpdateOfferSpentRequest,
  DomainUpdateOfferStartDateRequest,
  DomainUpdateOfferSupplierContactRequest,
  DomainUpdateOfferSupplierNotesRequest,
  DomainUpdateOfferSupplierRequest,
  DomainUpdateOfferSupplierStatusRequest,
  DomainUpdateOfferTitleRequest,
  DomainUpdateOfferValueRequest,
  DomainWinOfferRequest,
  DomainWinOfferResponse,
  NextNumberListParams1CompanyIdEnum,
  OffersListParams3SortByEnum,
  OffersListParams3SortOrderEnum,
} from "./data-contracts";

export namespace Offers {
  /**
   * No description
   * @tags Offers
   * @name OffersList
   * @summary List offers
   * @request GET:/offers
   * @secure
   * @response `200` `DomainPaginatedResponse` OK
   */
  export namespace OffersList {
    export type RequestParams = {};
    export type RequestQuery = {
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
      sortBy?: OffersListParams3SortByEnum;
      /**
       * Sort order
       * @default "desc"
       */
      sortOrder?: OffersListParams3SortOrderEnum;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainPaginatedResponse;
  }

  /**
   * @description Creates a new offer. Defaults to in_progress phase (use /inquiries for draft phase). Supports three scenarios for customer/project association: - customerId only: Creates offer with that customer, auto-creates project - projectId only: Inherits customer from the existing project - Both: Uses provided customer, links to specified project
   * @tags Offers
   * @name OffersCreate
   * @summary Create offer
   * @request POST:/offers
   * @secure
   * @response `201` `DomainOfferDTO` Created
   * @response `400` `DomainErrorResponse` Validation error (missing customerId/projectId, project has no customer, etc.)
   * @response `404` `DomainErrorResponse` Customer or project not found
   */
  export namespace OffersCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DomainCreateOfferRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Manually triggers a sync of ALL offers with external_reference from the data warehouse (regardless of phase). This is an admin-only endpoint for forcing a full sync outside of the scheduled cron job.
   * @tags Offers
   * @name AdminTriggerDwSyncCreate
   * @summary Trigger bulk data warehouse sync (Admin only)
   * @request POST:/offers/admin/trigger-dw-sync
   * @secure
   * @response `200` `Record<string,any>` Sync results with synced/failed counts
   * @response `403` `DomainErrorResponse` Forbidden - requires super admin
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace AdminTriggerDwSyncCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Record<string, any>;
  }

  /**
   * @description Returns a preview of what the next offer number would be for a company without consuming the sequence. Useful for UI display.
   * @tags Offers
   * @name NextNumberList
   * @summary Get next offer number preview
   * @request GET:/offers/next-number
   * @secure
   * @response `200` `DomainNextOfferNumberResponse` OK
   * @response `400` `DomainErrorResponse` Invalid or missing company ID
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace NextNumberList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Company ID */
      companyId: NextNumberListParams1CompanyIdEnum;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainNextOfferNumberResponse;
  }

  /**
   * No description
   * @tags Offers
   * @name OffersDetail
   * @summary Get offer
   * @request GET:/offers/{id}
   * @secure
   * @response `200` `DomainOfferWithItemsDTO` OK
   */
  export namespace OffersDetail {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferWithItemsDTO;
  }

  /**
   * No description
   * @tags Offers
   * @name OffersUpdate
   * @summary Update offer
   * @request PUT:/offers/{id}
   * @secure
   * @response `200` `DomainOfferDTO` OK
   */
  export namespace OffersUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Delete an offer by ID. Only offers in draft or in_progress phase can be deleted.
   * @tags Offers
   * @name OffersDelete
   * @summary Delete offer
   * @request DELETE:/offers/{id}
   * @secure
   * @response `204` `void` No Content
   * @response `400` `DomainErrorResponse` Invalid offer ID
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace OffersDelete {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Transitions an offer from sent phase to won phase. Optionally creates a project from the offer.
   * @tags Offers
   * @name AcceptCreate
   * @summary Accept offer
   * @request POST:/offers/{id}/accept
   * @secure
   * @response `200` `DomainAcceptOfferResponse` Accepted offer and optional project
   * @response `400` `DomainErrorResponse` Invalid offer ID, request body, or offer not in sent phase
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace AcceptCreate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainAcceptOfferRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainAcceptOfferResponse;
  }

  /**
   * @description Transitions a won offer to order phase, indicating work is beginning. This is used when a customer accepts a sent offer and work should start.
   * @tags Offers
   * @name AcceptOrderCreate
   * @summary Accept order
   * @request POST:/offers/{id}/accept-order
   * @secure
   * @response `200` `DomainAcceptOrderResponse` Offer transitioned to order phase
   * @response `400` `DomainErrorResponse` Invalid offer ID, request body, or offer not in valid phase
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace AcceptOrderCreate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainAcceptOrderRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainAcceptOrderResponse;
  }

  /**
   * No description
   * @tags Offers
   * @name ActivitiesList
   * @summary Get offer activities
   * @request GET:/offers/{id}/activities
   * @secure
   * @response `200` `(DomainActivityDTO)[]` OK
   */
  export namespace ActivitiesList {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {
      /**
       * Limit
       * @default 50
       */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainActivityDTO[];
  }

  /**
   * No description
   * @tags Offers
   * @name AdvanceCreate
   * @summary Advance offer phase
   * @request POST:/offers/{id}/advance
   * @secure
   * @response `200` `DomainOfferDTO` OK
   */
  export namespace AdvanceCreate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainAdvanceOfferRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Get budget summary and all budget items for an offer
   * @tags offers, budget
   * @name BudgetList
   * @summary Get offer budget with items
   * @request GET:/offers/{id}/budget
   * @secure
   * @response `200` `Record<string,any>` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  export namespace BudgetList {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Record<string, any>;
  }

  /**
   * @description Get all budget items belonging to a specific offer
   * @tags offers, budget
   * @name BudgetDimensionsList
   * @summary List budget items for an offer
   * @request GET:/offers/{id}/budget/dimensions
   * @secure
   * @response `200` `(DomainBudgetItemDTO)[]` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  export namespace BudgetDimensionsList {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainBudgetItemDTO[];
  }

  /**
   * @description Add a new budget item to a specific offer
   * @tags offers, budget
   * @name BudgetDimensionsCreate
   * @summary Add budget item to offer
   * @request POST:/offers/{id}/budget/dimensions
   * @secure
   * @response `201` `DomainBudgetItemDTO` Created
   * @response `400` `DomainAPIError` Bad Request
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  export namespace BudgetDimensionsCreate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainAddOfferBudgetItemRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainBudgetItemDTO;
  }

  /**
   * @description Update a budget item belonging to a specific offer
   * @tags offers, budget
   * @name BudgetDimensionsUpdate
   * @summary Update offer budget item
   * @request PUT:/offers/{id}/budget/dimensions/{dimensionId}
   * @secure
   * @response `200` `DomainBudgetItemDTO` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  export namespace BudgetDimensionsUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
      /** Budget Item ID */
      dimensionId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateBudgetItemRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainBudgetItemDTO;
  }

  /**
   * @description Delete a budget item from a specific offer
   * @tags offers, budget
   * @name BudgetDimensionsDelete
   * @summary Delete offer budget item
   * @request DELETE:/offers/{id}/budget/dimensions/{dimensionId}
   * @secure
   * @response `204` `void` No Content
   * @response `400` `DomainAPIError` Bad Request
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  export namespace BudgetDimensionsDelete {
    export type RequestParams = {
      /** Offer ID */
      id: string;
      /** Budget Item ID */
      dimensionId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Reorder budget items for a specific offer by providing ordered IDs
   * @tags offers, budget
   * @name BudgetReorderUpdate
   * @summary Reorder offer budget items
   * @request PUT:/offers/{id}/budget/reorder
   * @secure
   * @response `204` `void` No Content
   * @response `400` `DomainAPIError` Bad Request
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  export namespace BudgetReorderUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainReorderBudgetItemsRequest;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Creates a copy of an existing offer. The cloned offer starts in draft phase.
   * @tags Offers
   * @name CloneCreate
   * @summary Clone offer
   * @request POST:/offers/{id}/clone
   * @secure
   * @response `201` `DomainOfferDTO` Cloned offer
   * @response `400` `DomainErrorResponse` Invalid offer ID or request body
   * @response `404` `DomainErrorResponse` Source offer not found
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace CloneCreate {
    export type RequestParams = {
      /** Source Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainCloneOfferRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Transitions an offer from order phase to completed phase. Indicates work is finished.
   * @tags Offers
   * @name CompleteCreate
   * @summary Complete an offer
   * @request POST:/offers/{id}/complete
   * @secure
   * @response `200` `DomainOfferDTO` Completed offer
   * @response `400` `DomainErrorResponse` Invalid offer ID or offer not in order phase
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace CompleteCreate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Updates only the cost field of an offer
   * @tags Offers
   * @name CostUpdate
   * @summary Update offer cost
   * @request PUT:/offers/{id}/cost
   * @secure
   * @response `200` `DomainOfferDTO` OK
   * @response `400` `DomainErrorResponse` Invalid ID or offer closed
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace CostUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferCostRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Updates only the customer field of an offer
   * @tags Offers
   * @name CustomerUpdate
   * @summary Update offer customer
   * @request PUT:/offers/{id}/customer
   * @secure
   * @response `200` `DomainOfferDTO` OK
   * @response `400` `DomainErrorResponse` Invalid ID, offer closed, or customer not found
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace CustomerUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferCustomerRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Updates the flag indicating whether the customer has won their project
   * @tags Offers
   * @name CustomerHasWonProjectUpdate
   * @summary Update customer has won project flag
   * @request PUT:/offers/{id}/customer-has-won-project
   * @secure
   * @response `200` `DomainOfferDTO` OK
   * @response `400` `DomainErrorResponse` Invalid ID or offer closed
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace CustomerHasWonProjectUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferCustomerHasWonProjectRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Updates only the description field of an offer
   * @tags Offers
   * @name DescriptionUpdate
   * @summary Update offer description
   * @request PUT:/offers/{id}/description
   * @secure
   * @response `200` `DomainOfferDTO` OK
   * @response `400` `DomainErrorResponse` Invalid ID or offer closed
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace DescriptionUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferDescriptionRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Get an offer including budget items and summary calculations
   * @tags Offers
   * @name DetailList
   * @summary Get offer with budget details
   * @request GET:/offers/{id}/detail
   * @secure
   * @response `200` `DomainOfferDetailDTO` Offer with budget details
   * @response `400` `DomainErrorResponse` Invalid offer ID
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace DetailList {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDetailDTO;
  }

  /**
   * @description Updates only the due date field of an offer (can be null to clear)
   * @tags Offers
   * @name DueDateUpdate
   * @summary Update offer due date
   * @request PUT:/offers/{id}/due-date
   * @secure
   * @response `200` `DomainOfferDTO` OK
   * @response `400` `DomainErrorResponse` Invalid ID or offer closed
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace DueDateUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferDueDateRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Updates the end date of an offer. Used to record the expected or actual project end date.
   * @tags Offers
   * @name EndDateUpdate
   * @summary Update offer end date
   * @request PUT:/offers/{id}/end-date
   * @secure
   * @response `200` `DomainOfferDTO` OK
   * @response `400` `DomainErrorResponse` Invalid ID, offer closed, or end date before start date
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace EndDateUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferEndDateRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Updates the expiration date of a sent offer. Used to extend the validity period for the customer to accept.
   * @tags Offers
   * @name ExpirationDateUpdate
   * @summary Update offer expiration date
   * @request PUT:/offers/{id}/expiration-date
   * @secure
   * @response `200` `DomainOfferDTO` OK
   * @response `400` `DomainErrorResponse` Invalid ID, offer not sent, or invalid date
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace ExpirationDateUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferExpirationDateRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Updates the external/customer reference number. Returns 409 if reference already exists for this company.
   * @tags Offers
   * @name ExternalReferenceUpdate
   * @summary Update external reference
   * @request PUT:/offers/{id}/external-reference
   * @secure
   * @response `200` `DomainOfferDTO` OK
   * @response `400` `DomainErrorResponse` Invalid ID or request
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `409` `DomainErrorResponse` External reference already exists for this company
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace ExternalReferenceUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferExternalReferenceRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Syncs financial data from the data warehouse for the given offer and persists it. The offer must have an external_reference to be matched in the data warehouse. This endpoint queries the DW, persists the financial data to the offer, and returns the result.
   * @tags Offers
   * @name ExternalSyncList
   * @summary Sync data warehouse financials for an offer
   * @request GET:/offers/{id}/external-sync
   * @secure
   * @response `200` `DomainOfferExternalSyncResponse` Data warehouse financials with sync status
   * @response `400` `DomainErrorResponse` Invalid offer ID
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace ExternalSyncList {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferExternalSyncResponse;
  }

  /**
   * @description Updates the health status (on_track, at_risk, delayed, over_budget) and optionally the completion percentage of an offer in order phase. Used to track execution progress.
   * @tags Offers
   * @name HealthUpdate
   * @summary Update offer health status
   * @request PUT:/offers/{id}/health
   * @secure
   * @response `200` `DomainOfferDTO` Updated offer
   * @response `400` `DomainErrorResponse` Invalid offer ID, request body, or offer not in order phase
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace HealthUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferHealthRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Updates the invoiced amount of an offer in order phase. Used to track how much has been invoiced to the customer.
   * @tags Offers
   * @name InvoicedUpdate
   * @summary Update offer invoiced amount
   * @request PUT:/offers/{id}/invoiced
   * @secure
   * @response `200` `DomainOfferDTO` Updated offer
   * @response `400` `DomainErrorResponse` Invalid offer ID, request body, or offer not in order phase
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace InvoicedUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferInvoicedRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * No description
   * @tags Offers
   * @name ItemsList
   * @summary Get offer items
   * @request GET:/offers/{id}/items
   * @secure
   * @response `200` `(DomainOfferItemDTO)[]` OK
   */
  export namespace ItemsList {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferItemDTO[];
  }

  /**
   * No description
   * @tags Offers
   * @name ItemsCreate
   * @summary Add offer item
   * @request POST:/offers/{id}/items
   * @secure
   * @response `201` `DomainOfferItemDTO` Created
   */
  export namespace ItemsCreate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainCreateOfferItemRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferItemDTO;
  }

  /**
   * @description Updates only the notes field of an offer
   * @tags Offers
   * @name NotesUpdate
   * @summary Update offer notes
   * @request PUT:/offers/{id}/notes
   * @secure
   * @response `200` `DomainOfferDTO` OK
   * @response `400` `DomainErrorResponse` Invalid ID or offer closed
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace NotesUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferNotesRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Updates the internal offer number (e.g., "TK-2025-001"). Returns 409 if number already exists.
   * @tags Offers
   * @name OfferNumberUpdate
   * @summary Update offer number
   * @request PUT:/offers/{id}/offer-number
   * @secure
   * @response `200` `DomainOfferDTO` OK
   * @response `400` `DomainErrorResponse` Invalid ID or request
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `409` `DomainErrorResponse` Offer number already exists
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace OfferNumberUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferNumberRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Updates only the probability field of an offer
   * @tags Offers
   * @name ProbabilityUpdate
   * @summary Update offer probability
   * @request PUT:/offers/{id}/probability
   * @secure
   * @response `200` `DomainOfferDTO` OK
   * @response `400` `DomainErrorResponse` Invalid ID or offer closed
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace ProbabilityUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferProbabilityRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Links an offer to an existing project
   * @tags Offers
   * @name ProjectUpdate
   * @summary Link offer to project
   * @request PUT:/offers/{id}/project
   * @secure
   * @response `200` `DomainOfferDTO` OK
   * @response `400` `DomainErrorResponse` Invalid ID, offer closed, or project not found
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace ProjectUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferProjectRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Removes the project link from an offer
   * @tags Offers
   * @name ProjectDelete
   * @summary Unlink offer from project
   * @request DELETE:/offers/{id}/project
   * @secure
   * @response `200` `DomainOfferDTO` OK
   * @response `400` `DomainErrorResponse` Invalid ID or offer closed
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace ProjectDelete {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Recalculates the offer value from budget dimensions
   * @tags Offers
   * @name RecalculateCreate
   * @summary Recalculate offer totals
   * @request POST:/offers/{id}/recalculate
   * @secure
   * @response `200` `DomainOfferDTO` Updated offer
   * @response `400` `DomainErrorResponse` Invalid offer ID
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace RecalculateCreate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Transitions an offer from sent phase to lost phase with an optional reason.
   * @tags Offers
   * @name RejectCreate
   * @summary Reject offer
   * @request POST:/offers/{id}/reject
   * @secure
   * @response `200` `DomainOfferDTO` Rejected offer
   * @response `400` `DomainErrorResponse` Invalid offer ID, request body, or offer not in sent phase
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace RejectCreate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainRejectOfferRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Transitions an offer from completed phase back to order phase. Allows additional work on a finished order.
   * @tags Offers
   * @name ReopenCreate
   * @summary Reopen a completed offer
   * @request POST:/offers/{id}/reopen
   * @secure
   * @response `200` `DomainOfferDTO` Reopened offer
   * @response `400` `DomainErrorResponse` Invalid offer ID or offer not in completed phase
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace ReopenCreate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Updates only the responsible user field of an offer
   * @tags Offers
   * @name ResponsibleUpdate
   * @summary Update offer responsible user
   * @request PUT:/offers/{id}/responsible
   * @secure
   * @response `200` `DomainOfferDTO` OK
   * @response `400` `DomainErrorResponse` Invalid ID or offer closed
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace ResponsibleUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferResponsibleRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Transitions an offer from draft or in_progress phase to sent phase.
   * @tags Offers
   * @name SendCreate
   * @summary Send offer to customer
   * @request POST:/offers/{id}/send
   * @secure
   * @response `200` `DomainOfferDTO` Updated offer
   * @response `400` `DomainErrorResponse` Invalid offer ID or offer not in valid phase for sending
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace SendCreate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Updates the sent date of an offer. Used to record when the offer was sent to the customer.
   * @tags Offers
   * @name SentDateUpdate
   * @summary Update offer sent date
   * @request PUT:/offers/{id}/sent-date
   * @secure
   * @response `200` `DomainOfferDTO` OK
   * @response `400` `DomainErrorResponse` Invalid ID or offer closed
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace SentDateUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferSentDateRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Updates the spent amount of an offer in order phase. Used to track actual costs incurred during execution.
   * @tags Offers
   * @name SpentUpdate
   * @summary Update offer spent amount
   * @request PUT:/offers/{id}/spent
   * @secure
   * @response `200` `DomainOfferDTO` Updated offer
   * @response `400` `DomainErrorResponse` Invalid offer ID, request body, or offer not in order phase
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace SpentUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferSpentRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Updates the start date of an offer. Used to record the expected or actual project start date.
   * @tags Offers
   * @name StartDateUpdate
   * @summary Update offer start date
   * @request PUT:/offers/{id}/start-date
   * @secure
   * @response `200` `DomainOfferDTO` OK
   * @response `400` `DomainErrorResponse` Invalid ID, offer closed, or end date before start date
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace StartDateUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferStartDateRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Get all suppliers linked to an offer with their relationship details
   * @tags Offers
   * @name SuppliersList
   * @summary Get offer suppliers
   * @request GET:/offers/{id}/suppliers
   * @secure
   * @response `200` `(DomainOfferSupplierWithDetailsDTO)[]` OK
   * @response `400` `DomainErrorResponse` Invalid offer ID
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace SuppliersList {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferSupplierWithDetailsDTO[];
  }

  /**
   * @description Links a supplier to an offer with optional status and notes
   * @tags Offers
   * @name SuppliersCreate
   * @summary Add supplier to offer
   * @request POST:/offers/{id}/suppliers
   * @secure
   * @response `201` `DomainOfferSupplierWithDetailsDTO` Created
   * @response `400` `DomainErrorResponse` Invalid offer ID or request
   * @response `404` `DomainErrorResponse` Offer or supplier not found
   * @response `409` `DomainErrorResponse` Supplier already linked to offer
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace SuppliersCreate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainAddOfferSupplierRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferSupplierWithDetailsDTO;
  }

  /**
   * @description Updates the status and/or notes of an offer-supplier relationship
   * @tags Offers
   * @name SuppliersUpdate
   * @summary Update offer-supplier relationship
   * @request PUT:/offers/{id}/suppliers/{supplierId}
   * @secure
   * @response `200` `DomainOfferSupplierWithDetailsDTO` OK
   * @response `400` `DomainErrorResponse` Invalid offer or supplier ID
   * @response `404` `DomainErrorResponse` Offer-supplier relationship not found
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace SuppliersUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
      /** Supplier ID */
      supplierId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferSupplierRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferSupplierWithDetailsDTO;
  }

  /**
   * @description Removes the link between a supplier and an offer
   * @tags Offers
   * @name SuppliersDelete
   * @summary Remove supplier from offer
   * @request DELETE:/offers/{id}/suppliers/{supplierId}
   * @secure
   * @response `204` `void` No Content
   * @response `400` `DomainErrorResponse` Invalid offer or supplier ID
   * @response `404` `DomainErrorResponse` Offer-supplier relationship not found
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace SuppliersDelete {
    export type RequestParams = {
      /** Offer ID */
      id: string;
      /** Supplier ID */
      supplierId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Updates the contact person for an offer-supplier relationship. Pass null to clear the contact.
   * @tags Offers
   * @name SuppliersContactUpdate
   * @summary Update offer-supplier contact person
   * @request PUT:/offers/{id}/suppliers/{supplierId}/contact
   * @secure
   * @response `200` `DomainOfferSupplierWithDetailsDTO` OK
   * @response `400` `DomainErrorResponse` Invalid offer or supplier ID, or contact not found
   * @response `404` `DomainErrorResponse` Offer-supplier relationship not found
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace SuppliersContactUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
      /** Supplier ID */
      supplierId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferSupplierContactRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferSupplierWithDetailsDTO;
  }

  /**
   * @description Updates only the notes of an offer-supplier relationship
   * @tags Offers
   * @name SuppliersNotesUpdate
   * @summary Update offer-supplier notes
   * @request PUT:/offers/{id}/suppliers/{supplierId}/notes
   * @secure
   * @response `200` `DomainOfferSupplierWithDetailsDTO` OK
   * @response `400` `DomainErrorResponse` Invalid offer or supplier ID
   * @response `404` `DomainErrorResponse` Offer-supplier relationship not found
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace SuppliersNotesUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
      /** Supplier ID */
      supplierId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferSupplierNotesRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferSupplierWithDetailsDTO;
  }

  /**
   * @description Updates only the status of an offer-supplier relationship
   * @tags Offers
   * @name SuppliersStatusUpdate
   * @summary Update offer-supplier status
   * @request PUT:/offers/{id}/suppliers/{supplierId}/status
   * @secure
   * @response `200` `DomainOfferSupplierWithDetailsDTO` OK
   * @response `400` `DomainErrorResponse` Invalid offer or supplier ID, or invalid status
   * @response `404` `DomainErrorResponse` Offer-supplier relationship not found
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace SuppliersStatusUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
      /** Supplier ID */
      supplierId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferSupplierStatusRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferSupplierWithDetailsDTO;
  }

  /**
   * @description Updates only the title field of an offer
   * @tags Offers
   * @name TitleUpdate
   * @summary Update offer title
   * @request PUT:/offers/{id}/title
   * @secure
   * @response `200` `DomainOfferDTO` OK
   * @response `400` `DomainErrorResponse` Invalid ID or offer closed
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace TitleUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferTitleRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Updates only the value field of an offer
   * @tags Offers
   * @name ValueUpdate
   * @summary Update offer value
   * @request PUT:/offers/{id}/value
   * @secure
   * @response `200` `DomainOfferDTO` OK
   * @response `400` `DomainErrorResponse` Invalid ID or offer closed
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace ValueUpdate {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateOfferValueRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Transitions an offer to won phase within a project context. This also transitions the project from tilbud to active phase, expires sibling offers, and sets the winning offer's number on the project.
   * @tags Offers
   * @name PostOffers
   * @summary Win an offer within a project
   * @request POST:/offers/{id}/win
   * @secure
   * @response `200` `DomainWinOfferResponse` Won offer with project and expired sibling offers
   * @response `400` `DomainErrorResponse` Invalid offer ID, request body, offer not in project, or project not in tilbud phase
   * @response `404` `DomainErrorResponse` Offer not found
   * @response `500` `DomainErrorResponse` Internal server error
   */
  export namespace PostOffers {
    export type RequestParams = {
      /** Offer ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainWinOfferRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainWinOfferResponse;
  }
}
