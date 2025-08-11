import type { ErrorCodes } from './ErrorCodes'

export class CommandError extends Error {
  public code?: ErrorCodes

  constructor(message: string, code?: ErrorCodes) {
    super(message)
    this.name = 'CommandError'
    this.code = code
  }
}
