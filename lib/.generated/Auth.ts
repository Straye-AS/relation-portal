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
  DomainAuthUserDTO,
  DomainPermissionsResponseDTO,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Auth<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Returns the current authenticated user with roles, company, and permissions info
   *
   * @tags Auth
   * @name GetAuth
   * @summary Get current authenticated user
   * @request GET:/auth/me
   * @secure
   * @response `200` `DomainAuthUserDTO` OK
   * @response `401` `Record<string,string>` Unauthorized
   */
  getAuth = (params: RequestParams = {}) =>
    this.http.request<DomainAuthUserDTO, Record<string, string>>({
      path: `/auth/me`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Returns the full list of permissions for the current authenticated user
   *
   * @tags Auth
   * @name PermissionsList
   * @summary Get current user's permissions
   * @request GET:/auth/permissions
   * @secure
   * @response `200` `DomainPermissionsResponseDTO` OK
   * @response `401` `Record<string,string>` Unauthorized
   */
  permissionsList = (params: RequestParams = {}) =>
    this.http.request<DomainPermissionsResponseDTO, Record<string, string>>({
      path: `/auth/permissions`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
