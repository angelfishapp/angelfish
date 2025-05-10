import type { JSONSchemaType } from 'ajv'

/**
 * Type definition for a SQL column.
 */
type SqlColumn = {
  /**
   * Column name.
   */
  name: string
  /**
   * Column type.
   */
  type: string
  /**
   * Any column constraints
   */
  constraints: string[]
}

/**
 * Convert an AJV JSON Schema to a SQLite CREATE TABLE statement. The schema must meet
 * the following criteria to be converted:
 *
 *  - Must be of type "object"
 *  - Must have "additionalProperties" set to false
 *  - Must have a "properties" object
 *  - Must have a "required" array
 *  - Can not have a property named "id", which is reserved for the primary key.
 *
 * @param schema        AJV JSON Schema
 * @param tableName     Name of the table to create.
 * @param primaryKeys   Optional array of primary key column names. If not set, will automatically add an auto-incrementing "id" column.
 * @returns             SQLite CREATE TABLE statement.
 * @throws              If the schema is invalid or unsupported.
 */
export function jsonSchemaToSqlTable<T>(
  schema: JSONSchemaType<T>,
  tableName: string,
  primaryKeys?: string[],
): string {
  // Checks for valid properties and arguments
  if (!schema || !schema.properties) {
    throw new Error('Invalid schema: Missing properties.')
  }
  if (schema.type !== 'object') {
    throw new Error('Invalid schema: Must be of type "object".')
  }
  if (schema.additionalProperties !== false) {
    throw new Error('Invalid schema: additionalProperties must be false.')
  }
  // Check table name is valid
  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(tableName) === false) {
    throw new Error(`Invalid dataset name "${tableName}". Must be a valid SQLite table name.`)
  }
  // Check primary keys are defined in schema
  if (primaryKeys) {
    for (const key of primaryKeys) {
      if (!schema.properties[key]) {
        throw new Error(`Primary key column "${key}" not found in schema.`)
      }
    }
  }

  // Loop through the schema properties and generate the column definitions
  const columns: SqlColumn[] = Object.entries(schema.properties).map(([key, value]) => {
    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(key) === false) {
      throw new Error(`Invalid column name "${key}". Must be a valid SQLite column name.`)
    }

    const property = value as JSONSchemaType<unknown>
    // Get  column type
    let columnType = 'TEXT'
    switch (property.type) {
      case 'string':
        if (property.format === 'date-time') {
          columnType = 'DATETIME'
          break
        }
        columnType = 'TEXT'
        break
      case 'integer':
        columnType = 'INTEGER'
        break
      case 'number':
        columnType = 'REAL'
        break
      case 'boolean':
        columnType = 'BOOLEAN'
        break
      default:
        throw new Error(`Unsupported JSON Schema type: ${schema.type}`)
    }

    const sqlColumn: SqlColumn = {
      name: key,
      type: columnType,
      constraints: [],
    }

    // Handle required fields
    if (schema.required && schema.required.includes(key)) {
      sqlColumn.constraints.push('NOT NULL')
    }

    // Handle default values
    if ('default' in property) {
      const defaultValue = property.default
      switch (typeof defaultValue) {
        case 'string':
          sqlColumn.constraints.push(`DEFAULT ${defaultValue}`)
          break
        case 'boolean':
          sqlColumn.constraints.push(`DEFAULT ${defaultValue ? '1' : '0'}`)
          break
        case 'number':
          sqlColumn.constraints.push(`DEFAULT ${defaultValue}`)
          break
        default:
          throw new Error(`Unsupported default value type: ${typeof defaultValue}`)
      }
    }

    return sqlColumn
  })

  // Generate the SQL statement, add id column as primary key automatically if not set
  let columnDefinitions = ''
  if (!primaryKeys) {
    columnDefinitions += `  id INTEGER PRIMARY KEY,\n`
  }
  columnDefinitions += columns
    .map((col) => `  ${col.name} ${col.type} ${col.constraints.join(' ')}`)
    .join(',\n')

  return `CREATE TABLE IF NOT EXISTS ${tableName} (\n${columnDefinitions} ${
    primaryKeys ? `,\n  PRIMARY KEY (${primaryKeys.join(', ')})` : ''
  }\n);`
}

/**
 * Convert an AJV JSON Schema to an array of column names.
 *
 * @param schema    AJV JSON Schema
 * @returns         Array of column names
 * @throws          If the schema is invalid or unsupported.
 */
export function jsonSchemaToColNames<T>(schema: JSONSchemaType<T>): string[] {
  if (!schema || !schema.properties) {
    throw new Error('Invalid schema: Missing properties.')
  }
  if (schema.type !== 'object') {
    throw new Error('Invalid schema: Must be of type "object".')
  }
  if (schema.additionalProperties !== false) {
    throw new Error('Invalid schema: additionalProperties must be false.')
  }

  return Object.keys(schema.properties)
}
