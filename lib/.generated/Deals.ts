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
  ActivitiesListParams2,
  AdvanceCreateParams,
  AnalyticsListParams,
  CreateOfferCreateParams,
  DealsDeleteParams,
  DealsDetailParams,
  DealsListParams,
  DealsUpdateParams,
  DomainActivityDTO,
  DomainCreateDealRequest,
  DomainCreateOfferFromDealRequest,
  DomainCreateOfferFromDealResponse,
  DomainDealDTO,
  DomainDealStageHistoryDTO,
  DomainErrorResponse,
  DomainLoseDealRequest,
  DomainPaginatedResponse,
  DomainPipelineAnalyticsDTO,
  DomainUpdateDealRequest,
  DomainUpdateDealStageRequest,
  ForecastListParams,
  HandlerDealWithHistoryResponse,
  HandlerWinDealResponse,
  HistoryListParams,
  LoseCreateParams,
  PostDealsParams,
  ReopenCreateParams,
  RepositoryForecastPeriod,
  RepositoryPipelineStats,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Deals<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description List deals with optional filters
   *
   * @tags Deals
   * @name DealsList
   * @summary List deals
   * @request GET:/deals
   * @secure
   * @response `200` `DomainPaginatedResponse` OK
   */
  dealsList = (query: DealsListParams, params: RequestParams = {}) =>
    this.http.request<DomainPaginatedResponse, any>({
      path: `/deals`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Create a new deal in the sales pipeline
   *
   * @tags Deals
   * @name DealsCreate
   * @summary Create deal
   * @request POST:/deals
   * @secure
   * @response `201` `DomainDealDTO` Created
   */
  dealsCreate = (
    request: DomainCreateDealRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainDealDTO, any>({
      path: `/deals`,
      method: "POST",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get comprehensive sales pipeline analytics including stage summary, forecasts, conversion rates, and win rate analysis
   *
   * @tags Deals
   * @name AnalyticsList
   * @summary Get pipeline analytics
   * @request GET:/deals/analytics
   * @secure
   * @response `200` `DomainPipelineAnalyticsDTO` OK
   * @response `400` `DomainErrorResponse` Invalid date range - dateFrom must be before dateTo
   */
  analyticsList = (query: AnalyticsListParams, params: RequestParams = {}) =>
    this.http.request<DomainPipelineAnalyticsDTO, DomainErrorResponse>({
      path: `/deals/analytics`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get forecast data for upcoming months
   *
   * @tags Deals
   * @name ForecastList
   * @summary Get pipeline forecast
   * @request GET:/deals/forecast
   * @secure
   * @response `200` `(RepositoryForecastPeriod)[]` OK
   */
  forecastList = (query: ForecastListParams, params: RequestParams = {}) =>
    this.http.request<RepositoryForecastPeriod[], any>({
      path: `/deals/forecast`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get all deals grouped by stage for pipeline view
   *
   * @tags Deals
   * @name PipelineList
   * @summary Get pipeline overview
   * @request GET:/deals/pipeline
   * @secure
   * @response `200` `Record<string,(DomainDealDTO)[]>` OK
   */
  pipelineList = (params: RequestParams = {}) =>
    this.http.request<Record<string, DomainDealDTO[]>, any>({
      path: `/deals/pipeline`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get aggregated statistics for the sales pipeline
   *
   * @tags Deals
   * @name StatsList
   * @summary Get pipeline statistics
   * @request GET:/deals/stats
   * @secure
   * @response `200` `RepositoryPipelineStats` OK
   */
  statsList = (params: RequestParams = {}) =>
    this.http.request<RepositoryPipelineStats, any>({
      path: `/deals/stats`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get a deal by ID with full details including stage history
   *
   * @tags Deals
   * @name DealsDetail
   * @summary Get deal
   * @request GET:/deals/{id}
   * @secure
   * @response `200` `HandlerDealWithHistoryResponse` OK
   */
  dealsDetail = (
    { id, ...query }: DealsDetailParams,
    params: RequestParams = {},
  ) =>
    this.http.request<HandlerDealWithHistoryResponse, any>({
      path: `/deals/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Update an existing deal
   *
   * @tags Deals
   * @name DealsUpdate
   * @summary Update deal
   * @request PUT:/deals/{id}
   * @secure
   * @response `200` `DomainDealDTO` OK
   */
  dealsUpdate = (
    { id, ...query }: DealsUpdateParams,
    request: DomainUpdateDealRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainDealDTO, any>({
      path: `/deals/${id}`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Delete a deal
   *
   * @tags Deals
   * @name DealsDelete
   * @summary Delete deal
   * @request DELETE:/deals/{id}
   * @secure
   * @response `204` `void` No Content
   */
  dealsDelete = (
    { id, ...query }: DealsDeleteParams,
    params: RequestParams = {},
  ) =>
    this.http.request<void, any>({
      path: `/deals/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Get activities for a deal
   *
   * @tags Deals
   * @name ActivitiesList
   * @summary Get deal activities
   * @request GET:/deals/{id}/activities
   * @secure
   * @response `200` `(DomainActivityDTO)[]` OK
   */
  activitiesList = (
    { id, ...query }: ActivitiesListParams2,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainActivityDTO[], any>({
      path: `/deals/${id}/activities`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Advance a deal to the next stage in the pipeline
   *
   * @tags Deals
   * @name AdvanceCreate
   * @summary Advance deal stage
   * @request POST:/deals/{id}/advance
   * @secure
   * @response `200` `DomainDealDTO` OK
   */
  advanceCreate = (
    { id, ...query }: AdvanceCreateParams,
    request: DomainUpdateDealStageRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainDealDTO, any>({
      path: `/deals/${id}/advance`,
      method: "POST",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Create an offer linked to a deal, advancing the deal to proposal stage
   *
   * @tags Deals
   * @name CreateOfferCreate
   * @summary Create offer from deal
   * @request POST:/deals/{id}/create-offer
   * @secure
   * @response `201` `DomainCreateOfferFromDealResponse` Created
   * @response `400` `DomainErrorResponse` Invalid request or deal already has offer or invalid stage
   * @response `404` `DomainErrorResponse` Deal not found
   */
  createOfferCreate = (
    { id, ...query }: CreateOfferCreateParams,
    request: DomainCreateOfferFromDealRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainCreateOfferFromDealResponse, DomainErrorResponse>({
      path: `/deals/${id}/create-offer`,
      method: "POST",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get the stage history for a deal
   *
   * @tags Deals
   * @name HistoryList
   * @summary Get deal stage history
   * @request GET:/deals/{id}/history
   * @secure
   * @response `200` `(DomainDealStageHistoryDTO)[]` OK
   */
  historyList = (
    { id, ...query }: HistoryListParams,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainDealStageHistoryDTO[], any>({
      path: `/deals/${id}/history`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Mark a deal as lost with a categorized reason and detailed notes
   *
   * @tags Deals
   * @name LoseCreate
   * @summary Lose deal
   * @request POST:/deals/{id}/lose
   * @secure
   * @response `200` `DomainDealDTO` OK
   * @response `400` `DomainErrorResponse` Invalid request - reason must be one of: price, timing, competitor, requirements, other. Notes must be 10-500 characters.
   */
  loseCreate = (
    { id, ...query }: LoseCreateParams,
    request: DomainLoseDealRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainDealDTO, DomainErrorResponse>({
      path: `/deals/${id}/lose`,
      method: "POST",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Reopen a lost deal as a new lead
   *
   * @tags Deals
   * @name ReopenCreate
   * @summary Reopen deal
   * @request POST:/deals/{id}/reopen
   * @secure
   * @response `200` `DomainDealDTO` OK
   */
  reopenCreate = (
    { id, ...query }: ReopenCreateParams,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainDealDTO, any>({
      path: `/deals/${id}/reopen`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Mark a deal as won and optionally create a project
   *
   * @tags Deals
   * @name PostDeals
   * @summary Win deal
   * @request POST:/deals/{id}/win
   * @secure
   * @response `200` `HandlerWinDealResponse` OK
   */
  postDeals = ({ id, ...query }: PostDealsParams, params: RequestParams = {}) =>
    this.http.request<HandlerWinDealResponse, any>({
      path: `/deals/${id}/win`,
      method: "POST",
      query: query,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
