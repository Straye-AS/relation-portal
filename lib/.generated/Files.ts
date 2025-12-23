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
  DomainAPIError,
  DomainFileDTO,
  DownloadListParams,
  FilesCreate2Params,
  FilesCreate2Payload,
  FilesCreate3Params,
  FilesCreate3Payload,
  FilesCreate4Params,
  FilesCreate4Payload,
  FilesCreateParams,
  FilesCreatePayload,
  FilesDeleteParams,
  FilesDetailParams,
  FilesList2Params,
  FilesList3Params,
  FilesList4Params,
  FilesListParams,
  SuppliersFilesCreateParams,
  SuppliersFilesCreatePayload,
  SuppliersFilesListParams,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Files<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Get all files attached to a customer
   *
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
  filesList = ({ id, ...query }: FilesListParams, params: RequestParams = {}) =>
    this.http.request<DomainFileDTO[], DomainAPIError>({
      path: `/customers/${id}/files`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Upload a file and attach it to a customer. Company is determined from the X-Company-Id header.
   *
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
  filesCreate = (
    { id, ...query }: FilesCreateParams,
    data: FilesCreatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainFileDTO, DomainAPIError>({
      path: `/customers/${id}/files`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.FormData,
      format: "json",
      ...params,
    });
  /**
   * @description Get file metadata by ID
   *
   * @tags Files
   * @name FilesDetail
   * @summary Get file metadata
   * @request GET:/files/{id}
   * @secure
   * @response `200` `DomainFileDTO` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `404` `DomainAPIError` Not Found
   */
  filesDetail = (
    { id, ...query }: FilesDetailParams,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainFileDTO, DomainAPIError>({
      path: `/files/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Delete a file from both storage and database
   *
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
  filesDelete = (
    { id, ...query }: FilesDeleteParams,
    params: RequestParams = {},
  ) =>
    this.http.request<void, DomainAPIError>({
      path: `/files/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Download file content by ID
   *
   * @tags Files
   * @name DownloadList
   * @summary Download file
   * @request GET:/files/{id}/download
   * @secure
   * @response `200` `void` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `404` `DomainAPIError` Not Found
   */
  downloadList = (
    { id, ...query }: DownloadListParams,
    params: RequestParams = {},
  ) =>
    this.http.request<void, DomainAPIError>({
      path: `/files/${id}/download`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description Get all files attached to an offer
   *
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
  filesList2 = (
    { id, ...query }: FilesList2Params,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainFileDTO[], DomainAPIError>({
      path: `/offers/${id}/files`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Upload a file and attach it to an offer. Company is determined from the X-Company-Id header.
   *
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
  filesCreate2 = (
    { id, ...query }: FilesCreate2Params,
    data: FilesCreate2Payload,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainFileDTO, DomainAPIError>({
      path: `/offers/${id}/files`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.FormData,
      format: "json",
      ...params,
    });
  /**
   * @description Get all files attached to a specific supplier within an offer
   *
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
  suppliersFilesList = (
    { offerId, supplierId, ...query }: SuppliersFilesListParams,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainFileDTO[], DomainAPIError>({
      path: `/offers/${offerId}/suppliers/${supplierId}/files`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Upload a file and attach it to a specific supplier within an offer. Company is determined from the X-Company-Id header.
   *
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
  suppliersFilesCreate = (
    { offerId, supplierId, ...query }: SuppliersFilesCreateParams,
    data: SuppliersFilesCreatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainFileDTO, DomainAPIError>({
      path: `/offers/${offerId}/suppliers/${supplierId}/files`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.FormData,
      format: "json",
      ...params,
    });
  /**
   * @description Get all files attached to a project
   *
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
  filesList3 = (
    { id, ...query }: FilesList3Params,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainFileDTO[], DomainAPIError>({
      path: `/projects/${id}/files`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Upload a file and attach it to a project. Company is determined from the X-Company-Id header.
   *
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
  filesCreate3 = (
    { id, ...query }: FilesCreate3Params,
    data: FilesCreate3Payload,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainFileDTO, DomainAPIError>({
      path: `/projects/${id}/files`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.FormData,
      format: "json",
      ...params,
    });
  /**
   * @description Get all files attached to a supplier
   *
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
  filesList4 = (
    { id, ...query }: FilesList4Params,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainFileDTO[], DomainAPIError>({
      path: `/suppliers/${id}/files`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Upload a file and attach it to a supplier. Company is determined from the X-Company-Id header.
   *
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
  filesCreate4 = (
    { id, ...query }: FilesCreate4Params,
    data: FilesCreate4Payload,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainFileDTO, DomainAPIError>({
      path: `/suppliers/${id}/files`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.FormData,
      format: "json",
      ...params,
    });
}
