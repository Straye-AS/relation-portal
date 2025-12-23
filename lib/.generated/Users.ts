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

import { DomainErrorResponse, DomainUserDTO } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Users<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Returns a list of active users. Super admins and gruppen users see all users. Regular users see only users from their company.
   *
   * @tags Users
   * @name UsersList
   * @summary List users
   * @request GET:/users
   * @secure
   * @response `200` `(DomainUserDTO)[]` OK
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  usersList = (params: RequestParams = {}) =>
    this.http.request<DomainUserDTO[], DomainErrorResponse>({
      path: `/users`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
