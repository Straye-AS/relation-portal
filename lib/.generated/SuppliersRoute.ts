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
  DomainCreateSupplierContactRequest,
  DomainCreateSupplierRequest,
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
  OffersListParams7PhaseEnum,
  OffersListParams7SortByEnum,
  OffersListParams7SortOrderEnum,
  SuppliersListParams3SortByEnum,
  SuppliersListParams3SortOrderEnum,
  SuppliersListParams3StatusEnum,
} from "./data-contracts";

export namespace Suppliers {
  /**
 * @description Get paginated list of suppliers with optional filters
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
  export namespace SuppliersList {
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
      status?: SuppliersListParams3StatusEnum;
      /** Filter by category */
      category?: string;
      /** Sort field */
      sortBy?: SuppliersListParams3SortByEnum;
      /**
       * Sort order
       * @default "desc"
       */
      sortOrder?: SuppliersListParams3SortOrderEnum;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainPaginatedResponse & {
      data?: DomainSupplierDTO[];
    };
  }

  /**
   * @description Create a new supplier
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
  export namespace SuppliersCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DomainCreateSupplierRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainSupplierDTO;
  }

  /**
   * @description Get a supplier with full details including stats, contacts, and recent offers
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
  export namespace SuppliersDetail {
    export type RequestParams = {
      /**
       * Supplier ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainSupplierWithDetailsDTO;
  }

  /**
   * @description Update an existing supplier
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
  export namespace SuppliersUpdate {
    export type RequestParams = {
      /**
       * Supplier ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateSupplierRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainSupplierDTO;
  }

  /**
   * @description Soft delete a supplier. The supplier is hidden from lists but preserved for historical reference.
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
  export namespace SuppliersDelete {
    export type RequestParams = {
      /**
       * Supplier ID
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
   * @description Update only the address of a supplier
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
  export namespace AddressUpdate {
    export type RequestParams = {
      /**
       * Supplier ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateSupplierAddressRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainSupplierDTO;
  }

  /**
   * @description Update only the category of a supplier
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
  export namespace CategoryUpdate {
    export type RequestParams = {
      /**
       * Supplier ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateSupplierCategoryRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainSupplierDTO;
  }

  /**
   * @description Update only the city of a supplier
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
  export namespace CityUpdate {
    export type RequestParams = {
      /**
       * Supplier ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateSupplierCityRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainSupplierDTO;
  }

  /**
   * @description Get all contact persons for a supplier
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
  export namespace ContactsList {
    export type RequestParams = {
      /**
       * Supplier ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainSupplierContactDTO[];
  }

  /**
   * @description Create a new contact person for a supplier
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
  export namespace ContactsCreate {
    export type RequestParams = {
      /**
       * Supplier ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainCreateSupplierContactRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainSupplierContactDTO;
  }

  /**
   * @description Get a specific contact person for a supplier
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
  export namespace ContactsDetail {
    export type RequestParams = {
      /**
       * Supplier ID
       * @format uuid
       */
      id: string;
      /**
       * Contact ID
       * @format uuid
       */
      contactId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainSupplierContactDTO;
  }

  /**
   * @description Update a contact person for a supplier
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
  export namespace ContactsUpdate {
    export type RequestParams = {
      /**
       * Supplier ID
       * @format uuid
       */
      id: string;
      /**
       * Contact ID
       * @format uuid
       */
      contactId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateSupplierContactRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainSupplierContactDTO;
  }

  /**
   * @description Delete a contact person for a supplier
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
  export namespace ContactsDelete {
    export type RequestParams = {
      /**
       * Supplier ID
       * @format uuid
       */
      id: string;
      /**
       * Contact ID
       * @format uuid
       */
      contactId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Update only the email of a supplier
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
  export namespace EmailUpdate {
    export type RequestParams = {
      /**
       * Supplier ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateSupplierEmailRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainSupplierDTO;
  }

  /**
   * @description Update only the notes of a supplier
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
  export namespace NotesUpdate {
    export type RequestParams = {
      /**
       * Supplier ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateSupplierNotesRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainSupplierDTO;
  }

  /**
 * @description Get paginated list of offers associated with a supplier via the offer_suppliers junction table
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
  export namespace OffersList {
    export type RequestParams = {
      /**
       * Supplier ID
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
      phase?: OffersListParams7PhaseEnum;
      /** Sort field */
      sortBy?: OffersListParams7SortByEnum;
      /**
       * Sort order
       * @default "desc"
       */
      sortOrder?: OffersListParams7SortOrderEnum;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainPaginatedResponse & {
      data?: DomainOfferDTO[];
    };
  }

  /**
   * @description Update only the payment terms of a supplier
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
  export namespace PaymentTermsUpdate {
    export type RequestParams = {
      /**
       * Supplier ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateSupplierPaymentTermsRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainSupplierDTO;
  }

  /**
   * @description Update only the phone of a supplier
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
  export namespace PhoneUpdate {
    export type RequestParams = {
      /**
       * Supplier ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateSupplierPhoneRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainSupplierDTO;
  }

  /**
   * @description Update only the postal code of a supplier
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
  export namespace PostalCodeUpdate {
    export type RequestParams = {
      /**
       * Supplier ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateSupplierPostalCodeRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainSupplierDTO;
  }

  /**
   * @description Update only the status of a supplier
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
  export namespace StatusUpdate {
    export type RequestParams = {
      /**
       * Supplier ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateSupplierStatusRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainSupplierDTO;
  }

  /**
   * @description Update only the website of a supplier
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
  export namespace WebsiteUpdate {
    export type RequestParams = {
      /**
       * Supplier ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateSupplierWebsiteRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainSupplierDTO;
  }
}
