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
  AddressUpdateParams2,
  CategoryUpdateParams,
  CityUpdateParams2,
  ContactsCreateParams3,
  ContactsDeleteParams2,
  ContactsDetailParams2,
  ContactsListParams4,
  ContactsUpdateParams2,
  DomainCreateSupplierContactRequest,
  DomainCreateSupplierRequest,
  DomainErrorResponse,
  DomainOfferDTO,
  DomainPaginatedResponse,
  DomainSupplierContactDTO,
  DomainSupplierDTO,
  DomainSupplierWithDetailsDTO,
  DomainUpdateSupplierAddressRequest,
  DomainUpdateSupplierCategoryRequest,
  DomainUpdateSupplierCityRequest,
  DomainUpdateSupplierContactRequest,
  DomainUpdateSupplierEmailRequest,
  DomainUpdateSupplierNotesRequest,
  DomainUpdateSupplierPaymentTermsRequest,
  DomainUpdateSupplierPhoneRequest,
  DomainUpdateSupplierPostalCodeRequest,
  DomainUpdateSupplierRequest,
  DomainUpdateSupplierStatusRequest,
  DomainUpdateSupplierWebsiteRequest,
  EmailUpdateParams,
  NotesUpdateParams4,
  OffersListParams6,
  PaymentTermsUpdateParams,
  PhoneUpdateParams,
  PostalCodeUpdateParams2,
  StatusUpdateParams2,
  SuppliersDeleteParams2,
  SuppliersDetailParams,
  SuppliersListParams2,
  SuppliersUpdateParams2,
  WebsiteUpdateParams2,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Suppliers<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
 * @description Get paginated list of suppliers with optional filters
 *
 * @tags Suppliers
 * @name SuppliersList
 * @summary List suppliers
 * @request GET:/suppliers
 * @secure
 * @response `200` `(DomainPaginatedResponse & {
    data?: (DomainSupplierDTO)[],

})` OK
 * @response `400` `DomainErrorResponse` Bad Request
 * @response `401` `DomainErrorResponse` Unauthorized
 * @response `500` `DomainErrorResponse` Internal Server Error
 */
  suppliersList = (query: SuppliersListParams2, params: RequestParams = {}) =>
    this.http.request<
      DomainPaginatedResponse & {
        data?: DomainSupplierDTO[];
      },
      DomainErrorResponse
    >({
      path: `/suppliers`,
      method: "GET",
      query: query,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Create a new supplier
   *
   * @tags Suppliers
   * @name SuppliersCreate
   * @summary Create supplier
   * @request POST:/suppliers
   * @secure
   * @response `201` `DomainSupplierDTO` Created
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `409` `DomainErrorResponse` Duplicate organization number
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  suppliersCreate = (
    request: DomainCreateSupplierRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainSupplierDTO, DomainErrorResponse>({
      path: `/suppliers`,
      method: "POST",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get a supplier with full details including stats, contacts, and recent offers
   *
   * @tags Suppliers
   * @name SuppliersDetail
   * @summary Get supplier by ID
   * @request GET:/suppliers/{id}
   * @secure
   * @response `200` `DomainSupplierWithDetailsDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   */
  suppliersDetail = (
    { id, ...query }: SuppliersDetailParams,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainSupplierWithDetailsDTO, DomainErrorResponse>({
      path: `/suppliers/${id}`,
      method: "GET",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update an existing supplier
   *
   * @tags Suppliers
   * @name SuppliersUpdate
   * @summary Update supplier
   * @request PUT:/suppliers/{id}
   * @secure
   * @response `200` `DomainSupplierDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `409` `DomainErrorResponse` Duplicate organization number
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  suppliersUpdate = (
    { id, ...query }: SuppliersUpdateParams2,
    request: DomainUpdateSupplierRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainSupplierDTO, DomainErrorResponse>({
      path: `/suppliers/${id}`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Soft delete a supplier. The supplier is hidden from lists but preserved for historical reference.
   *
   * @tags Suppliers
   * @name SuppliersDelete
   * @summary Delete supplier
   * @request DELETE:/suppliers/{id}
   * @secure
   * @response `204` `void` No Content
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `409` `DomainErrorResponse` Supplier has active relationships
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  suppliersDelete = (
    { id, ...query }: SuppliersDeleteParams2,
    params: RequestParams = {},
  ) =>
    this.http.request<void, DomainErrorResponse>({
      path: `/suppliers/${id}`,
      method: "DELETE",
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Update only the address of a supplier
   *
   * @tags Suppliers
   * @name AddressUpdate
   * @summary Update supplier address
   * @request PUT:/suppliers/{id}/address
   * @secure
   * @response `200` `DomainSupplierDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  addressUpdate = (
    { id, ...query }: AddressUpdateParams2,
    request: DomainUpdateSupplierAddressRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainSupplierDTO, DomainErrorResponse>({
      path: `/suppliers/${id}/address`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update only the category of a supplier
   *
   * @tags Suppliers
   * @name CategoryUpdate
   * @summary Update supplier category
   * @request PUT:/suppliers/{id}/category
   * @secure
   * @response `200` `DomainSupplierDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  categoryUpdate = (
    { id, ...query }: CategoryUpdateParams,
    request: DomainUpdateSupplierCategoryRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainSupplierDTO, DomainErrorResponse>({
      path: `/suppliers/${id}/category`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update only the city of a supplier
   *
   * @tags Suppliers
   * @name CityUpdate
   * @summary Update supplier city
   * @request PUT:/suppliers/{id}/city
   * @secure
   * @response `200` `DomainSupplierDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  cityUpdate = (
    { id, ...query }: CityUpdateParams2,
    request: DomainUpdateSupplierCityRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainSupplierDTO, DomainErrorResponse>({
      path: `/suppliers/${id}/city`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get all contact persons for a supplier
   *
   * @tags Suppliers
   * @name ContactsList
   * @summary List contacts for a supplier
   * @request GET:/suppliers/{id}/contacts
   * @secure
   * @response `200` `(DomainSupplierContactDTO)[]` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  contactsList = (
    { id, ...query }: ContactsListParams4,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainSupplierContactDTO[], DomainErrorResponse>({
      path: `/suppliers/${id}/contacts`,
      method: "GET",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Create a new contact person for a supplier
   *
   * @tags Suppliers
   * @name ContactsCreate
   * @summary Create a contact for a supplier
   * @request POST:/suppliers/{id}/contacts
   * @secure
   * @response `201` `DomainSupplierContactDTO` Created
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  contactsCreate = (
    { id, ...query }: ContactsCreateParams3,
    request: DomainCreateSupplierContactRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainSupplierContactDTO, DomainErrorResponse>({
      path: `/suppliers/${id}/contacts`,
      method: "POST",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get a specific contact person for a supplier
   *
   * @tags Suppliers
   * @name ContactsDetail
   * @summary Get a supplier contact by ID
   * @request GET:/suppliers/{id}/contacts/{contactId}
   * @secure
   * @response `200` `DomainSupplierContactDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  contactsDetail = (
    { id, contactId, ...query }: ContactsDetailParams2,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainSupplierContactDTO, DomainErrorResponse>({
      path: `/suppliers/${id}/contacts/${contactId}`,
      method: "GET",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update a contact person for a supplier
   *
   * @tags Suppliers
   * @name ContactsUpdate
   * @summary Update a supplier contact
   * @request PUT:/suppliers/{id}/contacts/{contactId}
   * @secure
   * @response `200` `DomainSupplierContactDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  contactsUpdate = (
    { id, contactId, ...query }: ContactsUpdateParams2,
    request: DomainUpdateSupplierContactRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainSupplierContactDTO, DomainErrorResponse>({
      path: `/suppliers/${id}/contacts/${contactId}`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Delete a contact person for a supplier
   *
   * @tags Suppliers
   * @name ContactsDelete
   * @summary Delete a supplier contact
   * @request DELETE:/suppliers/{id}/contacts/{contactId}
   * @secure
   * @response `204` `void` No Content
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `409` `DomainErrorResponse` Contact is assigned to active offers
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  contactsDelete = (
    { id, contactId, ...query }: ContactsDeleteParams2,
    params: RequestParams = {},
  ) =>
    this.http.request<void, DomainErrorResponse>({
      path: `/suppliers/${id}/contacts/${contactId}`,
      method: "DELETE",
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Update only the email of a supplier
   *
   * @tags Suppliers
   * @name EmailUpdate
   * @summary Update supplier email
   * @request PUT:/suppliers/{id}/email
   * @secure
   * @response `200` `DomainSupplierDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  emailUpdate = (
    { id, ...query }: EmailUpdateParams,
    request: DomainUpdateSupplierEmailRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainSupplierDTO, DomainErrorResponse>({
      path: `/suppliers/${id}/email`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update only the notes of a supplier
   *
   * @tags Suppliers
   * @name NotesUpdate
   * @summary Update supplier notes
   * @request PUT:/suppliers/{id}/notes
   * @secure
   * @response `200` `DomainSupplierDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  notesUpdate = (
    { id, ...query }: NotesUpdateParams4,
    request: DomainUpdateSupplierNotesRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainSupplierDTO, DomainErrorResponse>({
      path: `/suppliers/${id}/notes`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
 * @description Get paginated list of offers associated with a supplier via the offer_suppliers junction table
 *
 * @tags Suppliers
 * @name OffersList
 * @summary List offers for a supplier
 * @request GET:/suppliers/{id}/offers
 * @secure
 * @response `200` `(DomainPaginatedResponse & {
    data?: (DomainOfferDTO)[],

})` OK
 * @response `400` `DomainErrorResponse` Bad Request
 * @response `401` `DomainErrorResponse` Unauthorized
 * @response `404` `DomainErrorResponse` Not Found
 * @response `500` `DomainErrorResponse` Internal Server Error
 */
  offersList = (
    { id, ...query }: OffersListParams6,
    params: RequestParams = {},
  ) =>
    this.http.request<
      DomainPaginatedResponse & {
        data?: DomainOfferDTO[];
      },
      DomainErrorResponse
    >({
      path: `/suppliers/${id}/offers`,
      method: "GET",
      query: query,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update only the payment terms of a supplier
   *
   * @tags Suppliers
   * @name PaymentTermsUpdate
   * @summary Update supplier payment terms
   * @request PUT:/suppliers/{id}/payment-terms
   * @secure
   * @response `200` `DomainSupplierDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  paymentTermsUpdate = (
    { id, ...query }: PaymentTermsUpdateParams,
    request: DomainUpdateSupplierPaymentTermsRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainSupplierDTO, DomainErrorResponse>({
      path: `/suppliers/${id}/payment-terms`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update only the phone of a supplier
   *
   * @tags Suppliers
   * @name PhoneUpdate
   * @summary Update supplier phone
   * @request PUT:/suppliers/{id}/phone
   * @secure
   * @response `200` `DomainSupplierDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  phoneUpdate = (
    { id, ...query }: PhoneUpdateParams,
    request: DomainUpdateSupplierPhoneRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainSupplierDTO, DomainErrorResponse>({
      path: `/suppliers/${id}/phone`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update only the postal code of a supplier
   *
   * @tags Suppliers
   * @name PostalCodeUpdate
   * @summary Update supplier postal code
   * @request PUT:/suppliers/{id}/postal-code
   * @secure
   * @response `200` `DomainSupplierDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  postalCodeUpdate = (
    { id, ...query }: PostalCodeUpdateParams2,
    request: DomainUpdateSupplierPostalCodeRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainSupplierDTO, DomainErrorResponse>({
      path: `/suppliers/${id}/postal-code`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update only the status of a supplier
   *
   * @tags Suppliers
   * @name StatusUpdate
   * @summary Update supplier status
   * @request PUT:/suppliers/{id}/status
   * @secure
   * @response `200` `DomainSupplierDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  statusUpdate = (
    { id, ...query }: StatusUpdateParams2,
    request: DomainUpdateSupplierStatusRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainSupplierDTO, DomainErrorResponse>({
      path: `/suppliers/${id}/status`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update only the website of a supplier
   *
   * @tags Suppliers
   * @name WebsiteUpdate
   * @summary Update supplier website
   * @request PUT:/suppliers/{id}/website
   * @secure
   * @response `200` `DomainSupplierDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  websiteUpdate = (
    { id, ...query }: WebsiteUpdateParams2,
    request: DomainUpdateSupplierWebsiteRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainSupplierDTO, DomainErrorResponse>({
      path: `/suppliers/${id}/website`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
