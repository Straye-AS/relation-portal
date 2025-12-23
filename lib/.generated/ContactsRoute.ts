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
  ContactsList2Params1EntityTypeEnum,
  ContactsListParams1ContactTypeEnum,
  ContactsListParams1EntityTypeEnum,
  ContactsListParams1SortByEnum,
  DomainAddContactRelationshipRequest,
  DomainContactDTO,
  DomainContactRelationshipDTO,
  DomainCreateContactRequest,
  DomainPaginatedResponse,
  DomainUpdateContactRequest,
} from "./data-contracts";

export namespace Contacts {
  /**
   * @description Get paginated list of contacts with optional filters
   * @tags Contacts
   * @name ContactsList
   * @summary List contacts
   * @request GET:/contacts
   * @secure
   * @response `200` `DomainPaginatedResponse` OK
   * @response `400` `Record<string,any>` Bad Request
   * @response `500` `Record<string,any>` Internal Server Error
   */
  export namespace ContactsList {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Page number
       * @default 1
       */
      page?: number;
      /**
       * Items per page
       * @default 20
       */
      pageSize?: number;
      /** Search by name or email */
      search?: string;
      /** Filter by job title */
      title?: string;
      /** Filter by contact type */
      contactType?: ContactsListParams1ContactTypeEnum;
      /** Filter by related entity type */
      entityType?: ContactsListParams1EntityTypeEnum;
      /** Filter by related entity ID */
      entityId?: string;
      /** Sort option */
      sortBy?: ContactsListParams1SortByEnum;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainPaginatedResponse;
  }

  /**
   * @description Create a new contact
   * @tags Contacts
   * @name ContactsCreate
   * @summary Create contact
   * @request POST:/contacts
   * @secure
   * @response `201` `DomainContactDTO` Created
   * @response `400` `Record<string,any>` Bad Request
   * @response `500` `Record<string,any>` Internal Server Error
   */
  export namespace ContactsCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DomainCreateContactRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainContactDTO;
  }

  /**
   * @description Get a contact by ID with all relationships
   * @tags Contacts
   * @name ContactsDetail
   * @summary Get contact
   * @request GET:/contacts/{id}
   * @secure
   * @response `200` `DomainContactDTO` OK
   * @response `400` `Record<string,any>` Bad Request
   * @response `404` `Record<string,any>` Not Found
   */
  export namespace ContactsDetail {
    export type RequestParams = {
      /** Contact ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainContactDTO;
  }

  /**
   * @description Update an existing contact
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
  export namespace ContactsUpdate {
    export type RequestParams = {
      /** Contact ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateContactRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainContactDTO;
  }

  /**
   * @description Delete a contact
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
  export namespace ContactsDelete {
    export type RequestParams = {
      /** Contact ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Add a relationship between a contact and an entity (customer, deal, or project)
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
  export namespace RelationshipsCreate {
    export type RequestParams = {
      /** Contact ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainAddContactRelationshipRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainContactRelationshipDTO;
  }

  /**
   * @description Remove a relationship between a contact and an entity
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
  export namespace RelationshipsDelete {
    export type RequestParams = {
      /** Contact ID */
      id: string;
      /** Relationship ID */
      relationshipId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Get all contacts related to a specific entity (customer, deal, or project)
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
  export namespace ContactsList2 {
    export type RequestParams = {
      /** Entity type */
      entityType: ContactsList2Params1EntityTypeEnum;
      /** Entity ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainContactDTO[];
  }
}
