/**
 * Error handling functions to help use Cloud API Clients
 */

import axios from 'axios'

/**
 * Helper function to format Axios error messages for logs without dumping the entire error object
 *
 * @param error     The AxiosError object to format
 * @returns
 */
export function formatAxiosError(error: any): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const summary = {
        request: {
          method: error.config?.method?.toUpperCase(),
          url: error.config?.url,
          headers: error.config?.headers,
          data: error.config?.data,
        },
        response: {
          status_code: error.response.status,
          status_text: error.response.statusText,
          data: error.response.data,
        },
      }

      return `Axios Error: \n${JSON.stringify(summary, null, 2)}`
    } else if (error.status) {
      return `Axios Error: No response received for Request: ${JSON.stringify(
        {
          method: error.config?.method?.toUpperCase(),
          url: error.config?.url,
          headers: error.config?.headers,
          data: error.config?.data,
        },
        null,
        2,
      )}`
    }
    // Other errors
    return `Axios Error: ${error.message}`
  }

  return error.message
}

/**
 * Custom Error for Network Offline
 */
export class NetworkOfflineError extends Error {
  constructor() {
    super(`The Network Is Offline`)
    this.name = 'NetworkOfflineError'
  }
}

/**
 * Custom Error for Unauthorized 401 Responses
 */
export class UnauthorizedError extends Error {
  constructor() {
    super(`Unauthorized Request`)
    this.name = 'UnauthorizedError'
  }
}
