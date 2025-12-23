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
  DomainActivityDTO,
  DomainActivityStatusCounts,
  DomainAddAttendeeRequest,
  DomainCompleteActivityRequest,
  DomainCreateActivityRequest,
  DomainCreateFollowUpRequest,
  DomainPaginatedResponse,
  DomainUpdateActivityRequest,
} from "./data-contracts";

export namespace Activities {
  /**
 * @description Get paginated list of activities with optional filters
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
  export namespace ActivitiesList {
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
      /** Filter by activity type (meeting, task, call, email, note) */
      type?: string;
      /** Filter by status (planned, in_progress, completed, cancelled) */
      status?: string;
      /** Filter by target type (customer, project, offer, deal) */
      targetType?: string;
      /**
       * Filter by target entity ID
       * @format uuid
       */
      targetId?: string;
      /** Filter by assigned user ID */
      assignedTo?: string;
      /** Filter activities from this date (YYYY-MM-DD), inclusive from 00:00:00 */
      from?: string;
      /** Filter activities to this date (YYYY-MM-DD), inclusive until 23:59:59 */
      to?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainPaginatedResponse & {
      data?: DomainActivityDTO[];
    };
  }

  /**
   * @description Create a new activity (meeting, task, call, email, or note)
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
  export namespace ActivitiesCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DomainCreateActivityRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainActivityDTO;
  }

  /**
 * @description Get current user's incomplete tasks (assigned tasks that are not completed or cancelled)
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
  export namespace MyTasksList {
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
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainPaginatedResponse & {
      data?: DomainActivityDTO[];
    };
  }

  /**
   * @description Get activity status counts for the current user's dashboard
   * @tags Activities
   * @name StatsList
   * @summary Get activity statistics
   * @request GET:/activities/stats
   * @secure
   * @response `200` `DomainActivityStatusCounts` OK
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace StatsList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainActivityStatusCounts;
  }

  /**
   * @description Get upcoming scheduled activities for the current user within a specified number of days
   * @tags Activities
   * @name UpcomingList
   * @summary Get upcoming activities
   * @request GET:/activities/upcoming
   * @secure
   * @response `200` `(DomainActivityDTO)[]` OK
   * @response `401` `DomainErrorResponse` Unauthorized
   * @response `500` `DomainErrorResponse` Internal Server Error
   */
  export namespace UpcomingList {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Number of days to look ahead (1-90)
       * @default 7
       */
      daysAhead?: number;
      /**
       * Maximum number of activities to return (1-100)
       * @default 20
       */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainActivityDTO[];
  }

  /**
   * @description Get a single activity by its ID
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
  export namespace ActivitiesDetail {
    export type RequestParams = {
      /**
       * Activity ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainActivityDTO;
  }

  /**
   * @description Update an existing activity
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
  export namespace ActivitiesUpdate {
    export type RequestParams = {
      /**
       * Activity ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateActivityRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainActivityDTO;
  }

  /**
   * @description Delete an activity
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
  export namespace ActivitiesDelete {
    export type RequestParams = {
      /**
       * Activity ID
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
   * @description Add a user as an attendee to a meeting activity
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
  export namespace AttendeesCreate {
    export type RequestParams = {
      /**
       * Activity ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainAddAttendeeRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainActivityDTO;
  }

  /**
   * @description Remove a user from the attendees list of a meeting activity
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
  export namespace AttendeesDelete {
    export type RequestParams = {
      /**
       * Activity ID
       * @format uuid
       */
      id: string;
      /** User ID to remove */
      userId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainActivityDTO;
  }

  /**
   * @description Mark an activity as completed with an optional outcome
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
  export namespace CompleteCreate {
    export type RequestParams = {
      /**
       * Activity ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainCompleteActivityRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainActivityDTO;
  }

  /**
   * @description Create a follow-up task from a completed activity
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
  export namespace FollowUpCreate {
    export type RequestParams = {
      /**
       * Activity ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainCreateFollowUpRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainActivityDTO;
  }
}
