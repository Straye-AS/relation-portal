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
  CustomersListParams1IndustryEnum,
  CustomersListParams1SortByEnum,
  CustomersListParams1SortOrderEnum,
  CustomersListParams1StatusEnum,
  CustomersListParams1TierEnum,
  DomainContactDTO,
  DomainCreateContactRequest,
  DomainCreateCustomerRequest,
  DomainCustomerDTO,
  DomainCustomerERPDifferencesResponse,
  DomainCustomerWithDetailsDTO,
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
  OffersListParams1PhaseEnum,
  OffersListParams1SortByEnum,
  OffersListParams1SortOrderEnum,
  ProjectsListParams1PhaseEnum,
  ProjectsListParams1SortByEnum,
  ProjectsListParams1SortOrderEnum,
} from "./data-contracts";

export namespace Customers {
  /**
 * @description Get paginated list of customers with optional filters
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
  export namespace CustomersList {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Page number
       * @default 1
       */
      page?: number;
      /**
       * Items per page (max 200)
       * @default 20
       */
      pageSize?: number;
      /** Search by name or organization number */
      search?: string;
      /** Filter by city */
      city?: string;
      /** Filter by country */
      country?: string;
      /** Filter by status */
      status?: CustomersListParams1StatusEnum;
      /** Filter by tier */
      tier?: CustomersListParams1TierEnum;
      /** Filter by industry */
      industry?: CustomersListParams1IndustryEnum;
      /** Sort field */
      sortBy?: CustomersListParams1SortByEnum;
      /**
       * Sort order
       * @default "desc"
       */
      sortOrder?: CustomersListParams1SortOrderEnum;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainPaginatedResponse & {
      data?: DomainCustomerDTO[];
    };
  }

  /**
   * @description Create a new customer
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
  export namespace CustomersCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DomainCreateCustomerRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainCustomerDTO;
  }

  /**
   * @description Compare customers in the ERP data warehouse with customers in our database. Returns customers that exist in ERP but not in our local database, and customers that exist locally but not in ERP. For organizations, matching is done by organization number. For private persons (no org number), matching is done by name.
   * @tags Customers
   * @name ErpDifferencesList
   * @summary Get differences between ERP and local customers
   * @request GET:/customers/erp-differences
   * @secure
   * @response `200` `DomainCustomerERPDifferencesResponse` OK
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace ErpDifferencesList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainCustomerERPDifferencesResponse;
  }

  /**
   * @description Find the single best matching customer for a query using fuzzy matching (handles typos, abbreviations, partial matches). Use q=all to get all customers. Returns minimal customer data (id and name only). Also supports email domain matching (e.g., 'hauk@straye.no' matches 'Straye').
   * @tags Customers
   * @name SearchList
   * @summary Fuzzy search for best matching customer
   * @request GET:/customers/search
   * @response `200` `DomainFuzzyCustomerSearchResponse` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace SearchList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search query (e.g., 'AF', 'NTN', 'Veidikke', 'all' for all customers, or email like 'user@company.no') */
      q: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainFuzzyCustomerSearchResponse;
  }

  /**
   * @description Get a customer with full details including stats, contacts, active deals, and projects
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
  export namespace CustomersDetail {
    export type RequestParams = {
      /**
       * Customer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainCustomerWithDetailsDTO;
  }

  /**
   * @description Update an existing customer
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
  export namespace CustomersUpdate {
    export type RequestParams = {
      /**
       * Customer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateCustomerRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainCustomerDTO;
  }

  /**
   * @description Soft delete a customer. The customer is hidden from lists but preserved for historical reference. Related projects and offers keep their customer reference.
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
  export namespace CustomersDelete {
    export type RequestParams = {
      /**
       * Customer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Update the address fields of a customer
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
  export namespace AddressUpdate {
    export type RequestParams = {
      /**
       * Customer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateCustomerAddressRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainCustomerDTO;
  }

  /**
   * @description Update only the city of a customer
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
  export namespace CityUpdate {
    export type RequestParams = {
      /**
       * Customer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateCustomerCityRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainCustomerDTO;
  }

  /**
   * @description Assign or unassign a customer to/from a company
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
  export namespace CompanyUpdate {
    export type RequestParams = {
      /**
       * Customer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateCustomerCompanyRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainCustomerDTO;
  }

  /**
   * @description Update the contact person, email, and phone of a customer
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
  export namespace ContactInfoUpdate {
    export type RequestParams = {
      /**
       * Customer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateCustomerContactInfoRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainCustomerDTO;
  }

  /**
   * @description Get all contacts associated with a customer
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
  export namespace ContactsList {
    export type RequestParams = {
      /**
       * Customer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainContactDTO[];
  }

  /**
   * @description Create a new contact and associate it with the specified customer
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
  export namespace ContactsCreate {
    export type RequestParams = {
      /**
       * Customer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainCreateContactRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainContactDTO;
  }

  /**
   * @description Update only the credit limit of a customer
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
  export namespace CreditLimitUpdate {
    export type RequestParams = {
      /**
       * Customer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateCustomerCreditLimitRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainCustomerDTO;
  }

  /**
   * @description Update only the customer class
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
  export namespace CustomerClassUpdate {
    export type RequestParams = {
      /**
       * Customer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateCustomerClassRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainCustomerDTO;
  }

  /**
   * @description Update only the industry of a customer
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
  export namespace IndustryUpdate {
    export type RequestParams = {
      /**
       * Customer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateCustomerIndustryRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainCustomerDTO;
  }

  /**
   * @description Update the internal flag of a customer
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
  export namespace IsInternalUpdate {
    export type RequestParams = {
      /**
       * Customer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateCustomerIsInternalRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainCustomerDTO;
  }

  /**
   * @description Update only the notes of a customer
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
  export namespace NotesUpdate {
    export type RequestParams = {
      /**
       * Customer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateCustomerNotesRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainCustomerDTO;
  }

  /**
 * @description Get paginated list of offers associated with a customer
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
  export namespace OffersList {
    export type RequestParams = {
      /**
       * Customer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {
      /**
       * Page number
       * @default 1
       */
      page?: number;
      /**
       * Items per page (max 200)
       * @default 20
       */
      pageSize?: number;
      /** Filter by phase */
      phase?: OffersListParams1PhaseEnum;
      /** Sort field */
      sortBy?: OffersListParams1SortByEnum;
      /**
       * Sort order
       * @default "desc"
       */
      sortOrder?: OffersListParams1SortOrderEnum;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainPaginatedResponse & {
      data?: DomainOfferDTO[];
    };
  }

  /**
   * @description Update only the postal code of a customer
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
  export namespace PostalCodeUpdate {
    export type RequestParams = {
      /**
       * Customer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateCustomerPostalCodeRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainCustomerDTO;
  }

  /**
 * @description Get paginated list of projects associated with a customer
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
  export namespace ProjectsList {
    export type RequestParams = {
      /**
       * Customer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {
      /**
       * Page number
       * @default 1
       */
      page?: number;
      /**
       * Items per page (max 200)
       * @default 20
       */
      pageSize?: number;
      /** Filter by phase */
      phase?: ProjectsListParams1PhaseEnum;
      /** Sort field */
      sortBy?: ProjectsListParams1SortByEnum;
      /**
       * Sort order
       * @default "desc"
       */
      sortOrder?: ProjectsListParams1SortOrderEnum;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainPaginatedResponse & {
      data?: DomainProjectDTO[];
    };
  }

  /**
   * @description Update only the status of a customer
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
  export namespace StatusUpdate {
    export type RequestParams = {
      /**
       * Customer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateCustomerStatusRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainCustomerDTO;
  }

  /**
   * @description Update only the tier of a customer
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
  export namespace TierUpdate {
    export type RequestParams = {
      /**
       * Customer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateCustomerTierRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainCustomerDTO;
  }

  /**
   * @description Update only the website URL of a customer
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
  export namespace WebsiteUpdate {
    export type RequestParams = {
      /**
       * Customer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateCustomerWebsiteRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainCustomerDTO;
  }
}
