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
  ActivitiesDeleteParams,
  ActivitiesDetailParams,
  ActivitiesListParams,
  ActivitiesUpdateParams,
  AttendeesCreateParams,
  AttendeesDeleteParams,
  CompleteCreateParams,
  DomainActivityDTO,
  DomainActivityStatusCounts,
  DomainAddAttendeeRequest,
  DomainCompleteActivityRequest,
  DomainCreateActivityRequest,
  DomainCreateFollowUpRequest,
  DomainErrorResponse,
  DomainPaginatedResponse,
  DomainUpdateActivityRequest,
  FollowUpCreateParams,
  MyTasksListParams,
  UpcomingListParams,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Activities<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
 * @description Get paginated list of activities with optional filters
 *
 * @tags Activities
 * @name ActivitiesList
 * @summary List activities
 * @request GET:/activities
 * @secure
 * @response `200` `(DomainPaginatedResponse & {
    data?: (DomainActivityDTO)[],

})` OK
 * @response `400` `DomainErrorResponse` Bad Request
 * @response `401` `DomainErrorResponse` Unauthorized
 * @response `500` `DomainErrorResponse` Internal Server Error
 */
  activitiesList = (query: ActivitiesListParams, params: RequestParams = {}) =>
    this.http.request<
      DomainPaginatedResponse & {
        data?: DomainActivityDTO[];
      },
      DomainErrorResponse
    >({
      path: `/activities`,
      method: "GET",
      query: query,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Create a new activity (meeting, task, call, email, or note)
   *
   * @tags Activities
   * @name ActivitiesCreate
   * @summary Create activity
   * @request POST:/activities
   * @secure
   * @response `201` `DomainActivityDTO` Created
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  activitiesCreate = (
    body: DomainCreateActivityRequest,
    params: RequestParams = {}
  ) =>
    this.http.request<DomainActivityDTO, DomainErrorResponse>({
      path: `/activities`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
 * @description Get current user's incomplete tasks (assigned tasks that are not completed or cancelled)
 *
 * @tags Activities
 * @name MyTasksList
 * @summary Get my tasks
 * @request GET:/activities/my-tasks
 * @secure
 * @response `200` `(DomainPaginatedResponse & {
    data?: (DomainActivityDTO)[],

})` OK
 * @response `401` `DomainErrorResponse` Unauthorized
 * @response `500` `DomainErrorResponse` Internal Server Error
 */
  myTasksList = (query: MyTasksListParams, params: RequestParams = {}) =>
    this.http.request<
      DomainPaginatedResponse & {
        data?: DomainActivityDTO[];
      },
      DomainErrorResponse
    >({
      path: `/activities/my-tasks`,
      method: "GET",
      query: query,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get activity status counts for the current user's dashboard
   *
   * @tags Activities
   * @name StatsList
   * @summary Get activity statistics
   * @request GET:/activities/stats
   * @secure
   * @response `200` `DomainActivityStatusCounts` OK
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  statsList = (params: RequestParams = {}) =>
    this.http.request<DomainActivityStatusCounts, DomainErrorResponse>({
      path: `/activities/stats`,
      method: "GET",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get upcoming scheduled activities for the current user within a specified number of days
   *
   * @tags Activities
   * @name UpcomingList
   * @summary Get upcoming activities
   * @request GET:/activities/upcoming
   * @secure
   * @response `200` `(DomainActivityDTO)[]` OK
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  upcomingList = (query: UpcomingListParams, params: RequestParams = {}) =>
    this.http.request<DomainActivityDTO[], DomainErrorResponse>({
      path: `/activities/upcoming`,
      method: "GET",
      query: query,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get a single activity by its ID
   *
   * @tags Activities
   * @name ActivitiesDetail
   * @summary Get activity by ID
   * @request GET:/activities/{id}
   * @secure
   * @response `200` `DomainActivityDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `403` `DomainErrorResponse` Forbidden
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  activitiesDetail = (
    { id, ...query }: ActivitiesDetailParams,
    params: RequestParams = {}
  ) =>
    this.http.request<DomainActivityDTO, DomainErrorResponse>({
      path: `/activities/${id}`,
      method: "GET",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update an existing activity
   *
   * @tags Activities
   * @name ActivitiesUpdate
   * @summary Update activity
   * @request PUT:/activities/{id}
   * @secure
   * @response `200` `DomainActivityDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `403` `DomainErrorResponse` Forbidden
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  activitiesUpdate = (
    { id, ...query }: ActivitiesUpdateParams,
    body: DomainUpdateActivityRequest,
    params: RequestParams = {}
  ) =>
    this.http.request<DomainActivityDTO, DomainErrorResponse>({
      path: `/activities/${id}`,
      method: "PUT",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Delete an activity
   *
   * @tags Activities
   * @name ActivitiesDelete
   * @summary Delete activity
   * @request DELETE:/activities/{id}
   * @secure
   * @response `204` `void` No Content
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `403` `DomainErrorResponse` Forbidden
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  activitiesDelete = (
    { id, ...query }: ActivitiesDeleteParams,
    params: RequestParams = {}
  ) =>
    this.http.request<void, DomainErrorResponse>({
      path: `/activities/${id}`,
      method: "DELETE",
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Add a user as an attendee to a meeting activity
   *
   * @tags Activities
   * @name AttendeesCreate
   * @summary Add attendee to meeting
   * @request POST:/activities/{id}/attendees
   * @secure
   * @response `200` `DomainActivityDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `403` `DomainErrorResponse` Forbidden
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  attendeesCreate = (
    { id, ...query }: AttendeesCreateParams,
    body: DomainAddAttendeeRequest,
    params: RequestParams = {}
  ) =>
    this.http.request<DomainActivityDTO, DomainErrorResponse>({
      path: `/activities/${id}/attendees`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Remove a user from the attendees list of a meeting activity
   *
   * @tags Activities
   * @name AttendeesDelete
   * @summary Remove attendee from meeting
   * @request DELETE:/activities/{id}/attendees/{userId}
   * @secure
   * @response `200` `DomainActivityDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `403` `DomainErrorResponse` Forbidden
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  attendeesDelete = (
    { id, userId, ...query }: AttendeesDeleteParams,
    params: RequestParams = {}
  ) =>
    this.http.request<DomainActivityDTO, DomainErrorResponse>({
      path: `/activities/${id}/attendees/${userId}`,
      method: "DELETE",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Mark an activity as completed with an optional outcome
   *
   * @tags Activities
   * @name CompleteCreate
   * @summary Complete activity
   * @request POST:/activities/{id}/complete
   * @secure
   * @response `200` `DomainActivityDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `403` `DomainErrorResponse` Forbidden
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  completeCreate = (
    { id, ...query }: CompleteCreateParams,
    body: DomainCompleteActivityRequest,
    params: RequestParams = {}
  ) =>
    this.http.request<DomainActivityDTO, DomainErrorResponse>({
      path: `/activities/${id}/complete`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Create a follow-up task from a completed activity
   *
   * @tags Activities
   * @name FollowUpCreate
   * @summary Create follow-up task
   * @request POST:/activities/{id}/follow-up
   * @secure
   * @response `201` `DomainActivityDTO` Created
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `403` `DomainErrorResponse` Forbidden
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  followUpCreate = (
    { id, ...query }: FollowUpCreateParams,
    body: DomainCreateFollowUpRequest,
    params: RequestParams = {}
  ) =>
    this.http.request<DomainActivityDTO, DomainErrorResponse>({
      path: `/activities/${id}/follow-up`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
