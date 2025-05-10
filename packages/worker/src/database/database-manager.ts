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
class DatabaseManagerClass {
  private databasePath?: string
  private dataSource?: DataSource

  /**
   * Get the current database coonection for the app.
   *
   * @returns {DataSource}  The current TypeORM DataSource connection to the database
   */
  public getConnection(): DataSource {
    if (!this.dataSource) {
      throw new Error('Database connection has not been initialized')
    }
    return this.dataSource
  }

  /**
   * Initialize the SQLite Database connection using TypeORM DataSource. If an existing connection exists
   * with the same databasePath, it will do nothing, otherwise it will close the existing one and create
   * a new connection.
   *
   * @param databasePath  File path to SQLite Database file. Must be absolute path, do not use ~ or other
   *                      shortcuts or it won't create a database to file. If databasePath is set to ':memory:'
   *                      will create temporary in-memory SQLite Database, useful for unit testing.
   * @return              Promise<DataSource>
   */
  public async initConnection(databasePath: string): Promise<DataSource> {
    if (this.dataSource && this.databasePath && this.databasePath === databasePath) {
      // Do nothing if it already exists and databasePath is the same
      return this.dataSource
    }

    // Close existing connection if it exists and databasePath is different
    await this.close()

    // Create new connection
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
    this.dataSource = dataSource
    this.databasePath = databasePath

    return this.dataSource
  }

  /**
   * Close the current database connection and destroy the DataSource.
   */
  public async close() {
    if (this.dataSource) {
      await this.dataSource.destroy()
      this.dataSource = undefined
      this.databasePath = undefined
    }
  }

  /**
   * Property to determine if the database connection has been initialized and is ready for use.
   */
  public get isInitialized(): boolean {
    return !!this.dataSource && this.dataSource.isInitialized
  }

  /**
   * The current filePath of the database connection. If no database connection has been initialized,
   * this will return undefined. If the databasePath is set to ':memory:', this will also return
   * ':memory:'.
   */
  public get filePath(): string | undefined {
    return this.databasePath
  }
}

// Export instance of Class
export const DatabaseManager = new DatabaseManagerClass()
