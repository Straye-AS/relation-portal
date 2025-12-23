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
  ActivitiesListParams6,
  DatesUpdateParams,
  DescriptionUpdateParams2,
  DomainAPIError,
  DomainActivityDTO,
  DomainCreateProjectRequest,
  DomainOfferDTO,
  DomainPaginatedResponse,
  DomainProjectDTO,
  DomainProjectWithDetailsDTO,
  DomainReopenProjectRequest,
  DomainReopenProjectResponse,
  DomainUpdateProjectDatesRequest,
  DomainUpdateProjectDescriptionRequest,
  DomainUpdateProjectNameRequest,
  DomainUpdateProjectNumberRequest,
  DomainUpdateProjectPhaseRequest,
  DomainUpdateProjectRequest,
  NameUpdateParams,
  OffersListParams4,
  PhaseUpdateParams,
  ProjectNumberUpdateParams,
  ProjectsDeleteParams,
  ProjectsDetailParams,
  ProjectsListParams2,
  ProjectsUpdateParams,
  ReopenCreateParams4,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Projects<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
 * @description Get paginated list of projects with optional filters
 *
 * @tags Projects
 * @name ProjectsList
 * @summary List projects
 * @request GET:/projects
 * @secure
 * @response `200` `(DomainPaginatedResponse & {
    data?: (DomainProjectDTO)[],

})` OK
 * @response `400` `DomainAPIError` Bad Request
 * @response `401` `DomainAPIError` Unauthorized
 * @response `500` `DomainAPIError` Internal Server Error
 */
  projectsList = (query: ProjectsListParams2, params: RequestParams = {}) =>
    this.http.request<
      DomainPaginatedResponse & {
        data?: DomainProjectDTO[];
      },
      DomainAPIError
    >({
      path: `/projects`,
      method: "GET",
      query: query,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Create a new project (simplified container for offers)
   *
   * @tags Projects
   * @name ProjectsCreate
   * @summary Create project
   * @request POST:/projects
   * @secure
   * @response `201` `DomainProjectDTO` Created
   * @response `400` `DomainAPIError` Bad Request
   * @response `401` `DomainAPIError` Unauthorized
   * @response `403` `DomainAPIError` Forbidden
   * @response `500` `DomainAPIError` Internal Server Error
   */
  projectsCreate = (
    request: DomainCreateProjectRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainProjectDTO, DomainAPIError>({
      path: `/projects`,
      method: "POST",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get a project with details including recent activities
   *
   * @tags Projects
   * @name ProjectsDetail
   * @summary Get project by ID
   * @request GET:/projects/{id}
   * @secure
   * @response `200` `DomainProjectWithDetailsDTO` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `401` `DomainAPIError` Unauthorized
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  projectsDetail = (
    { id, ...query }: ProjectsDetailParams,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainProjectWithDetailsDTO, DomainAPIError>({
      path: `/projects/${id}`,
      method: "GET",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update an existing project
   *
   * @tags Projects
   * @name ProjectsUpdate
   * @summary Update project
   * @request PUT:/projects/{id}
   * @secure
   * @response `200` `DomainProjectDTO` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `401` `DomainAPIError` Unauthorized
   * @response `403` `DomainAPIError` Forbidden
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  projectsUpdate = (
    { id, ...query }: ProjectsUpdateParams,
    request: DomainUpdateProjectRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainProjectDTO, DomainAPIError>({
      path: `/projects/${id}`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Delete a project
   *
   * @tags Projects
   * @name ProjectsDelete
   * @summary Delete project
   * @request DELETE:/projects/{id}
   * @secure
   * @response `204` `void` No Content
   * @response `400` `DomainAPIError` Bad Request
   * @response `401` `DomainAPIError` Unauthorized
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  projectsDelete = (
    { id, ...query }: ProjectsDeleteParams,
    params: RequestParams = {},
  ) =>
    this.http.request<void, DomainAPIError>({
      path: `/projects/${id}`,
      method: "DELETE",
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Get recent activities for a project
   *
   * @tags Projects
   * @name ActivitiesList
   * @summary Get project activities
   * @request GET:/projects/{id}/activities
   * @secure
   * @response `200` `(DomainActivityDTO)[]` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `401` `DomainAPIError` Unauthorized
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  activitiesList = (
    { id, ...query }: ActivitiesListParams6,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainActivityDTO[], DomainAPIError>({
      path: `/projects/${id}/activities`,
      method: "GET",
      query: query,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update the start and end dates of a project
   *
   * @tags Projects
   * @name DatesUpdate
   * @summary Update project dates
   * @request PUT:/projects/{id}/dates
   * @secure
   * @response `200` `DomainProjectDTO` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `401` `DomainAPIError` Unauthorized
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  datesUpdate = (
    { id, ...query }: DatesUpdateParams,
    request: DomainUpdateProjectDatesRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainProjectDTO, DomainAPIError>({
      path: `/projects/${id}/dates`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update the summary and description of a project
   *
   * @tags Projects
   * @name DescriptionUpdate
   * @summary Update project description
   * @request PUT:/projects/{id}/description
   * @secure
   * @response `200` `DomainProjectDTO` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `401` `DomainAPIError` Unauthorized
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  descriptionUpdate = (
    { id, ...query }: DescriptionUpdateParams2,
    request: DomainUpdateProjectDescriptionRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainProjectDTO, DomainAPIError>({
      path: `/projects/${id}/description`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update only the name of a project
   *
   * @tags Projects
   * @name NameUpdate
   * @summary Update project name
   * @request PUT:/projects/{id}/name
   * @secure
   * @response `200` `DomainProjectDTO` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `401` `DomainAPIError` Unauthorized
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  nameUpdate = (
    { id, ...query }: NameUpdateParams,
    request: DomainUpdateProjectNameRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainProjectDTO, DomainAPIError>({
      path: `/projects/${id}/name`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get all offers linked to a project (offer folder model)
   *
   * @tags Projects
   * @name OffersList
   * @summary Get offers for a project
   * @request GET:/projects/{id}/offers
   * @secure
   * @response `200` `(DomainOfferDTO)[]` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `404` `DomainAPIError` Project not found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  offersList = (
    { id, ...query }: OffersListParams4,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainOfferDTO[], DomainAPIError>({
      path: `/projects/${id}/offers`,
      method: "GET",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update only the phase of a project
   *
   * @tags Projects
   * @name PhaseUpdate
   * @summary Update project phase
   * @request PUT:/projects/{id}/phase
   * @secure
   * @response `200` `DomainProjectDTO` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `401` `DomainAPIError` Unauthorized
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  phaseUpdate = (
    { id, ...query }: PhaseUpdateParams,
    request: DomainUpdateProjectPhaseRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainProjectDTO, DomainAPIError>({
      path: `/projects/${id}/phase`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update the project number of a project
   *
   * @tags Projects
   * @name ProjectNumberUpdate
   * @summary Update project number
   * @request PUT:/projects/{id}/project-number
   * @secure
   * @response `200` `DomainProjectDTO` OK
   * @response `400` `DomainAPIError` Bad Request
   * @response `401` `DomainAPIError` Unauthorized
   * @response `404` `DomainAPIError` Not Found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  projectNumberUpdate = (
    { id, ...query }: ProjectNumberUpdateParams,
    request: DomainUpdateProjectNumberRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainProjectDTO, DomainAPIError>({
      path: `/projects/${id}/project-number`,
      method: "PUT",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Reopens a project that was completed or cancelled. Can reopen to tilbud or working phase.
   *
   * @tags Projects
   * @name ReopenCreate
   * @summary Reopen a completed or cancelled project
   * @request POST:/projects/{id}/reopen
   * @secure
   * @response `200` `DomainReopenProjectResponse` OK
   * @response `400` `DomainAPIError` Invalid request, phase transition, or project not in closed state
   * @response `401` `DomainAPIError` Unauthorized
   * @response `404` `DomainAPIError` Project not found
   * @response `500` `DomainAPIError` Internal Server Error
   */
  reopenCreate = (
    { id, ...query }: ReopenCreateParams4,
    request: DomainReopenProjectRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<DomainReopenProjectResponse, DomainAPIError>({
      path: `/projects/${id}/reopen`,
      method: "POST",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
