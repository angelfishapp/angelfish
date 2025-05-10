import type {
  ICommandEvent,
  ICommandListRequest,
  ICommandListResponse,
  ICommandRegister,
  ICommandRequest,
  ICommandResponse,
  ICommandResponseError,
} from './commands-messages-types'

/**
 * Helper function to redact the payload of a command so confidential information is not logged
 *
 * @param msg   The command message payload to redact
 * @returns     A new object with the same keys as the original object, but with the payload values replaced with their type
 */
export function redactPayload<
  T extends
    | ICommandRegister
    | ICommandRequest
    | ICommandEvent
    | ICommandResponse
    | ICommandResponseError
    | ICommandListRequest
    | ICommandListResponse,
>(msg: T): Record<keyof T, string> {
  const result: Partial<Record<keyof T, any>> = { ...msg }

  // Only redact payload if it exists
  if ('payload' in msg && msg.payload && typeof msg.payload === 'object') {
    ;(result as any).payload = Object.fromEntries(
      Object.entries(msg.payload).map(([key, value]) => {
        if (value instanceof Date) {
          return [key, 'Date']
        }
        return [key, typeof value] // 🔒 Redact to type string
      }),
    ) as any
  }

  return result as Record<keyof T, any>
}
