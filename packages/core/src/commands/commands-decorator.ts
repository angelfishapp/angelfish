import 'reflect-metadata'

import { CommandsClient } from './commands-client'
import type { TypedCommandHandler } from './commands-registry-interface'

/**
 * Definition for Command Handler Function
 */
interface CommandHandlerDefinition {
  name: string
  method: string
}

/**
 * Key for Reflect Metadata
 */
const REFLECT_COMMAND_METADATA_KEY = 'command:handler'

/**
 * CommandHandler decorator - add this decorator to any Class methods you want to register to handle Command requests.
 *
 * @param name: string            The Command ID to register the method with. Must be unique!
 */
export function Command<P, R>(name: string) {
  return (
    target: any,
    methodName: string,
    descriptor: TypedPropertyDescriptor<TypedCommandHandler<P, R>>,
  ) => {
    if (!descriptor.value) {
      throw new Error(`@Command decorator can only be applied to methods.`)
    }

    // Store metadata for the method
    const existingCommands: CommandHandlerDefinition[] =
      Reflect.getMetadata(REFLECT_COMMAND_METADATA_KEY, target) || []
    existingCommands.push({ name, method: methodName })
    Reflect.defineMetadata(REFLECT_COMMAND_METADATA_KEY, existingCommands, target)

    const originalMethod = descriptor.value
    descriptor.value = async function (payload: P): Promise<R> {
      const result = (await originalMethod?.apply(this, [payload])) as R
      return result
    }
  }
}

/**
 * Register all handlers decorated using @Command for every class that has been registered
 * with the decorator.
 *
 * @param classes: Function[]    Array of classes to register commands for
 */
export function registerCommands(classes: { new (): any }[]) {
  for (const cls of classes) {
    // Instantiate the class
    new (cls as any)()
    const prototype = cls.prototype
    const commands = Reflect.getMetadata(REFLECT_COMMAND_METADATA_KEY, prototype) || []
    for (const command of commands) {
      const handler = prototype[command.method]
      CommandsClient.registerCommand(command.name, handler.bind(prototype))
    }
  }
}
