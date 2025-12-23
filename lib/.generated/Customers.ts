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
  AddressUpdateParams,
  CityUpdateParams,
  CompanyUpdateParams,
  ContactInfoUpdateParams,
  ContactsCreateParams1,
  ContactsListParams2,
  CreditLimitUpdateParams,
  CustomerClassUpdateParams,
  CustomersDeleteParams,
  CustomersDetailParams,
  CustomersListParams,
  CustomersUpdateParams,
  DomainContactDTO,
  DomainCreateContactRequest,
  DomainCreateCustomerRequest,
  DomainCustomerDTO,
  DomainCustomerERPDifferencesResponse,
  DomainCustomerWithDetailsDTO,
  DomainErrorResponse,
  DomainFuzzyCustomerSearchResponse,
  DomainOfferDTO,
  DomainPaginatedResponse,
  DomainProjectDTO,
  DomainUpdateCustomerAddressRequest,
  DomainUpdateCustomerCityRequest,
  DomainUpdateCustomerClassRequest,
  DomainUpdateCustomerCompanyRequest,
  DomainUpdateCustomerContactInfoRequest,
  DomainUpdateCustomerCreditLimitRequest,
  DomainUpdateCustomerIndustryRequest,
  DomainUpdateCustomerIsInternalRequest,
  DomainUpdateCustomerNotesRequest,
  DomainUpdateCustomerPostalCodeRequest,
  DomainUpdateCustomerRequest,
  DomainUpdateCustomerStatusRequest,
  DomainUpdateCustomerTierRequest,
  DomainUpdateCustomerWebsiteRequest,
  IndustryUpdateParams,
  IsInternalUpdateParams,
  NotesUpdateParams,
  OffersListParams,
  PostalCodeUpdateParams,
  ProjectsListParams,
  SearchListParams,
  StatusUpdateParams,
  TierUpdateParams,
  WebsiteUpdateParams,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Customers<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
 * @description Get paginated list of customers with optional filters
 *
 * @tags Customers
 * @name CustomersList
 * @summary List customers
 * @request GET:/customers
 * @secure
 * @response `200` `(DomainPaginatedResponse & {
    data?: (DomainCustomerDTO)[],

})` OK
 * @response `400` `DomainErrorResponse` Bad Request
 * @response `401` `DomainErrorResponse` Unauthorized
 * @response `500` `DomainErrorResponse` Internal Server Error
 */
  customersList = (query: CustomersListParams, params: RequestParams = {}) =>
    this.http.request<
      DomainPaginatedResponse & {
        data?: DomainCustomerDTO[];
      },
      DomainErrorResponse
    >({
      path: `/customers`,
      method: "GET",
      query: query,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Create a new customer
   *
   * @tags Customers
   * @name CustomersCreate
   * @summary Create customer
   * @request POST:/customers
   * @secure
   * @response `201` `DomainCustomerDTO` Created
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `409` `DomainErrorResponse` Duplicate organization number
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  customersCreate = (
    request: DomainCreateCustomerRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainCustomerDTO, DomainErrorResponse>({
      path: `/customers`,
      method: "POST",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Compare customers in the ERP data warehouse with customers in our database. Returns customers that exist in ERP but not in our local database, and customers that exist locally but not in ERP. For organizations, matching is done by organization number. For private persons (no org number), matching is done by name.
   *
   * @tags Customers
   * @name ErpDifferencesList
   * @summary Get differences between ERP and local customers
   * @request GET:/customers/erp-differences
   * @secure
   * @response `200` `DomainCustomerERPDifferencesResponse` OK
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  erpDifferencesList = (params: RequestParams = {}) =>
    this.http.request<
      DomainCustomerERPDifferencesResponse,
      DomainErrorResponse
    >({
      path: `/customers/erp-differences`,
      method: "GET",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Find the single best matching customer for a query using fuzzy matching (handles typos, abbreviations, partial matches). Use q=all to get all customers. Returns minimal customer data (id and name only). Also supports email domain matching (e.g., 'hauk@straye.no' matches 'Straye').
   *
   * @tags Customers
   * @name SearchList
   * @summary Fuzzy search for best matching customer
   * @request GET:/customers/search
   * @response `200` `DomainFuzzyCustomerSearchResponse` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  searchList = (query: SearchListParams, params: RequestParams = {}) =>
    this.http.request<DomainFuzzyCustomerSearchResponse, DomainErrorResponse>({
      path: `/customers/search`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get a customer with full details including stats, contacts, active deals, and projects
   *
   * @tags Customers
   * @name CustomersDetail
   * @summary Get customer by ID
   * @request GET:/customers/{id}
   * @secure
   * @response `200` `DomainCustomerWithDetailsDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   */
  customersDetail = (
    { id, ...query }: CustomersDetailParams,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainCustomerWithDetailsDTO, DomainErrorResponse>({
      path: `/customers/${id}`,
      method: "GET",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update an existing customer
   *
   * @tags Customers
   * @name CustomersUpdate
   * @summary Update customer
   * @request PUT:/customers/{id}
   * @secure
   * @response `200` `DomainCustomerDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `409` `DomainErrorResponse` Duplicate organization number
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  customersUpdate = (
    { id, ...query }: CustomersUpdateParams,
    request: DomainUpdateCustomerRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainCustomerDTO, DomainErrorResponse>({
      path: `/customers/${id}`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Soft delete a customer. The customer is hidden from lists but preserved for historical reference. Related projects and offers keep their customer reference.
   *
   * @tags Customers
   * @name CustomersDelete
   * @summary Delete customer
   * @request DELETE:/customers/{id}
   * @secure
   * @response `204` `void` No Content
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  customersDelete = (
    { id, ...query }: CustomersDeleteParams,
    params: RequestParams = {},
  ) =>
    this.http.request<void, DomainErrorResponse>({
      path: `/customers/${id}`,
      method: "DELETE",
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Update the address fields of a customer
   *
   * @tags Customers
   * @name AddressUpdate
   * @summary Update customer address
   * @request PUT:/customers/{id}/address
   * @secure
   * @response `200` `DomainCustomerDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  addressUpdate = (
    { id, ...query }: AddressUpdateParams,
    request: DomainUpdateCustomerAddressRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainCustomerDTO, DomainErrorResponse>({
      path: `/customers/${id}/address`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update only the city of a customer
   *
   * @tags Customers
   * @name CityUpdate
   * @summary Update customer city
   * @request PUT:/customers/{id}/city
   * @secure
   * @response `200` `DomainCustomerDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  cityUpdate = (
    { id, ...query }: CityUpdateParams,
    request: DomainUpdateCustomerCityRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainCustomerDTO, DomainErrorResponse>({
      path: `/customers/${id}/city`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Assign or unassign a customer to/from a company
   *
   * @tags Customers
   * @name CompanyUpdate
   * @summary Update customer company assignment
   * @request PUT:/customers/{id}/company
   * @secure
   * @response `200` `DomainCustomerDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  companyUpdate = (
    { id, ...query }: CompanyUpdateParams,
    request: DomainUpdateCustomerCompanyRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainCustomerDTO, DomainErrorResponse>({
      path: `/customers/${id}/company`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update the contact person, email, and phone of a customer
   *
   * @tags Customers
   * @name ContactInfoUpdate
   * @summary Update customer contact information
   * @request PUT:/customers/{id}/contact-info
   * @secure
   * @response `200` `DomainCustomerDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  contactInfoUpdate = (
    { id, ...query }: ContactInfoUpdateParams,
    request: DomainUpdateCustomerContactInfoRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainCustomerDTO, DomainErrorResponse>({
      path: `/customers/${id}/contact-info`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get all contacts associated with a customer
   *
   * @tags Customers
   * @name ContactsList
   * @summary List customer contacts
   * @request GET:/customers/{id}/contacts
   * @secure
   * @response `200` `(DomainContactDTO)[]` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   */
  contactsList = (
    { id, ...query }: ContactsListParams2,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainContactDTO[], DomainErrorResponse>({
      path: `/customers/${id}/contacts`,
      method: "GET",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Create a new contact and associate it with the specified customer
   *
   * @tags Customers
   * @name ContactsCreate
   * @summary Create contact for customer
   * @request POST:/customers/{id}/contacts
   * @secure
   * @response `201` `DomainContactDTO` Created
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  contactsCreate = (
    { id, ...query }: ContactsCreateParams1,
    request: DomainCreateContactRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainContactDTO, DomainErrorResponse>({
      path: `/customers/${id}/contacts`,
      method: "POST",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update only the credit limit of a customer
   *
   * @tags Customers
   * @name CreditLimitUpdate
   * @summary Update customer credit limit
   * @request PUT:/customers/{id}/credit-limit
   * @secure
   * @response `200` `DomainCustomerDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  creditLimitUpdate = (
    { id, ...query }: CreditLimitUpdateParams,
    request: DomainUpdateCustomerCreditLimitRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainCustomerDTO, DomainErrorResponse>({
      path: `/customers/${id}/credit-limit`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update only the customer class
   *
   * @tags Customers
   * @name CustomerClassUpdate
   * @summary Update customer class
   * @request PUT:/customers/{id}/customer-class
   * @secure
   * @response `200` `DomainCustomerDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  customerClassUpdate = (
    { id, ...query }: CustomerClassUpdateParams,
    request: DomainUpdateCustomerClassRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainCustomerDTO, DomainErrorResponse>({
      path: `/customers/${id}/customer-class`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update only the industry of a customer
   *
   * @tags Customers
   * @name IndustryUpdate
   * @summary Update customer industry
   * @request PUT:/customers/{id}/industry
   * @secure
   * @response `200` `DomainCustomerDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  industryUpdate = (
    { id, ...query }: IndustryUpdateParams,
    request: DomainUpdateCustomerIndustryRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainCustomerDTO, DomainErrorResponse>({
      path: `/customers/${id}/industry`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update the internal flag of a customer
   *
   * @tags Customers
   * @name IsInternalUpdate
   * @summary Update customer internal flag
   * @request PUT:/customers/{id}/is-internal
   * @secure
   * @response `200` `DomainCustomerDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  isInternalUpdate = (
    { id, ...query }: IsInternalUpdateParams,
    request: DomainUpdateCustomerIsInternalRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainCustomerDTO, DomainErrorResponse>({
      path: `/customers/${id}/is-internal`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update only the notes of a customer
   *
   * @tags Customers
   * @name NotesUpdate
   * @summary Update customer notes
   * @request PUT:/customers/{id}/notes
   * @secure
   * @response `200` `DomainCustomerDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  notesUpdate = (
    { id, ...query }: NotesUpdateParams,
    request: DomainUpdateCustomerNotesRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainCustomerDTO, DomainErrorResponse>({
      path: `/customers/${id}/notes`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
 * @description Get paginated list of offers associated with a customer
 *
 * @tags Customers
 * @name OffersList
 * @summary List offers for a customer
 * @request GET:/customers/{id}/offers
 * @secure
 * @response `200` `(DomainPaginatedResponse & {
    data?: (DomainOfferDTO)[],

})` OK
 * @response `400` `DomainErrorResponse` Bad Request
 * @response `401` `DomainErrorResponse` Unauthorized
 * @response `500` `DomainErrorResponse` Internal Server Error
 */
  offersList = (
    { id, ...query }: OffersListParams,
    params: RequestParams = {},
  ) =>
    this.http.request<
      DomainPaginatedResponse & {
        data?: DomainOfferDTO[];
      },
      DomainErrorResponse
    >({
      path: `/customers/${id}/offers`,
      method: "GET",
      query: query,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update only the postal code of a customer
   *
   * @tags Customers
   * @name PostalCodeUpdate
   * @summary Update customer postal code
   * @request PUT:/customers/{id}/postal-code
   * @secure
   * @response `200` `DomainCustomerDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  postalCodeUpdate = (
    { id, ...query }: PostalCodeUpdateParams,
    request: DomainUpdateCustomerPostalCodeRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainCustomerDTO, DomainErrorResponse>({
      path: `/customers/${id}/postal-code`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
 * @description Get paginated list of projects associated with a customer
 *
 * @tags Customers
 * @name ProjectsList
 * @summary List projects for a customer
 * @request GET:/customers/{id}/projects
 * @secure
 * @response `200` `(DomainPaginatedResponse & {
    data?: (DomainProjectDTO)[],

})` OK
 * @response `400` `DomainErrorResponse` Bad Request
 * @response `401` `DomainErrorResponse` Unauthorized
 * @response `500` `DomainErrorResponse` Internal Server Error
 */
  projectsList = (
    { id, ...query }: ProjectsListParams,
    params: RequestParams = {},
  ) =>
    this.http.request<
      DomainPaginatedResponse & {
        data?: DomainProjectDTO[];
      },
      DomainErrorResponse
    >({
      path: `/customers/${id}/projects`,
      method: "GET",
      query: query,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update only the status of a customer
   *
   * @tags Customers
   * @name StatusUpdate
   * @summary Update customer status
   * @request PUT:/customers/{id}/status
   * @secure
   * @response `200` `DomainCustomerDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  statusUpdate = (
    { id, ...query }: StatusUpdateParams,
    request: DomainUpdateCustomerStatusRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainCustomerDTO, DomainErrorResponse>({
      path: `/customers/${id}/status`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update only the tier of a customer
   *
   * @tags Customers
   * @name TierUpdate
   * @summary Update customer tier
   * @request PUT:/customers/{id}/tier
   * @secure
   * @response `200` `DomainCustomerDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  tierUpdate = (
    { id, ...query }: TierUpdateParams,
    request: DomainUpdateCustomerTierRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainCustomerDTO, DomainErrorResponse>({
      path: `/customers/${id}/tier`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update only the website URL of a customer
   *
   * @tags Customers
   * @name WebsiteUpdate
   * @summary Update customer website
   * @request PUT:/customers/{id}/website
   * @secure
   * @response `200` `DomainCustomerDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  websiteUpdate = (
    { id, ...query }: WebsiteUpdateParams,
    request: DomainUpdateCustomerWebsiteRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainCustomerDTO, DomainErrorResponse>({
      path: `/customers/${id}/website`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
