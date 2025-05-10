/**
 * Command Message Types
 */

/**
 * Register a new Command with the Command Registry
 * from another process
 */
export interface ICommandRegister {
  /**
   * Type of Command Message being sent/received
   */
  type: 'register'
  /**
   * UUID for correlating request/response messages
   */
  id: string
  /**
   * Command being registered, must be globally unique
   */
  command: string
}

/**
 * 'list' is used to request a list of all registered Commands
 * that a process can execute. Used when initialising new channels
 */
export interface ICommandListRequest {
  /**
   * Type of Command Message being sent/received
   */
  type: 'list'
}

/**
 * 'list-response' is returned in response to a 'list' request
 * and contains a list of all registered Commands for a remote process
 */
export interface ICommandListResponse {
  /**
   * Type of Command Message being sent/received
   */
  type: 'list-response'
  /**
   * List of all registered Commands
   */
  commands: string[]
}

/**
 * 'request' is used to make a request to execute Command
 */
export interface ICommandRequest {
  /**
   * Type of Command Message being sent/received
   */
  type: 'request'
  /**
   * UUID for correlating request/response messages
   */
  id: string
  /**
   * Command being invoked for request
   */
  command: string
  /**
   * Payload for request as determined by specific Command handler
   */
  payload?: object
}

/**
 * 'response' is used to send a successful response from the Command handler
 */
export interface ICommandResponse {
  /**
   * Type of Command Message being sent/received
   */
  type: 'response'
  /**
   * UUID for correlating request/response messages
   */
  id: string
  /**
   * Payload for response as determined by specific Command handler
   */
  payload?: any
}

/**
 * 'error' is used to send an unsuccessful response from the Command handler
 */
export interface ICommandResponseError {
  /**
   * Type of Command Message being sent/received
   */
  type: 'error'
  /**
   * UUID for correlating request/response messages
   */
  id: string
  /**
   * Payload for error as determined by specific Command handler
   */
  reason: string
}

/**
 * 'event' is used to broadcast events to clients
 */
export interface ICommandEvent {
  /**
   * Type of Command Message being sent/received
   */
  type: 'event'
  /**
   * The Event being broadcast
   */
  event: string
  /**
   * Payload for message as determined by specific Event
   */
  payload?: any
}
