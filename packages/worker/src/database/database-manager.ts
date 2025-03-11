import { DataSource } from 'typeorm'
import type { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions'

import { Environment } from '@angelfish/core'
import { getWorkerLogger } from '../logger'
import { DatabaseLogger } from './database-logger'

// Entities
import {
  AccountEntity,
  BookEntity,
  CategoryGroupEntity,
  InstitutionEntity,
  LineItemEntity,
  TagEntity,
  TransactionEntity,
  UserEntity,
} from './entities'

// Migrations
import InitDatabase1624237602767 from './migrations/1624237602767-init_database'

const logger = getWorkerLogger('Database')

/**
 * Manages connnection to local SQLite Database.
 *
 * If databasePath is passed in as ':memory:' will create local in-memory database which
 * will be destroyed when the program is shut down. This is useful for unit testing.
 */
export class DatabaseManager {
  private databasePath: string
  private dataSource?: DataSource

  /**
   * Create new DatabaseManager for specified file path
   *
   * @param databasePath  File path to SQLite Database file. Must be absolute path, do not use ~ or other
   *                      shortcuts or it won't create a database to file. If databasePath is set to ':memory:'
   *                      will create temporary in-memory SQLite Database, useful for unit testing.
   */
  public constructor(databasePath: string) {
    this.databasePath = databasePath
  }

  /**
   * Factory method to get new database connection at specified file path. If databasePath
   * is set to ':memory:' will create temporary in-memory SQLite Database, useful for unit testing.
   *
   * @param databasePath  The full file path to the SQLite database file
   * @returns Promise<Connection>
   */
  public async getDataSource(): Promise<DataSource> {
    if (!this.dataSource) {
      try {
        this.dataSource = await this.initDataSource(this.databasePath)
      } catch (error) {
        logger.error('Error creating database connection:', error)
        throw error
      }
    }
    return this.dataSource
  }

  private async initDataSource(databasePath: string) {
    const config: SqliteConnectionOptions = {
      type: 'sqlite',
      database: databasePath,
      logging: Environment.isDev && true,
      synchronize: false,
      dropSchema: false,
      migrationsRun: true,
      logger: new DatabaseLogger(),
      entities: [
        AccountEntity,
        BookEntity,
        CategoryGroupEntity,
        InstitutionEntity,
        LineItemEntity,
        TagEntity,
        TransactionEntity,
        UserEntity,
      ],
      migrations: [InitDatabase1624237602767],
    }
    logger.info(
      'Connecting to Database ' +
        databasePath +
        ' on ' +
        Environment.platform +
        ' - ' +
        Environment.environment,
    )

    const dataSource = new DataSource(config)
    await dataSource.initialize()

    return dataSource
  }
}
