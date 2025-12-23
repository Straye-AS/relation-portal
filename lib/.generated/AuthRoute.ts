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

export namespace Auth {
  /**
   * @description Returns the current authenticated user with roles, company, and permissions info
   * @tags Auth
   * @name GetAuth
   * @summary Get current authenticated user
   * @request GET:/auth/me
   * @secure
   * @response `200` `DomainAuthUserDTO` OK
   * @response `401` `Record<string,string>` Unauthorized
   */
  export namespace GetAuth {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainAuthUserDTO;
  }

  /**
   * @description Returns the full list of permissions for the current authenticated user
   * @tags Auth
   * @name PermissionsList
   * @summary Get current user's permissions
   * @request GET:/auth/permissions
   * @secure
   * @response `200` `DomainPermissionsResponseDTO` OK
   * @response `401` `Record<string,string>` Unauthorized
   */
  export namespace PermissionsList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainPermissionsResponseDTO;
  }
}
