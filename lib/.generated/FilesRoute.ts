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
  DomainFileDTO,
  FilesCreate2Payload,
  FilesCreate3Payload,
  FilesCreate4Payload,
  FilesCreatePayload,
  SuppliersFilesCreatePayload,
} from "./data-contracts";

export namespace Files {
  /**
   * @description Get all files attached to a customer
   * @tags Files
   * @name FilesList
   * @summary List customer files
   * @request GET:/customers/{id}/files
   * @secure
   * @response `200` `(DomainFileDTO)[]` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  export namespace FilesList {
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
    export type ResponseBody = DomainFileDTO[];
  }

  /**
   * @description Upload a file and attach it to a customer. Company is determined from the X-Company-Id header.
   * @tags Files
   * @name FilesCreate
   * @summary Upload file to customer
   * @request POST:/customers/{id}/files
   * @secure
   * @response `201` `DomainFileDTO` Created
   * @response `400` `DomainAPIError` Missing company context or invalid request
   * @response `404` `DomainAPIError` Not Found
   * @response `413` `DomainAPIError` Request Entity Too Large
   * @response `500` `DomainAPIError` Internal Server Error
   */
  export namespace FilesCreate {
    export type RequestParams = {
      /**
       * Customer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = FilesCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = DomainFileDTO;
  }

  /**
   * @description Get file metadata by ID
   * @tags Files
   * @name FilesDetail
   * @summary Get file metadata
   * @request GET:/files/{id}
   * @secure
   * @response `200` `DomainFileDTO` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `404` `DomainAPIError` Not Found
   */
  export namespace FilesDetail {
    export type RequestParams = {
      /**
       * File ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainFileDTO;
  }

  /**
   * @description Delete a file from both storage and database
   * @tags Files
   * @name FilesDelete
   * @summary Delete file
   * @request DELETE:/files/{id}
   * @secure
   * @response `204` `void` No Content
   * @response `400` `DomainAPIError` Bad Request
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  export namespace FilesDelete {
    export type RequestParams = {
      /**
       * File ID
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
   * @description Download file content by ID
   * @tags Files
   * @name DownloadList
   * @summary Download file
   * @request GET:/files/{id}/download
   * @secure
   * @response `200` `void` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `404` `DomainAPIError` Not Found
   */
  export namespace DownloadList {
    export type RequestParams = {
      /**
       * File ID
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
   * @description Get all files attached to an offer
   * @tags Files
   * @name FilesList2
   * @summary List offer files
   * @request GET:/offers/{id}/files
   * @originalName filesList
   * @duplicate
   * @secure
   * @response `200` `(DomainFileDTO)[]` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  export namespace FilesList2 {
    export type RequestParams = {
      /**
       * Offer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainFileDTO[];
  }

  /**
   * @description Upload a file and attach it to an offer. Company is determined from the X-Company-Id header.
   * @tags Files
   * @name FilesCreate2
   * @summary Upload file to offer
   * @request POST:/offers/{id}/files
   * @originalName filesCreate
   * @duplicate
   * @secure
   * @response `201` `DomainFileDTO` Created
   * @response `400` `DomainAPIError` Missing company context or invalid request
   * @response `404` `DomainAPIError` Not Found
   * @response `413` `DomainAPIError` Request Entity Too Large
   * @response `500` `DomainAPIError` Internal Server Error
   */
  export namespace FilesCreate2 {
    export type RequestParams = {
      /**
       * Offer ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = FilesCreate2Payload;
    export type RequestHeaders = {};
    export type ResponseBody = DomainFileDTO;
  }

  /**
   * @description Get all files attached to a specific supplier within an offer
   * @tags Files
   * @name SuppliersFilesList
   * @summary List offer-supplier files
   * @request GET:/offers/{offerId}/suppliers/{supplierId}/files
   * @secure
   * @response `200` `(DomainFileDTO)[]` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  export namespace SuppliersFilesList {
    export type RequestParams = {
      /**
       * Offer ID
       * @format uuid
       */
      offerId: string;
      /**
       * Supplier ID
       * @format uuid
       */
      supplierId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainFileDTO[];
  }

  /**
   * @description Upload a file and attach it to a specific supplier within an offer. Company is determined from the X-Company-Id header.
   * @tags Files
   * @name SuppliersFilesCreate
   * @summary Upload file to offer-supplier relationship
   * @request POST:/offers/{offerId}/suppliers/{supplierId}/files
   * @secure
   * @response `201` `DomainFileDTO` Created
   * @response `400` `DomainAPIError` Missing company context or invalid request
   * @response `404` `DomainAPIError` Not Found
   * @response `413` `DomainAPIError` Request Entity Too Large
   * @response `500` `DomainAPIError` Internal Server Error
   */
  export namespace SuppliersFilesCreate {
    export type RequestParams = {
      /**
       * Offer ID
       * @format uuid
       */
      offerId: string;
      /**
       * Supplier ID
       * @format uuid
       */
      supplierId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = SuppliersFilesCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = DomainFileDTO;
  }

  /**
   * @description Get all files attached to a project
   * @tags Files
   * @name FilesList3
   * @summary List project files
   * @request GET:/projects/{id}/files
   * @originalName filesList
   * @duplicate
   * @secure
   * @response `200` `(DomainFileDTO)[]` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  export namespace FilesList3 {
    export type RequestParams = {
      /**
       * Project ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainFileDTO[];
  }

  /**
   * @description Upload a file and attach it to a project. Company is determined from the X-Company-Id header.
   * @tags Files
   * @name FilesCreate3
   * @summary Upload file to project
   * @request POST:/projects/{id}/files
   * @originalName filesCreate
   * @duplicate
   * @secure
   * @response `201` `DomainFileDTO` Created
   * @response `400` `DomainAPIError` Missing company context or invalid request
   * @response `404` `DomainAPIError` Not Found
   * @response `413` `DomainAPIError` Request Entity Too Large
   * @response `500` `DomainAPIError` Internal Server Error
   */
  export namespace FilesCreate3 {
    export type RequestParams = {
      /**
       * Project ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = FilesCreate3Payload;
    export type RequestHeaders = {};
    export type ResponseBody = DomainFileDTO;
  }

  /**
   * @description Get all files attached to a supplier
   * @tags Files
   * @name FilesList4
   * @summary List supplier files
   * @request GET:/suppliers/{id}/files
   * @originalName filesList
   * @duplicate
   * @secure
   * @response `200` `(DomainFileDTO)[]` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  export namespace FilesList4 {
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
    export type ResponseBody = DomainFileDTO[];
  }

  /**
   * @description Upload a file and attach it to a supplier. Company is determined from the X-Company-Id header.
   * @tags Files
   * @name FilesCreate4
   * @summary Upload file to supplier
   * @request POST:/suppliers/{id}/files
   * @originalName filesCreate
   * @duplicate
   * @secure
   * @response `201` `DomainFileDTO` Created
   * @response `400` `DomainAPIError` Missing company context or invalid request
   * @response `404` `DomainAPIError` Not Found
   * @response `413` `DomainAPIError` Request Entity Too Large
   * @response `500` `DomainAPIError` Internal Server Error
   */
  export namespace FilesCreate4 {
    export type RequestParams = {
      /**
       * Supplier ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = FilesCreate4Payload;
    export type RequestHeaders = {};
    export type ResponseBody = DomainFileDTO;
  }
}
