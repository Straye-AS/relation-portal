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
  DomainActivityDTO,
  DomainCreateDealRequest,
  DomainCreateOfferFromDealRequest,
  DomainCreateOfferFromDealResponse,
  DomainDealDTO,
  DomainDealStageHistoryDTO,
  DomainLoseDealRequest,
  DomainPaginatedResponse,
  DomainPipelineAnalyticsDTO,
  DomainUpdateDealRequest,
  DomainUpdateDealStageRequest,
  HandlerDealWithHistoryResponse,
  HandlerWinDealResponse,
  RepositoryForecastPeriod,
  RepositoryPipelineStats,
} from "./data-contracts";

export namespace Deals {
  /**
   * @description List deals with optional filters
   * @tags Deals
   * @name DealsList
   * @summary List deals
   * @request GET:/deals
   * @secure
   * @response `200` `DomainPaginatedResponse` OK
   */
  export namespace DealsList {
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
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainPaginatedResponse;
  }

  /**
   * @description Create a new deal in the sales pipeline
   * @tags Deals
   * @name DealsCreate
   * @summary Create deal
   * @request POST:/deals
   * @secure
   * @response `201` `DomainDealDTO` Created
   */
  export namespace DealsCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DomainCreateDealRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainDealDTO;
  }

  /**
   * @description Get comprehensive sales pipeline analytics including stage summary, forecasts, conversion rates, and win rate analysis
   * @tags Deals
   * @name AnalyticsList
   * @summary Get pipeline analytics
   * @request GET:/deals/analytics
   * @secure
   * @response `200` `DomainPipelineAnalyticsDTO` OK
   * @response `400` `DomainErrorResponse` Invalid date range - dateFrom must be before dateTo
   */
  export namespace AnalyticsList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Filter by company ID */
      companyId?: string;
      /** Filter by owner ID */
      ownerId?: string;
      /** Filter by date from (YYYY-MM-DD) */
      dateFrom?: string;
      /** Filter by date to (YYYY-MM-DD) */
      dateTo?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainPipelineAnalyticsDTO;
  }

  /**
   * @description Get forecast data for upcoming months
   * @tags Deals
   * @name ForecastList
   * @summary Get pipeline forecast
   * @request GET:/deals/forecast
   * @secure
   * @response `200` `(RepositoryForecastPeriod)[]` OK
   */
  export namespace ForecastList {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Number of months to forecast
       * @default 3
       */
      months?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RepositoryForecastPeriod[];
  }

  /**
   * @description Get all deals grouped by stage for pipeline view
   * @tags Deals
   * @name PipelineList
   * @summary Get pipeline overview
   * @request GET:/deals/pipeline
   * @secure
   * @response `200` `Record<string,(DomainDealDTO)[]>` OK
   */
  export namespace PipelineList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Record<string, DomainDealDTO[]>;
  }

  /**
   * @description Get aggregated statistics for the sales pipeline
   * @tags Deals
   * @name StatsList
   * @summary Get pipeline statistics
   * @request GET:/deals/stats
   * @secure
   * @response `200` `RepositoryPipelineStats` OK
   */
  export namespace StatsList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RepositoryPipelineStats;
  }

  /**
   * @description Get a deal by ID with full details including stage history
   * @tags Deals
   * @name DealsDetail
   * @summary Get deal
   * @request GET:/deals/{id}
   * @secure
   * @response `200` `HandlerDealWithHistoryResponse` OK
   */
  export namespace DealsDetail {
    export type RequestParams = {
      /** Deal ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HandlerDealWithHistoryResponse;
  }

  /**
   * @description Update an existing deal
   * @tags Deals
   * @name DealsUpdate
   * @summary Update deal
   * @request PUT:/deals/{id}
   * @secure
   * @response `200` `DomainDealDTO` OK
   */
  export namespace DealsUpdate {
    export type RequestParams = {
      /** Deal ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateDealRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainDealDTO;
  }

  /**
   * @description Delete a deal
   * @tags Deals
   * @name DealsDelete
   * @summary Delete deal
   * @request DELETE:/deals/{id}
   * @secure
   * @response `204` `void` No Content
   */
  export namespace DealsDelete {
    export type RequestParams = {
      /** Deal ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Get activities for a deal
   * @tags Deals
   * @name ActivitiesList
   * @summary Get deal activities
   * @request GET:/deals/{id}/activities
   * @secure
   * @response `200` `(DomainActivityDTO)[]` OK
   */
  export namespace ActivitiesList {
    export type RequestParams = {
      /** Deal ID */
      id: string;
    };
    export type RequestQuery = {
      /**
       * Limit results
       * @default 50
       */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainActivityDTO[];
  }

  /**
   * @description Advance a deal to the next stage in the pipeline
   * @tags Deals
   * @name AdvanceCreate
   * @summary Advance deal stage
   * @request POST:/deals/{id}/advance
   * @secure
   * @response `200` `DomainDealDTO` OK
   */
  export namespace AdvanceCreate {
    export type RequestParams = {
      /** Deal ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateDealStageRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainDealDTO;
  }

  /**
   * @description Create an offer linked to a deal, advancing the deal to proposal stage
   * @tags Deals
   * @name CreateOfferCreate
   * @summary Create offer from deal
   * @request POST:/deals/{id}/create-offer
   * @secure
   * @response `201` `DomainCreateOfferFromDealResponse` Created
   * @response `400` `DomainErrorResponse` Invalid request or deal already has offer or invalid stage
   * @response `404` `DomainErrorResponse` Deal not found
   */
  export namespace CreateOfferCreate {
    export type RequestParams = {
      /** Deal ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainCreateOfferFromDealRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainCreateOfferFromDealResponse;
  }

  /**
   * @description Get the stage history for a deal
   * @tags Deals
   * @name HistoryList
   * @summary Get deal stage history
   * @request GET:/deals/{id}/history
   * @secure
   * @response `200` `(DomainDealStageHistoryDTO)[]` OK
   */
  export namespace HistoryList {
    export type RequestParams = {
      /** Deal ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainDealStageHistoryDTO[];
  }

  /**
   * @description Mark a deal as lost with a categorized reason and detailed notes
   * @tags Deals
   * @name LoseCreate
   * @summary Lose deal
   * @request POST:/deals/{id}/lose
   * @secure
   * @response `200` `DomainDealDTO` OK
   * @response `400` `DomainErrorResponse` Invalid request - reason must be one of: price, timing, competitor, requirements, other. Notes must be 10-500 characters.
   */
  export namespace LoseCreate {
    export type RequestParams = {
      /** Deal ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainLoseDealRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainDealDTO;
  }

  /**
   * @description Reopen a lost deal as a new lead
   * @tags Deals
   * @name ReopenCreate
   * @summary Reopen deal
   * @request POST:/deals/{id}/reopen
   * @secure
   * @response `200` `DomainDealDTO` OK
   */
  export namespace ReopenCreate {
    export type RequestParams = {
      /** Deal ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainDealDTO;
  }

  /**
   * @description Mark a deal as won and optionally create a project
   * @tags Deals
   * @name PostDeals
   * @summary Win deal
   * @request POST:/deals/{id}/win
   * @secure
   * @response `200` `HandlerWinDealResponse` OK
   */
  export namespace PostDeals {
    export type RequestParams = {
      /** Deal ID */
      id: string;
    };
    export type RequestQuery = {
      /**
       * Create a project from the deal
       * @default true
       */
      createProject?: boolean;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HandlerWinDealResponse;
  }
}
