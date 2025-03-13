import type { IBook } from '../types'

/**
 * Payload for ON_LOGIN Event
 */
export interface IOnLoginEvent {
  book?: IBook
}
