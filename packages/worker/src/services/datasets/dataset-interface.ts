import type { JSONSchemaType } from 'ajv'

/**
 * Configuration options for a new dataset in Angelfish
 */
export interface DatasetConfig<T> {
  /**
   * Unique Name of the dataset. Must be a valid SQLite table name and
   * should contain only letters, numbers and underscores (no special
   * characters or spaces) as shown below:
   *
   *    - currencyrates
   *    - currency_rates
   *    - rates1
   *    - _Rates1
   *
   * This name will create a new table with the same name if it doesn't exist, and
   * will be used to reference the dataset in queries.
   */
  name: string
  /**
   * JSON Schema for the dataset
   */
  schema: JSONSchemaType<T>
  /**
   * Primary key columns for the dataset. If not specified, the table will have
   * an auto-incrementing primary key column named "id".
   */
  primaryKey?: string[]
  /**
   * Saved queries for the dataset. The key is the query name and the value is the SQL query.
   */
  savedQueries?: Record<string, string>
}
