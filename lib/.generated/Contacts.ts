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
  ContactsDeleteParams,
  ContactsDetailParams,
  ContactsList2Params,
  ContactsListParams,
  ContactsUpdateParams,
  DomainAddContactRelationshipRequest,
  DomainContactDTO,
  DomainContactRelationshipDTO,
  DomainCreateContactRequest,
  DomainPaginatedResponse,
  DomainUpdateContactRequest,
  RelationshipsCreateParams,
  RelationshipsDeleteParams,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Contacts<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Get paginated list of contacts with optional filters
   *
   * @tags Contacts
   * @name ContactsList
   * @summary List contacts
   * @request GET:/contacts
   * @secure
   * @response `200` `DomainPaginatedResponse` OK
   * @response `400` `Record<string,any>` Bad Request
   * @response `500` `Record<string,any>` Internal Server Error
   */
  contactsList = (query: ContactsListParams, params: RequestParams = {}) =>
    this.http.request<DomainPaginatedResponse, Record<string, any>>({
      path: `/contacts`,
      method: "GET",
      query: query,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Create a new contact
   *
   * @tags Contacts
   * @name ContactsCreate
   * @summary Create contact
   * @request POST:/contacts
   * @secure
   * @response `201` `DomainContactDTO` Created
   * @response `400` `Record<string,any>` Bad Request
   * @response `500` `Record<string,any>` Internal Server Error
   */
  contactsCreate = (
    request: DomainCreateContactRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainContactDTO, Record<string, any>>({
      path: `/contacts`,
      method: "POST",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get a contact by ID with all relationships
   *
   * @tags Contacts
   * @name ContactsDetail
   * @summary Get contact
   * @request GET:/contacts/{id}
   * @secure
   * @response `200` `DomainContactDTO` OK
   * @response `400` `Record<string,any>` Bad Request
   * @response `404` `Record<string,any>` Not Found
   */
  contactsDetail = (
    { id, ...query }: ContactsDetailParams,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainContactDTO, Record<string, any>>({
      path: `/contacts/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Update an existing contact
   *
   * @tags Contacts
   * @name ContactsUpdate
   * @summary Update contact
   * @request PUT:/contacts/{id}
   * @secure
   * @response `200` `DomainContactDTO` OK
   * @response `400` `Record<string,any>` Bad Request
   * @response `404` `Record<string,any>` Not Found
   * @response `500` `Record<string,any>` Internal Server Error
   */
  contactsUpdate = (
    { id, ...query }: ContactsUpdateParams,
    request: DomainUpdateContactRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainContactDTO, Record<string, any>>({
      path: `/contacts/${id}`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Delete a contact
   *
   * @tags Contacts
   * @name ContactsDelete
   * @summary Delete contact
   * @request DELETE:/contacts/{id}
   * @secure
   * @response `204` `void` No Content
   * @response `400` `Record<string,any>` Bad Request
   * @response `404` `Record<string,any>` Not Found
   * @response `500` `Record<string,any>` Internal Server Error
   */
  contactsDelete = (
    { id, ...query }: ContactsDeleteParams,
    params: RequestParams = {},
  ) =>
    this.http.request<void, Record<string, any>>({
      path: `/contacts/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Add a relationship between a contact and an entity (customer, deal, or project)
   *
   * @tags Contacts
   * @name RelationshipsCreate
   * @summary Add relationship
   * @request POST:/contacts/{id}/relationships
   * @secure
   * @response `201` `DomainContactRelationshipDTO` Created
   * @response `400` `Record<string,any>` Bad Request
   * @response `404` `Record<string,any>` Not Found
   * @response `409` `Record<string,any>` Conflict
   * @response `500` `Record<string,any>` Internal Server Error
   */
  relationshipsCreate = (
    { id, ...query }: RelationshipsCreateParams,
    request: DomainAddContactRelationshipRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainContactRelationshipDTO, Record<string, any>>({
      path: `/contacts/${id}/relationships`,
      method: "POST",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Remove a relationship between a contact and an entity
   *
   * @tags Contacts
   * @name RelationshipsDelete
   * @summary Remove relationship
   * @request DELETE:/contacts/{id}/relationships/{relationshipId}
   * @secure
   * @response `204` `void` No Content
   * @response `400` `Record<string,any>` Bad Request
   * @response `404` `Record<string,any>` Not Found
   * @response `500` `Record<string,any>` Internal Server Error
   */
  relationshipsDelete = (
    { id, relationshipId, ...query }: RelationshipsDeleteParams,
    params: RequestParams = {},
  ) =>
    this.http.request<void, Record<string, any>>({
      path: `/contacts/${id}/relationships/${relationshipId}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Get all contacts related to a specific entity (customer, deal, or project)
   *
   * @tags Contacts
   * @name ContactsList2
   * @summary Get contacts for entity
   * @request GET:/{entityType}/{id}/contacts
   * @originalName contactsList
   * @duplicate
   * @secure
   * @response `200` `(DomainContactDTO)[]` OK
   * @response `400` `Record<string,any>` Bad Request
   * @response `500` `Record<string,any>` Internal Server Error
   */
  contactsList2 = (
    { entityType, id, ...query }: ContactsList2Params,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainContactDTO[], Record<string, any>>({
      path: `/${entityType}/${id}/contacts`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
