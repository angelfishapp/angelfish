import type { JSONSchemaType } from 'ajv'

import { TestLogger } from '@angelfish/tests'
import { jsonSchemaToSqlTable } from './dataset-utils'

type TestType = {
  name: string
  age?: number
  active?: boolean
  created_at?: string
}

/**
 * Tests
 */

describe('dataset.utils', () => {
  test('test jsonSchemaToSqlTable', () => {
    const schema: JSONSchemaType<TestType> = {
      type: 'object',
      properties: {
        name: { type: 'string', nullable: false },
        age: { type: 'number', nullable: true },
        active: { type: 'boolean', nullable: true },
        created_at: { type: 'string', format: 'date-time', nullable: true },
      },
      required: ['name'],
      additionalProperties: false,
    }

    const sql = jsonSchemaToSqlTable(schema, 'test_table')
    TestLogger.log('SQL:', sql)
    expect(sql.replace(/[\s\t]+/g, '').trim()).toEqual(
      `CREATE TABLE IF NOT EXISTS test_table (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        age REAL ,
        active BOOLEAN ,
        created_at DATETIME
      );`
        .replace(/[\s\t]+/g, '')
        .trim(),
    )
  })
  test('test jsonSchemaToSqlTable with invalid column name', () => {
    type IdTestType = { 'invalid-column': number } & TestType
    const schema: JSONSchemaType<IdTestType> = {
      type: 'object',
      properties: {
        'invalid-column': { type: 'number', nullable: false },
        name: { type: 'string', nullable: false },
        age: { type: 'number', nullable: true },
        active: { type: 'boolean', nullable: true },
        created_at: { type: 'string', format: 'date-time', nullable: true },
      },
      required: ['name'],
      additionalProperties: false,
    }
    expect(() => jsonSchemaToSqlTable(schema, 'test_table')).toThrow(
      'Invalid column name "invalid-column". Must be a valid SQLite column name.',
    )
  })
  test('test jsonSchemaToSqlTable with primary keys', () => {
    type CurrencyRate = {
      date: string
      currency: string
      rate: number
    }
    const schema: JSONSchemaType<CurrencyRate> = {
      type: 'object',
      properties: {
        date: { type: 'string' },
        currency: { type: 'string', enum: [] },
        rate: { type: 'number' },
      },
      required: ['date', 'currency', 'rate'],
      additionalProperties: false,
    }
    const sql = jsonSchemaToSqlTable(schema, 'test_table', ['date', 'currency'])
    TestLogger.log('SQL:', sql)
    expect(sql.replace(/[\s\t]+/g, '').trim()).toEqual(
      `CREATE TABLE IF NOT EXISTS test_table (
          date TEXT NOT NULL,
          currency TEXT NOT NULL,
          rate REAL NOT NULL ,
          PRIMARY KEY (date, currency)
      );`
        .replace(/[\s\t]+/g, '')
        .trim(),
    )
  })
})
