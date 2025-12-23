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
  CompaniesDetailParams,
  CompaniesUpdateParams,
  DomainAPIError,
  DomainCompany,
  DomainCompanyDetailDTO,
  DomainUpdateCompanyRequest,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Companies<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Returns a list of all active Straye group companies
   *
   * @tags Companies
   * @name CompaniesList
   * @summary Get all companies
   * @request GET:/companies
   * @secure
   * @response `200` `(DomainCompany)[]` OK
   */
  companiesList = (params: RequestParams = {}) =>
    this.http.request<DomainCompany[], any>({
      path: `/companies`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Returns detailed information about a specific company including default responsible user settings
   *
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
  companiesDetail = (
    { id, ...query }: CompaniesDetailParams,
    params: RequestParams = {}
  ) =>
    this.http.request<DomainCompanyDetailDTO, DomainAPIError>({
      path: `/companies/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Updates company settings including default responsible users for offers and projects
   *
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
  companiesUpdate = (
    { id, ...query }: CompaniesUpdateParams,
    body: DomainUpdateCompanyRequest,
    params: RequestParams = {}
  ) =>
    this.http.request<DomainCompanyDetailDTO, DomainAPIError>({
      path: `/companies/${id}`,
      method: "PUT",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
