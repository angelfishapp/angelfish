import axios from 'axios'

import { formatAxiosError, NetworkOfflineError, UnauthorizedError } from '@angelfish/cloudapiclient'
import { AppEvents, CommandsClient, Logger } from '@angelfish/core'

const logger = Logger.scope('CloudService-Utils')

// Keep global state of App's online status
let isOnline: boolean = true

/**
 * Decorator to handle errors thrown from the CloudAPI
 * and update the App's online status appropriately
 *
 * @example
 * ```typescript
 * @HandleCloudError
 * public async sendOOBCode(payload: { email: string }): Promise<string> {}
 * ```
 */
export function HandleCloudError(
  _target: object,
  propertyName: string | symbol,
  propertyDesciptor: PropertyDescriptor,
): void {
  const originalMethod = propertyDesciptor.value

  // Wrap the original method
  propertyDesciptor.value = async function (...args: any[]) {
    try {
      // Call the original method
      const result = await originalMethod.apply(this, args)

      // Reset App online status if successful
      if (isOnline === false) {
        CommandsClient.emitEvent(AppEvents.ON_ONLINE_STATUS_CHANGED, { online: true })
      }

      return result
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle NetworkOfflineError
        if (error.message === 'Network Error') {
          if (!navigator.onLine) {
            logger.warn(`NetworkOfflineError caught in ${String(propertyName)}`)
            isOnline = false
            CommandsClient.emitEvent(AppEvents.ON_ONLINE_STATUS_CHANGED, { online: false })
            throw new NetworkOfflineError()
          }
        }

        // Handle Unauthorized errors (401)
        if (error.response && error.response.status === 401) {
          logger.warn(`UnauthorizedError caught in ${String(propertyName)}`)
          throw new UnauthorizedError()
        }

        // Log other Axios errors
        logger.error(`AxiosError caught in ${String(propertyName)}: ${formatAxiosError(error)}`)
      } else if (error instanceof UnauthorizedError) {
        logger.warn(`UnauthorizedError caught in ${String(propertyName)}`)
      } else {
        // Log other errors
        logger.error(`Error caught in ${String(propertyName)}: ${error}`, error)
      }
      // Re-throw the error
      throw error
    }
  }
}
