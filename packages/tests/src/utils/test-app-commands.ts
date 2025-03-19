import type { AppCommandIds, AppCommandRequest, AppCommandResponse } from '@angelfish/core'

import { MockCommandsClient } from '../mocks/core/mock-commands-client.js'

/**
 * Helper function to check types are kept up to date when mocking App Commands
 * in tests.
 *
 * @param commandID     AppCommand ID to register (will type payload and response)
 * @param handler       Function to handle the AppCommand request and return a response
 */
export function mockRegisterTypedAppCommand<T extends AppCommandIds>(
  command: T,
  handler: (payload: AppCommandRequest<T>) => AppCommandResponse<T>,
): void {
  MockCommandsClient.registerCommand(command, handler)
}
