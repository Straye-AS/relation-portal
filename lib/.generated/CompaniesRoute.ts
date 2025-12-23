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
  DomainCompany,
  DomainCompanyDetailDTO,
  DomainUpdateCompanyRequest,
} from "./data-contracts";

export namespace Companies {
  /**
   * @description Returns a list of all active Straye group companies
   * @tags Companies
   * @name CompaniesList
   * @summary Get all companies
   * @request GET:/companies
   * @secure
   * @response `200` `(DomainCompany)[]` OK
   */
  export namespace CompaniesList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainCompany[];
  }

  /**
   * @description Returns detailed information about a specific company including default responsible user settings
   * @tags Companies
   * @name CompaniesDetail
   * @summary Get company by ID
   * @request GET:/companies/{id}
   * @secure
   * @response `200` `DomainCompanyDetailDTO` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  export namespace CompaniesDetail {
    export type RequestParams = {
      /** Company ID (e.g., gruppen, stalbygg, hybridbygg, industri, tak, montasje) */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainCompanyDetailDTO;
  }

  /**
   * @description Updates company settings including default responsible users for offers and projects
   * @tags Companies
   * @name CompaniesUpdate
   * @summary Update company settings
   * @request PUT:/companies/{id}
   * @secure
   * @response `200` `DomainCompanyDetailDTO` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  export namespace CompaniesUpdate {
    export type RequestParams = {
      /** Company ID (e.g., gruppen, stalbygg, hybridbygg, industri, tak, montasje) */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateCompanyRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainCompanyDetailDTO;
  }
}
