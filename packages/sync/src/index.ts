import { Environment, Logger } from '@angelfish/core'

const logger = Logger.scope('sync')

logger.info('sync hello from new IPC bridge', Environment.toObject())
