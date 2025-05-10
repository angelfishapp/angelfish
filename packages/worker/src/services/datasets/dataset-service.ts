import sqlite3 from 'sqlite3'

import type { AppCommandRequest, AppCommandResponse } from '@angelfish/core'
import { AppCommandIds, Command, Environment } from '@angelfish/core'
import { getWorkerLogger } from '../../logger'
import type { DatasetConfig } from './dataset-interface'
import { InvalidDataError } from './dataset-service-errors'
import { jsonSchemaToColNames, jsonSchemaToSqlTable } from './dataset-utils'

// Default Datasets
import { Currencies } from './currencies'

// Initialise Logger
const logger = getWorkerLogger('DatasetService')

/**
 * Service to manage datasets in Angelfish. Each dataset is defined as an AJV JSON Schema
 * with a unique name, and will create a new SQLite table to store data. Once registered,
 * data can be inserted and queried using the DatasetService.
 *
 * This service is used to store public datasets, such as currency exchange rates, stock prices
 * etc. which don't need to be stored in the user's book database making the file uncessarily larger
 * as the data can be easily recovered when the user connects online and syncs if the local database is deleted.
 *
 * It is designed to work offline and be updated during the sync process when the user is online. By
 * default will store the datasets in the user's data directory under the 'datasets.db' file.
 *
 * This is a very simple implementation, and does not support migrations if the dataset schema changes. It is
 * recommended just to delete the dataset and re-register it with the new schema as it should be easy to reload
 * the data when the user is online.
 */
class DatasetServiceClass {
  // Database connection
  private _db: sqlite3.Database
  // Registered Dataset Configurations
  private _datasetConfigs = new Map<string, DatasetConfig<unknown>>()

  /**
   * Constructor for the Dataset Service. If running in Test environment will only use in-memory
   * database otherwise will load file from user data directory.
   */
  public constructor() {
    const dbPath = Environment.isTest ? ':memory:' : `${Environment.userDataDir}/datasets.db`
    logger.debug(`Using SQLite database at ${dbPath}`)
    this._db = new sqlite3.Database(dbPath, (err) => {
      if (err) logger.error(`Error opening Datasets database ${dbPath}:`, err.message)
      else logger.info('Connected to Datasets SQLite database.')
    })

    // Register default datasets
    this._registerDefaultDatasets()
  }

  /**
   * Register default datasets on initialisation
   */
  private _registerDefaultDatasets() {
    this.registerDataset(Currencies)
      .then()
      .catch((err) => {
        logger.error('Error registering default dataset:', err)
      })
  }

  /**
   * Register a dataset and create the corresponding table in SQLite.
   *
   * Wraps code in Promise as SQLite operations only support callbacks and we want to use
   * async/await for cleaner code.
   *
   * @param dataset Dataset configuration
   * @throws        If dataset with the same name is already registered or issues with schema
   */
  public async registerDataset<T>(dataset: DatasetConfig<T>): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if dataset with same name is already registered
      if (this._datasetConfigs.has(dataset.name)) {
        return reject(new Error(`Dataset "${dataset.name}" already registered.`))
      }

      // Create table columns SQL schema from JSON Schema
      const sql = jsonSchemaToSqlTable(dataset.schema, dataset.name, dataset.primaryKey)
      logger.debug(`Creating table for dataset "${dataset.name}" with SQL: ${sql}`)

      // Run SQL to create table
      this._db.run(sql, (err) => {
        if (err) {
          reject(err)
        } else {
          // Add dataset configuration to map
          this._datasetConfigs.set(dataset.name, dataset as DatasetConfig<unknown>)
          logger.info(`Dataset "${dataset.name}" registered.`)
          resolve()
        }
      })
    })
  }

  /**
   * List all registered datasets
   *
   * @returns Array of dataset names
   */
  @Command(AppCommandIds.LIST_DATASETS)
  public async listDatasets(
    _r: AppCommandRequest<AppCommandIds.LIST_DATASETS>,
  ): AppCommandResponse<AppCommandIds.LIST_DATASETS> {
    return Array.from(this._datasetConfigs.keys())
  }

  /**
   * Insert or update data into a dataset. If the data already exists in the dataset
   * it will be updated, otherwise it will be inserted, using primary key column(s) to
   * identify the row.
   *
   * Wraps code in Promise as SQLite operations only support callbacks and we want to use
   * async/await for cleaner code.
   *
   * @param datasetName Name of the dataset
   * @param data        Data to insert
   * @returns           Promise that resolves when data is inserted
   * @throws            If dataset is not registered, data is invalid or issues with SQL
   */
  @Command(AppCommandIds.INSERT_DATASET_ROWS)
  public insertData({
    datasetName,
    rows,
  }: AppCommandRequest<AppCommandIds.INSERT_DATASET_ROWS>): AppCommandResponse<AppCommandIds.INSERT_DATASET_ROWS> {
    return new Promise((resolve, reject) => {
      // First validate the data against the schema
      const datasetConfig = this._datasetConfigs.get(datasetName)
      if (!datasetConfig) {
        return reject(new Error(`Dataset "${datasetName}" not found.`))
      }
      const validate = datasetConfig.validate
      for (const row of rows) {
        if (!validate(row)) {
          return reject(new InvalidDataError(datasetName, row, validate.errors))
        }
      }

      // If data is valid, insert or update into the dataset
      const colNames = jsonSchemaToColNames(datasetConfig.schema)
      const sql = `INSERT OR REPLACE INTO ${datasetName} (${colNames.join(', ')}) VALUES (${colNames
        .map(() => '?')
        .join(', ')})`
      logger.info(
        `Inserting or updating ${rows.length} rows into dataset "${datasetName}" with sql: ${sql}`,
      )
      this._db.serialize(() => {
        const stment = this._db.prepare(sql)

        let pending = rows.length // Track the number of pending insertions

        for (const row of rows) {
          const values = colNames.map((col) => (row as Record<string, any>)[col]) // Use raw values

          stment.run(values, (err) => {
            if (err) {
              stment.finalize()
              return reject(err)
            }

            pending -= 1 // Decrement pending count
            if (pending === 0) {
              stment.finalize()
              logger.info(`Inserted/updated ${rows.length} rows into dataset "${datasetName}".`)
              resolve()
            }
          })
        }
      })
    })
  }

  /**
   * Run a saved query from the dataset configuration
   *
   * Wraps code in Promise as SQLite operations only support callbacks and we want to use
   * async/await for cleaner code.
   *
   * @param datasetName   Name of the dataset
   * @param queryName     Name of the saved query
   * @param params        Parameters for the query if needed
   * @returns             Promise that resolves with the results
   */
  @Command(AppCommandIds.RUN_DATASET_QUERY)
  public runSavedQuery({
    datasetName,
    queryName,
    params,
  }: AppCommandRequest<AppCommandIds.RUN_DATASET_QUERY>): AppCommandResponse<AppCommandIds.RUN_DATASET_QUERY> {
    return new Promise((resolve, reject) => {
      // First validate the data against the schema
      const datasetConfig = this._datasetConfigs.get(datasetName)
      if (!datasetConfig) {
        return reject(new Error(`Dataset "${datasetName}" not found.`))
      }
      // Check if saved query exists
      const savedQuery = datasetConfig.savedQueries?.[queryName]
      if (!savedQuery) {
        return reject(
          new Error(`Saved query "${queryName}" not found for dataset "${datasetName}".`),
        )
      }
      // Check if saved query has parameters
      if (savedQuery.includes('?') && params && params.length === 0) {
        return reject(new Error(`Saved query "${queryName}" requires parameters.`))
      }

      // Run the saved query
      const stment = this._db.prepare(savedQuery)
      stment.all(params, (err, rows) => {
        if (err) {
          stment.finalize()
          return reject(err)
        }
        logger.silly(`${rows.length} Results`, rows)
        resolve(rows)
      })
      stment.finalize()
    })
  }

  /**
   * Delete a dataset and all its data in the SQLite database and remove from the local
   * registry
   *
   * Wraps code in Promise as SQLite operations only support callbacks and we want to use
   * async/await for cleaner code.
   *
   * @param datasetName   The name of the dataset to delete
   * @returns             Promise that resolves when the dataset is deleted
   */
  public deleteDataset(datasetName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._db.serialize(() => {
        this._db.run(`DROP TABLE IF EXISTS ${datasetName}`, (err) => {
          if (err) return reject(err)
          this._datasetConfigs.delete(datasetName)
          resolve()
        })
      })
    })
  }

  /**
   * Close the database connection and clear all dataset configurations
   *
   * Wraps code in Promise as SQLite operations only support callbacks and we want to use
   * async/await for cleaner code.
   */
  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._db.close((err) => {
        if (err) return reject('Error closing database: ' + err.message)
        this._datasetConfigs.clear()
        resolve()
      })
    })
  }
}

// Export instance of Class
export const DatasetService = new DatasetServiceClass()
