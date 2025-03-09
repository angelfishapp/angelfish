import { PreloadLogger } from '../preload/preload-logger'
import { CommandsRegistry } from './commands-registry'

/**
 * Mock ProcessIDs
 */
enum ProcessIDs {
  MAIN = 'main',
  APP = 'app',
  WORKER = 'worker',
  CHILD = 'child',
  NEW = 'new',
}

describe('CommandsRegistry', () => {
  // Setup 4 processes with MessageChannels
  const mainProcess = new CommandsRegistry<MessagePort>({
    id: ProcessIDs.MAIN,
    logger: PreloadLogger,
  })
  const workerProcess = new CommandsRegistry<MessagePort>({
    id: ProcessIDs.WORKER,
    logger: PreloadLogger,
    routerChannel: ProcessIDs.MAIN,
  })
  const appProcess = new CommandsRegistry<MessagePort>({
    id: ProcessIDs.APP,
    logger: PreloadLogger,
    routerChannel: ProcessIDs.MAIN,
  })
  // Child process is only connect to main 'router' process so all
  // other processes calling it will need to route through main
  const childProcess = new CommandsRegistry<MessagePort>({
    id: ProcessIDs.CHILD,
    logger: PreloadLogger,
    routerChannel: ProcessIDs.MAIN,
  })
  // New process is not connected to any other processes
  // until later in tests to simulate a new process being setup
  // after initial setup or one of the other processes being restarted
  const newProcess = new CommandsRegistry<MessagePort>({
    id: ProcessIDs.NEW,
    logger: PreloadLogger,
    routerChannel: ProcessIDs.MAIN,
  })

  // Setup the channels between the processes
  // Main process connects to all processes as router
  const { port1: workerMainPort1, port2: workerMainPort2 } = new MessageChannel()
  mainProcess.registerNewChannel(ProcessIDs.WORKER, workerMainPort1)
  workerProcess.registerNewChannel(ProcessIDs.MAIN, workerMainPort2)
  const { port1: appMainPort1, port2: appMainPort2 } = new MessageChannel()
  mainProcess.registerNewChannel(ProcessIDs.APP, appMainPort1)
  appProcess.registerNewChannel(ProcessIDs.MAIN, appMainPort2)
  const { port1: childMainPort1, port2: childMainPort2 } = new MessageChannel()
  mainProcess.registerNewChannel(ProcessIDs.CHILD, childMainPort1)
  childProcess.registerNewChannel(ProcessIDs.MAIN, childMainPort2)

  // Connect the worker to all other processes for direct connection
  const { port1: workerAppPort1, port2: workerAppPort2 } = new MessageChannel()
  workerProcess.registerNewChannel(ProcessIDs.APP, workerAppPort1)
  appProcess.registerNewChannel(ProcessIDs.WORKER, workerAppPort2)
  const { port1: workerChildPort1, port2: workerChildPort2 } = new MessageChannel()
  workerProcess.registerNewChannel(ProcessIDs.CHILD, workerChildPort1)
  childProcess.registerNewChannel(ProcessIDs.WORKER, workerChildPort2)

  it('should register and execute a command in MAIN', async () => {
    const mockFn = vi.fn(async (payload) => payload)
    await mainProcess.registerCommand('main.test.command', mockFn)
    const localResult = await mainProcess.executeCommand<{ test: string }>('main.test.command', {
      test: 'payload',
    })
    expect(mockFn).toBeCalledTimes(1) // Ensure the function was called
    expect(localResult.test).toBe('payload')

    // Try calling from another process remotely
    const remoteResult = await workerProcess.executeCommand<{ test: string }>('main.test.command', {
      test: 'payload',
    })
    expect(mockFn).toBeCalledTimes(2) // Ensure the function was called
    expect(remoteResult.test).toBe('payload')
  })

  it('should register and execute a command in WORKER', async () => {
    const mockFn = vi.fn(async (payload) => payload)
    await workerProcess.registerCommand('worker.test.command', mockFn)
    const localResult = await workerProcess.executeCommand<{ test: string }>(
      'worker.test.command',
      {
        test: 'payload',
      },
    )
    expect(mockFn).toBeCalledTimes(1) // Ensure the function was called
    expect(localResult.test).toBe('payload')

    // Try calling from MAIN
    const remoteResult = await mainProcess.executeCommand<{ test: string }>('worker.test.command', {
      test: 'payload',
    })
    expect(mockFn).toBeCalledTimes(2) // Ensure the function was called
    expect(remoteResult.test).toBe('payload')
  })

  it('should register and execute a command in APP and route from CHILD', async () => {
    const mockFn = vi.fn(async (payload) => payload)
    await appProcess.registerCommand('app.test.command', mockFn)
    const localResult = await appProcess.executeCommand<{ test: string }>('app.test.command', {
      test: 'payload',
    })
    expect(mockFn).toBeCalledTimes(1) // Ensure the function was called
    expect(localResult.test).toBe('payload')

    // Try calling from child process which isn't connected to app so should route through main
    const remoteResult = await childProcess.executeCommand<{ test: string }>('app.test.command', {
      test: 'payload',
    })
    expect(mockFn).toBeCalledTimes(2) // Ensure the function was called
    expect(remoteResult.test).toBe('payload')
  })

  it('private commands should not be accessible from other processes', async () => {
    const mockFn = vi.fn(async (payload) => payload)
    await appProcess.registerCommand('_app.test.command', mockFn)
    const localResult = await appProcess.executeCommand<{ test: string }>('_app.test.command', {
      test: 'payload',
    })
    expect(mockFn).toBeCalledTimes(1) // Ensure the function was called
    expect(localResult.test).toBe('payload')

    // Try calling from main process to ensure it's not accessible
    await expect(
      mainProcess.executeCommand<{ test: string }>('_app.test.command', {
        test: 'payload',
      }),
    ).rejects.toThrow('Command "_app.test.command" and router channel not found')
  })

  it('emits an event to all processes only once', async () => {
    const eventId = 'test.event'
    const mainMockFn = vi.fn()
    mainProcess.addEventListener(eventId, mainMockFn)
    const workerMockFn = vi.fn()
    workerProcess.addEventListener(eventId, workerMockFn)
    const appMockFn = vi.fn()
    appProcess.addEventListener(eventId, appMockFn)
    const childMockFn = vi.fn()
    childProcess.addEventListener(eventId, childMockFn)

    // Emit an event from child process
    childProcess.emitEvent(eventId, { test: 'payload' })

    // Give time for messages to be sent
    await new Promise((resolve) => setTimeout(resolve, 300))

    expect(mainMockFn).toBeCalledTimes(1)
    expect(workerMockFn).toBeCalledTimes(1)
    expect(appMockFn).toBeCalledTimes(1)
    expect(childMockFn).toBeCalledTimes(1)
  })

  it('a new process should be setup correctly', async () => {
    // Setup the channel between the new process and main
    const { port1: newMainPort1, port2: newMainPort2 } = new MessageChannel()
    mainProcess.registerNewChannel(ProcessIDs.NEW, newMainPort1)
    newProcess.registerNewChannel(ProcessIDs.MAIN, newMainPort2)
    // Setup the channel between the new process and worker
    const { port1: newWorkerPort1, port2: newWorkerPort2 } = new MessageChannel()
    newProcess.registerNewChannel(ProcessIDs.WORKER, newWorkerPort1)
    workerProcess.registerNewChannel(ProcessIDs.NEW, newWorkerPort2)

    // Give time for messages to be sent
    await new Promise((resolve) => setTimeout(resolve, 300))

    const commands = Object.keys(newProcess.listCommands())
    expect(commands).toHaveLength(2)
    expect(commands).toContain('main.test.command')
    expect(commands).toContain('worker.test.command')

    // Call a command from the new process to worker
    const remoteResult = await newProcess.executeCommand<{ test: string }>('worker.test.command', {
      test: 'payload',
    })
    expect(remoteResult.test).toBe('payload')
  })
})
