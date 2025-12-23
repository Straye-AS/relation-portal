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

import { DomainUserDTO } from "./data-contracts";

export namespace Users {
  /**
   * @description Returns a list of active users. Super admins and gruppen users see all users. Regular users see only users from their company.
   * @tags Users
   * @name UsersList
   * @summary List users
   * @request GET:/users
   * @secure
   * @response `200` `(DomainUserDTO)[]` OK
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace UsersList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainUserDTO[];
  }
}
