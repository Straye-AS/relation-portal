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
  ConvertCreateParams,
  DomainConvertInquiryRequest,
  DomainConvertInquiryResponse,
  DomainCreateInquiryRequest,
  DomainErrorResponse,
  DomainOfferDTO,
  DomainPaginatedResponse,
  InquiriesDeleteParams,
  InquiriesDetailParams,
  InquiriesListParams,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Inquiries<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Returns a paginated list of inquiries (offers in draft phase)
   *
   * @tags Inquiries
   * @name InquiriesList
   * @summary List inquiries
   * @request GET:/inquiries
   * @secure
   * @response `200` `DomainPaginatedResponse` OK
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  inquiriesList = (query: InquiriesListParams, params: RequestParams = {}) =>
    this.http.request<DomainPaginatedResponse, DomainErrorResponse>({
      path: `/inquiries`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Creates a new inquiry (offer in draft phase with minimal required fields)
   *
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
  inquiriesCreate = (
    request: DomainCreateInquiryRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainOfferDTO, DomainErrorResponse>({
      path: `/inquiries`,
      method: "POST",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Returns a specific inquiry by ID
   *
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
  inquiriesDetail = (
    { id, ...query }: InquiriesDetailParams,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainOfferDTO, DomainErrorResponse>({
      path: `/inquiries/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Deletes an inquiry by ID
   *
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
  inquiriesDelete = (
    { id, ...query }: InquiriesDeleteParams,
    params: RequestParams = {},
  ) =>
    this.http.request<void, DomainErrorResponse>({
      path: `/inquiries/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Converts an inquiry to an offer (phase=in_progress), generating an offer number
   *
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
  convertCreate = (
    { id, ...query }: ConvertCreateParams,
    request: DomainConvertInquiryRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainConvertInquiryResponse, DomainErrorResponse>({
      path: `/inquiries/${id}/convert`,
      method: "POST",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
