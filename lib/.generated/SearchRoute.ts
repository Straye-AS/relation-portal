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

import { DomainSearchResult } from "./data-contracts";

export namespace Search {
  /**
   * No description
   * @tags Search
   * @name SearchList
   * @summary Global search
   * @request GET:/search
   * @secure
   * @response `200` `DomainSearchResult` OK
   */
  export namespace SearchList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search query */
      q: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainSearchResult;
  }
}
