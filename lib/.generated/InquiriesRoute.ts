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
  DomainConvertInquiryRequest,
  DomainConvertInquiryResponse,
  DomainCreateInquiryRequest,
  DomainOfferDTO,
  DomainPaginatedResponse,
} from "./data-contracts";

export namespace Inquiries {
  /**
   * @description Returns a paginated list of inquiries (offers in draft phase)
   * @tags Inquiries
   * @name InquiriesList
   * @summary List inquiries
   * @request GET:/inquiries
   * @secure
   * @response `200` `DomainPaginatedResponse` OK
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace InquiriesList {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Page number
       * @default 1
       */
      page?: number;
      /**
       * Page size
       * @default 20
       */
      pageSize?: number;
      /** Filter by customer ID */
      customerId?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainPaginatedResponse;
  }

  /**
   * @description Creates a new inquiry (offer in draft phase with minimal required fields)
   * @tags Inquiries
   * @name InquiriesCreate
   * @summary Create inquiry
   * @request POST:/inquiries
   * @secure
   * @response `201` `DomainOfferDTO` Created
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `404` `DomainErrorResponse` Customer not found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace InquiriesCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DomainCreateInquiryRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Returns a specific inquiry by ID
   * @tags Inquiries
   * @name InquiriesDetail
   * @summary Get inquiry
   * @request GET:/inquiries/{id}
   * @secure
   * @response `200` `DomainOfferDTO` OK
   * @response `400` `DomainErrorResponse` Invalid ID
   * @response `404` `DomainErrorResponse` Inquiry not found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace InquiriesDetail {
    export type RequestParams = {
      /** Inquiry ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainOfferDTO;
  }

  /**
   * @description Deletes an inquiry by ID
   * @tags Inquiries
   * @name InquiriesDelete
   * @summary Delete inquiry
   * @request DELETE:/inquiries/{id}
   * @secure
   * @response `204` `void` No Content
   * @response `400` `DomainErrorResponse` Invalid ID or not an inquiry
   * @response `404` `DomainErrorResponse` Inquiry not found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace InquiriesDelete {
    export type RequestParams = {
      /** Inquiry ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Converts an inquiry to an offer (phase=in_progress), generating an offer number
   * @tags Inquiries
   * @name ConvertCreate
   * @summary Convert inquiry to offer
   * @request POST:/inquiries/{id}/convert
   * @secure
   * @response `200` `DomainConvertInquiryResponse` OK
   * @response `400` `DomainErrorResponse` Invalid ID, not an inquiry, or missing conversion data
   * @response `404` `DomainErrorResponse` Inquiry not found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace ConvertCreate {
    export type RequestParams = {
      /** Inquiry ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainConvertInquiryRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainConvertInquiryResponse;
  }
}
