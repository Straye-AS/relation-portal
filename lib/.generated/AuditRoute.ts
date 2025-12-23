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
  DomainAuditLog,
  HandlerAuditLogDTO,
  HandlerAuditLogListResponse,
  HandlerAuditStatsResponse,
} from "./data-contracts";

export namespace Audit {
  /**
   * @description Returns a paginated list of audit log entries with optional filters
   * @tags Audit
   * @name AuditList
   * @summary List audit logs
   * @request GET:/audit
   * @secure
   * @response `200` `HandlerAuditLogListResponse` OK
   * @response `401` `Record<string,string>` Unauthorized
   * @response `403` `Record<string,string>` Forbidden
   */
  export namespace AuditList {
    export type RequestParams = {};
    export type RequestQuery = {
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
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HandlerAuditLogListResponse;
  }

  /**
   * @description Returns audit logs for a specific entity
   * @tags Audit
   * @name EntityDetail
   * @summary Get audit logs for an entity
   * @request GET:/audit/entity/{entityType}/{entityId}
   * @secure
   * @response `200` `(HandlerAuditLogDTO)[]` OK
   * @response `401` `Record<string,string>` Unauthorized
   * @response `403` `Record<string,string>` Forbidden
   */
  export namespace EntityDetail {
    export type RequestParams = {
      /** Entity type (e.g., Customer, Project) */
      entityType: string;
      /** Entity ID */
      entityId: string;
    };
    export type RequestQuery = {
      /** Maximum number of entries (default: 50) */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HandlerAuditLogDTO[];
  }

  /**
   * @description Exports audit logs for a time range as JSON
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
  export namespace ExportList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Start time (RFC3339) */
      startTime: string;
      /** End time (RFC3339) */
      endTime: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainAuditLog[];
  }

  /**
   * @description Returns statistics about audit log actions for a time range
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
  export namespace StatsList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Start time (RFC3339) */
      startTime: string;
      /** End time (RFC3339) */
      endTime: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HandlerAuditStatsResponse;
  }

  /**
   * @description Returns a specific audit log entry
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
  export namespace AuditDetail {
    export type RequestParams = {
      /** Audit log ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HandlerAuditLogDTO;
  }
}
