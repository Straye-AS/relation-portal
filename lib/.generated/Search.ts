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

import { DomainSearchResult, SearchListParams2 } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Search<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * No description
   *
   * @tags Search
   * @name SearchList
   * @summary Global search
   * @request GET:/search
   * @secure
   * @response `200` `DomainSearchResult` OK
   */
  searchList = (query: SearchListParams2, params: RequestParams = {}) =>
    this.http.request<DomainSearchResult, any>({
      path: `/search`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
}
