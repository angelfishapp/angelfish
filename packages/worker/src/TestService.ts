import { Command, CommandsClient } from '@angelfish/core'
import { getWorkerLogger } from './logger'

const logger = getWorkerLogger('TestService')

/**
 * Test Service: Demonstrates how to build services that use the CommandRegistry to
 * handler commands and events.
 */
export class TestService {
  /**
   * Public constructor - add any event listeners here
   */
  public constructor() {
    logger.info('TestService constructed')
    CommandsClient.addEventListener('main.test.event', (payload: any) => {
      logger.info('test event received:', payload)
    })
    CommandsClient.addEventListener('counter.changed', (payload: { count: number }) => {
      logger.info('Counter Changed:', payload.count)
    })
  }

  /**
   * Simple 'hello.world' command
   *
   * @param payload The payload for the command
   * @returns       The response from the command
   */
  @Command<{ name: string }, { response: string }>('hello.world')
  public async helloWorld(payload: { name: string }): Promise<{ response: string }> {
    logger.info('Test command hello.world invoked with payload:', payload)
    return { response: `Hello ${payload.name}` }
  }
}
