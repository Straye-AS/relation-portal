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
  ProjectsListParams3PhaseEnum,
  ProjectsListParams3SortByEnum,
  ProjectsListParams3SortOrderEnum,
} from "./data-contracts";

export namespace Projects {
  /**
 * @description Get paginated list of projects with optional filters
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
  export namespace ProjectsList {
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
       * Filter by customer ID
       * @format uuid
       */
      customerId?: string;
      /** Filter by phase */
      phase?: ProjectsListParams3PhaseEnum;
      /** Sort field */
      sortBy?: ProjectsListParams3SortByEnum;
      /**
       * Sort order
       * @default "desc"
       */
      sortOrder?: ProjectsListParams3SortOrderEnum;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainPaginatedResponse & {
      data?: DomainProjectDTO[];
    };
  }

  /**
   * @description Create a new project (simplified container for offers)
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
  export namespace ProjectsCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DomainCreateProjectRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainProjectDTO;
  }

  /**
   * @description Get a project with details including recent activities
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
  export namespace ProjectsDetail {
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
    export type ResponseBody = DomainProjectWithDetailsDTO;
  }

  /**
   * @description Update an existing project
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
  export namespace ProjectsUpdate {
    export type RequestParams = {
      /**
       * Project ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateProjectRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainProjectDTO;
  }

  /**
   * @description Delete a project
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
  export namespace ProjectsDelete {
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
    export type ResponseBody = void;
  }

  /**
   * @description Get recent activities for a project
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
  export namespace ActivitiesList {
    export type RequestParams = {
      /**
       * Project ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {
      /**
       * Limit
       * @max 200
       * @default 50
       */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DomainActivityDTO[];
  }

  /**
   * @description Update the start and end dates of a project
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
  export namespace DatesUpdate {
    export type RequestParams = {
      /**
       * Project ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateProjectDatesRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainProjectDTO;
  }

  /**
   * @description Update the summary and description of a project
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
  export namespace DescriptionUpdate {
    export type RequestParams = {
      /**
       * Project ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateProjectDescriptionRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainProjectDTO;
  }

  /**
   * @description Update only the name of a project
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
  export namespace NameUpdate {
    export type RequestParams = {
      /**
       * Project ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateProjectNameRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainProjectDTO;
  }

  /**
   * @description Get all offers linked to a project (offer folder model)
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
  export namespace OffersList {
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
    export type ResponseBody = DomainOfferDTO[];
  }

  /**
   * @description Update only the phase of a project
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
  export namespace PhaseUpdate {
    export type RequestParams = {
      /**
       * Project ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateProjectPhaseRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainProjectDTO;
  }

  /**
   * @description Update the project number of a project
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
  export namespace ProjectNumberUpdate {
    export type RequestParams = {
      /**
       * Project ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainUpdateProjectNumberRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainProjectDTO;
  }

  /**
   * @description Reopens a project that was completed or cancelled. Can reopen to tilbud or working phase.
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
  export namespace ReopenCreate {
    export type RequestParams = {
      /**
       * Project ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DomainReopenProjectRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DomainReopenProjectResponse;
  }
}
