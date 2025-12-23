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
  DomainAPIError,
  DomainDashboardMetrics,
  MetricsListParams,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Dashboard<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Returns dashboard metrics with configurable time range. All metrics exclude draft and expired offers. **IMPORTANT: Aggregation Logic (Avoids Double-Counting)** When a project has multiple offers, only the highest value offer per phase is counted. Orphan offers (without project) are included at full value. Example: Project A has offers 23M and 25M in "sent" phase - totalValue shows 25M, not 48M. **Time Range Options:** - `rolling12months` (default): Uses a rolling 12-month window from the current date - `allTime`: Calculates metrics without any date filter - Custom range: Use `fromDate` and `toDate` parameters (YYYY-MM-DD format) **Custom Date Range:** When `fromDate` and/or `toDate` are provided, they override the `timeRange` parameter. - `fromDate`: Start of range at 00:00:00 local time - `toDate`: End of range at 23:59:59 local time - Both parameters are optional; can be used together or individually **Offer Metrics (Pipeline Phase):** - `totalOfferCount`: Count of offers excluding drafts and expired - `totalProjectCount`: Count of unique projects with offers (excludes orphan offers) - `offerReserve`: Total value of active offers - best per project (avoids double-counting) - `weightedOfferReserve`: Sum of (value * probability/100) for active offers - `averageProbability`: Average probability of active offers **Pipeline Data:** - Returns phases: in_progress, sent, order, completed, lost with counts and values - `count`: Total offer count in phase - `projectCount`: Unique projects in phase (excludes orphan offers) - `totalValue`: Sum of best offer value per project (avoids double-counting) - Excludes draft and expired offers **Win Rate Metrics:** - `winRate`: won_count / (won_count + lost_count) - returns 0-1 scale (e.g., 0.5 = 50%) - `economicWinRate`: won_value / (won_value + lost_value) - value-based win rate - Also includes `wonCount`, `lostCount`, `wonValue`, `lostValue` for transparency **Order Metrics (Execution Phase - from offers):** - `activeOrderCount`: Count of offers in order phase (active execution) - `completedOrderCount`: Count of offers in completed phase - `orderValue`: Total value of offers in order phase - `orderReserve`: Sum of (value - invoiced) for order phase offers - `totalInvoiced`: Sum of invoiced for order phase offers - `totalSpent`: Sum of spent for order phase offers - `averageOrderProgress`: Average completion percentage for order phase offers - `healthDistribution`: Count of order phase offers by health status (onTrack, atRisk, delayed, overBudget) **Financial Summary:** - `totalValue`: orderReserve + totalInvoiced **Recent Lists (limit 5 each):** - `recentOffers`: Offers in in_progress phase (Siste tilbud), sorted by update recency - `recentOrders`: Offers in order phase (Siste ordre), sorted by update recency **Top Customers:** Ranked by won offer count (order + completed phases) with total won value
   *
   * @tags Dashboard
   * @name MetricsList
   * @summary Get dashboard metrics
   * @request GET:/dashboard/metrics
   * @secure
   * @response `200` `DomainDashboardMetrics` OK
   * @response `400` `DomainAPIError` Invalid timeRange value or date format
   */
  metricsList = (query: MetricsListParams, params: RequestParams = {}) =>
    this.http.request<DomainDashboardMetrics, DomainAPIError>({
      path: `/dashboard/metrics`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
}
