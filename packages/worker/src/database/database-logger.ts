import type { Logger, QueryRunner } from 'typeorm'

import { getWorkerLogger } from '../logger'

const logger = getWorkerLogger('Database')

/**
 * TypeORM Customer Logger for Database Queries
 */
export class DatabaseLogger implements Logger {
  /**
   * Logs query and parameters used in it.
   */
  logQuery(query: string, parameters?: any[], _queryRunner?: QueryRunner) {
    const sql =
      query +
      (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '')
    logger.silly(`[QUERY]: ${sql}`)
  }

  /**
   * Logs query that is failed.
   */
  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    _queryRunner?: QueryRunner,
  ) {
    const sql =
      query +
      (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '')
    logger.error(`[FAILED QUERY]: ${sql}\n[QUERY ERROR]: ${error}`)
  }

  /**
   * Logs query that is slow.
   */
  logQuerySlow(time: number, query: string, parameters?: any[], _queryRunner?: QueryRunner) {
    const sql =
      query +
      (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '')
    logger.warn(`[SLOW QUERY: ${time} ms]: ${sql}`)
  }

  /**
   * Logs events from the schema build process.
   */
  logSchemaBuild(message: string, _queryRunner?: QueryRunner) {
    logger.info(message)
  }

  /**
   * Logs events from the migrations run process.
   */
  logMigration(message: string, _queryRunner?: QueryRunner) {
    logger.info(message)
  }

  /**
   * Perform logging using given logger.
   * Log has its own level and message.
   */
  log(level: 'warn' | 'info' | 'log', message: any, _queryRunner?: QueryRunner) {
    switch (level) {
      case 'log':
        logger.log(message)
        break
      case 'info':
        logger.info(message)
        break
      case 'warn':
        logger.warn(message)
        break
    }
  }

  // -------------------------------------------------------------------------
  // Protected Methods
  // -------------------------------------------------------------------------

  /**
   * Converts parameters to a string.
   * Sometimes parameters can have circular objects and therefor we are handle this case too.
   */
  protected stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters)
    } catch (_error) {
      // most probably circular objects in parameters
      return parameters
    }
  }
}
