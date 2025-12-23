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
  DomainErrorResponse,
  DomainNotificationDTO,
  DomainPaginatedResponse,
  DomainUnreadCountDTO,
  NotificationsDetailParams,
  NotificationsListParams,
  ReadUpdateParams,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Notifications<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
 * @description Get paginated list of notifications for the current user
 *
 * @tags Notifications
 * @name NotificationsList
 * @summary List notifications
 * @request GET:/notifications
 * @secure
 * @response `200` `(DomainPaginatedResponse & {
    data?: (DomainNotificationDTO)[],

})` OK
 * @response `401` `DomainErrorResponse` Unauthorized
 * @response `500` `DomainErrorResponse` Internal Server Error
 */
  notificationsList = (
    query: NotificationsListParams,
    params: RequestParams = {}
  ) =>
    this.http.request<
      DomainPaginatedResponse & {
        data?: DomainNotificationDTO[];
      },
      DomainErrorResponse
    >({
      path: `/notifications`,
      method: "GET",
      query: query,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get the count of unread notifications for the current user
   *
   * @tags Notifications
   * @name CountList
   * @summary Get unread notification count
   * @request GET:/notifications/count
   * @secure
   * @response `200` `DomainUnreadCountDTO` OK
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  countList = (params: RequestParams = {}) =>
    this.http.request<DomainUnreadCountDTO, DomainErrorResponse>({
      path: `/notifications/count`,
      method: "GET",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Mark all notifications for the current user as read
   *
   * @tags Notifications
   * @name ReadAllUpdate
   * @summary Mark all notifications as read
   * @request PUT:/notifications/read-all
   * @secure
   * @response `204` `void` No Content
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  readAllUpdate = (params: RequestParams = {}) =>
    this.http.request<void, DomainErrorResponse>({
      path: `/notifications/read-all`,
      method: "PUT",
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Get a single notification by its ID
   *
   * @tags Notifications
   * @name NotificationsDetail
   * @summary Get notification by ID
   * @request GET:/notifications/{id}
   * @secure
   * @response `200` `DomainNotificationDTO` OK
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `403` `DomainErrorResponse` Forbidden
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  notificationsDetail = (
    { id, ...query }: NotificationsDetailParams,
    params: RequestParams = {}
  ) =>
    this.http.request<DomainNotificationDTO, DomainErrorResponse>({
      path: `/notifications/${id}`,
      method: "GET",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Mark a single notification as read
   *
   * @tags Notifications
   * @name ReadUpdate
   * @summary Mark notification as read
   * @request PUT:/notifications/{id}/read
   * @secure
   * @response `204` `void` No Content
   * @response `400` `DomainErrorResponse` Bad Request
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `403` `DomainErrorResponse` Forbidden
   * @response `404` `DomainErrorResponse` Not Found
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  readUpdate = (
    { id, ...query }: ReadUpdateParams,
    params: RequestParams = {}
  ) =>
    this.http.request<void, DomainErrorResponse>({
      path: `/notifications/${id}/read`,
      method: "PUT",
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
