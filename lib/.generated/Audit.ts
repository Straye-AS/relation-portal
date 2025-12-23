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
  AuditDetailParams,
  AuditListParams,
  DomainAuditLog,
  EntityDetailParams,
  ExportListParams,
  HandlerAuditLogDTO,
  HandlerAuditLogListResponse,
  HandlerAuditStatsResponse,
  StatsListParams1,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Audit<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Returns a paginated list of audit log entries with optional filters
   *
   * @tags Audit
   * @name AuditList
   * @summary List audit logs
   * @request GET:/audit
   * @secure
   * @response `200` `HandlerAuditLogListResponse` OK
   * @response `401` `Record<string,string>` Unauthorized
   * @response `403` `Record<string,string>` Forbidden
   */
  auditList = (query: AuditListParams, params: RequestParams = {}) =>
    this.http.request<HandlerAuditLogListResponse, Record<string, string>>({
      path: `/audit`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Returns audit logs for a specific entity
   *
   * @tags Audit
   * @name EntityDetail
   * @summary Get audit logs for an entity
   * @request GET:/audit/entity/{entityType}/{entityId}
   * @secure
   * @response `200` `(HandlerAuditLogDTO)[]` OK
   * @response `401` `Record<string,string>` Unauthorized
   * @response `403` `Record<string,string>` Forbidden
   */
  entityDetail = (
    { entityType, entityId, ...query }: EntityDetailParams,
    params: RequestParams = {},
  ) =>
    this.http.request<HandlerAuditLogDTO[], Record<string, string>>({
      path: `/audit/entity/${entityType}/${entityId}`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Exports audit logs for a time range as JSON
   *
   * @tags Audit
   * @name ExportList
   * @summary Export audit logs
   * @request GET:/audit/export
   * @secure
   * @response `200` `(DomainAuditLog)[]` OK
   * @response `400` `Record<string,string>` Bad request
   * @response `401` `Record<string,string>` Unauthorized
   * @response `403` `Record<string,string>` Forbidden
   */
  exportList = (query: ExportListParams, params: RequestParams = {}) =>
    this.http.request<DomainAuditLog[], Record<string, string>>({
      path: `/audit/export`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Returns statistics about audit log actions for a time range
   *
   * @tags Audit
   * @name StatsList
   * @summary Get audit log statistics
   * @request GET:/audit/stats
   * @secure
   * @response `200` `HandlerAuditStatsResponse` OK
   * @response `400` `Record<string,string>` Bad request
   * @response `401` `Record<string,string>` Unauthorized
   * @response `403` `Record<string,string>` Forbidden
   */
  statsList = (query: StatsListParams1, params: RequestParams = {}) =>
    this.http.request<HandlerAuditStatsResponse, Record<string, string>>({
      path: `/audit/stats`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Returns a specific audit log entry
   *
   * @tags Audit
   * @name AuditDetail
   * @summary Get audit log by ID
   * @request GET:/audit/{id}
   * @secure
   * @response `200` `HandlerAuditLogDTO` OK
   * @response `401` `Record<string,string>` Unauthorized
   * @response `403` `Record<string,string>` Forbidden
   * @response `404` `Record<string,string>` Not found
   */
  auditDetail = (
    { id, ...query }: AuditDetailParams,
    params: RequestParams = {},
  ) =>
    this.http.request<HandlerAuditLogDTO, Record<string, string>>({
      path: `/audit/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
