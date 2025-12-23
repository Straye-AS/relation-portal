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
  DomainNotificationDTO,
  DomainPaginatedResponse,
  DomainUnreadCountDTO,
  NotificationsListParams1TypeEnum,
} from "./data-contracts";

export namespace Notifications {
  /**
 * @description Get paginated list of notifications for the current user
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
  export namespace NotificationsList {
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
      /**
       * Filter to show only unread notifications
       * @default false
       */
      unreadOnly?: boolean;
      /** Filter by notification type */
      type?: NotificationsListParams1TypeEnum;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainPaginatedResponse & {
      data?: DomainNotificationDTO[];
    };
  }

  /**
   * @description Get the count of unread notifications for the current user
   * @tags Notifications
   * @name CountList
   * @summary Get unread notification count
   * @request GET:/notifications/count
   * @secure
   * @response `200` `DomainUnreadCountDTO` OK
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace CountList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainUnreadCountDTO;
  }

  /**
   * @description Mark all notifications for the current user as read
   * @tags Notifications
   * @name ReadAllUpdate
   * @summary Mark all notifications as read
   * @request PUT:/notifications/read-all
   * @secure
   * @response `204` `void` No Content
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace ReadAllUpdate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Get a single notification by its ID
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
  export namespace NotificationsDetail {
    export type RequestParams = {
      /**
       * Notification ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainNotificationDTO;
  }

  /**
   * @description Mark a single notification as read
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
  export namespace ReadUpdate {
    export type RequestParams = {
      /**
       * Notification ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}
