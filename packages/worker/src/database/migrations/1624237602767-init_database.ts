import type { MigrationInterface, QueryRunner } from 'typeorm'

import { getWorkerLogger } from '../../logger'
import { DefaultCategories } from './default-categories'

const logger = getWorkerLogger('InitDatabase1624237602767')

/**
 * Initialise the database first time, creating all necessary tables and importing any
 * setup data such as default categories
 */
export default class InitDatabase1624237602767 implements MigrationInterface {
  /**
   * Main function called to start initialisation of new database
   *
   * @param queryRunner   A single connection to database to run queries against
   */
  async up(queryRunner: QueryRunner): Promise<any> {
    // Create Users Table
    let initSql = `
                        CREATE TABLE IF NOT EXISTS users (
                            id INTEGER,
                            created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
                            modified_on DATETIME DEFAULT CURRENT_TIMESTAMP,
                            
                            email TEXT NOT NULL,
                            first_name TEXT NOT NULL,
                            last_name TEXT NOT NULL,
                            cloud_id TEXT,
                            phone TEXT,
                            avatar TEXT,

                            CONSTRAINT id PRIMARY KEY (id),
                            UNIQUE (cloud_id)            
                        );`
    await queryRunner.query(initSql)

    // Create Book Table
    initSql = `
                        CREATE TABLE IF NOT EXISTS book (
                            id INTEGER,
                            created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
                            modified_on DATETIME DEFAULT CURRENT_TIMESTAMP,
                            
                            name TEXT NOT NULL,
                            entity TEXT DEFAULT 'HOUSEHOLD' NOT NULL,
                            country TEXT NOT NULL,
                            default_currency TEXT NOT NULL,
                            logo TEXT,
                
                            CONSTRAINT id PRIMARY KEY (id)  
                        );`
    await queryRunner.query(initSql)

    // Create Categories Group Table
    initSql = `
                        CREATE TABLE IF NOT EXISTS category_groups (
                            id INTEGER,
                            created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
                            modified_on DATETIME DEFAULT CURRENT_TIMESTAMP,

                            name TEXT NOT NULL,
                            icon TEXT NOT NULL,
                            type TEXT NOT NULL,
                            description TEXT NOT NULL,
                            color TEXT,

                            CONSTRAINT id PRIMARY KEY(id),
                            UNIQUE (name)
                        );`
    await queryRunner.query(initSql)

    // Create Institutions Table
    initSql = `
                        CREATE TABLE IF NOT EXISTS institutions (
                            id INTEGER,
                            created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
                            modified_on DATETIME DEFAULT CURRENT_TIMESTAMP,
                            is_open INTEGER DEFAULT 1 NOT NULL,
                            
                            name TEXT NOT NULL,
                            country TEXT NOT NULL,
                            logo TEXT,
                            primary_color TEXT,
                            url TEXT,

                            CONSTRAINT id PRIMARY KEY(id)
                        );`
    await queryRunner.query(initSql)

    // Create Accounts Table
    initSql = `
                        CREATE TABLE IF NOT EXISTS accounts (
                            id INTEGER,
                            created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
                            modified_on DATETIME DEFAULT CURRENT_TIMESTAMP,

                            class TEXT NOT NULL,
                            name TEXT NOT NULL,
                            
                            cat_group_id INTEGER,
                            cat_type TEXT,
                            cat_description TEXT,
                            cat_icon TEXT,

                            acc_institution_id INTEGER,
                            acc_sort TEXT,
                            acc_number TEXT,
                            acc_mask TEXT,
                            acc_type TEXT,
                            acc_subtype TEXT,
                            acc_iso_currency TEXT,
                            acc_start_balance REAL DEFAULT 0.0 NOT NULL,
                            acc_interest_rate REAL DEFAULT 0.0 NOT NULL,
                            acc_limit REAL DEFAULT 0.0 NOT NULL,
                            acc_is_open INTEGER DEFAULT 1 NOT NULL,

                            CONSTRAINT id PRIMARY KEY(id),
                            FOREIGN KEY(cat_group_id) REFERENCES category_groups(id),
                            FOREIGN KEY(acc_institution_id) REFERENCES institutions(id) ON DELETE CASCADE
                        );`
    await queryRunner.query(initSql)

    // Create Account Owners Join (Many to Many) Table
    initSql = `
        CREATE TABLE IF NOT EXISTS account_owners (
            account_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            
            PRIMARY KEY (account_id, user_id)
            FOREIGN KEY(account_id) REFERENCES accounts(id) ON DELETE CASCADE,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );`
    await queryRunner.query(initSql)

    // Create Transactions Table
    initSql = `
                        CREATE TABLE IF NOT EXISTS transactions (
                            id INTEGER,
                            date DATE DEFAULT (date('now')),
                            created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
                            modified_on DATETIME DEFAULT CURRENT_TIMESTAMP,
                            account_id INTEGER NOT NULL,
                            title TEXT NOT NULL,
                            amount REAL NOT NULL,
                            currency_code TEXT NOT NULL,
                            requires_sync INTEGER DEFAULT 1 NOT NULL,
                            pending INTEGER DEFAULT 0 NOT NULL,
                            is_reviewed INTEGER DEFAULT 0 NOT NULL,
                            
                            import_id TEXT,
                            
                            CONSTRAINT id PRIMARY KEY(id),
                            UNIQUE (account_id, import_id),
                            FOREIGN KEY(account_id) REFERENCES accounts(id) ON DELETE CASCADE
                        );`
    await queryRunner.query(initSql)

    // Create Line Items Table
    initSql = `
                        CREATE TABLE IF NOT EXISTS line_items (
                            id INTEGER,
                            transaction_id INTEGER NOT NULL,
                            amount REAL NOT NULL,
                            local_amount REAL NOT NULL,
                            account_id INTEGER,
                            note TEXT,
                            
                            CONSTRAINT id PRIMARY KEY(id),
                            FOREIGN KEY(transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
                            FOREIGN KEY(account_id) REFERENCES accounts(id)
                        );`
    await queryRunner.query(initSql)

    // Create Tags Table
    initSql = `
                        CREATE TABLE IF NOT EXISTS tags (
                            id INTEGER,
                            created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
                            modified_on DATETIME DEFAULT CURRENT_TIMESTAMP,
                            name TEXT,
                            
                            CONSTRAINT id PRIMARY KEY(id),
                            UNIQUE(name)
                        );`
    await queryRunner.query(initSql)

    // Create Line Items Tags Join (Many to Many) Table With Index
    initSql = `
                        CREATE TABLE IF NOT EXISTS line_item_tags (
                            line_item_id INTEGER,
                            tag_id INTEGER,
                            
                            PRIMARY KEY (line_item_id, tag_id)
                            FOREIGN KEY(line_item_id) REFERENCES line_items(id) ON DELETE CASCADE,
                            FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE
                        );`
    await queryRunner.query(initSql)

    // Create indexes
    initSql = `
                        CREATE INDEX IDX_line_items_tags ON line_item_tags (
                            "line_item_id"
                        );
                        CREATE INDEX IDX_transaction_line_items ON line_items (
                            "transaction_id"
                        );`
    await queryRunner.query(initSql)

    // Insert default categories
    await this.insertDefaultCategories(queryRunner)
  }

  /**
   * No need for rollback function as this is the initial schema
   *
   * @param queryRunner   A single connection to database to run queries against
   */
  async down(): Promise<any> {}

  /**
   * Load default categories from default-categories.ts file and insert into database
   *
   * @param queryRunner   A single connection to database to run queries against
   */
  async insertDefaultCategories(queryRunner: QueryRunner) {
    const categoryGroups: Array<any> = []
    const categories: Array<any> = []
    let cat_group_id = 1

    // Load default categories
    Object.entries(DefaultCategories).forEach(([groupName, groupData]) => {
      // Create Category Group row
      const groupRow = {
        id: cat_group_id,
        name: groupName,
        type: groupData.type,
        description: groupData.description,
        icon: groupData.icon,
        color: groupData.color,
      }
      categoryGroups.push(groupRow)

      Object.entries(groupData.categories).forEach(([categoryName, categoryData]) => {
        const categoryRow = {
          class: 'CATEGORY',
          cat_group_id,
          name: categoryName,
          cat_type: categoryData.type,
          cat_description: categoryData.description,
          cat_icon: categoryData.icon,
        }
        categories.push(categoryRow)
      })

      cat_group_id++
    })

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('category_groups', ['id', 'name', 'type', 'description', 'icon', 'color'])
        .values(categoryGroups)
        .execute()
    } catch (error) {
      logger.error('Error loading Category Groups: ' + error)
    }

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('accounts', [
          'class',
          'cat_group_id',
          'name',
          'cat_type',
          'cat_description',
          'cat_icon',
        ])
        .values(categories)
        .execute()
    } catch (error) {
      logger.error('Error loading Categories: ' + error)
    }
  }
}
