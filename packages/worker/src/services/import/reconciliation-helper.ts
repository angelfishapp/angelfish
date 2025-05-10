import Fuse from 'fuse.js'

import type { ITransaction, ReconciledTransaction } from '@angelfish/core'
import { getTransactionCategory, isSplitTransaction, updateTransaction } from '@angelfish/core'
import { getWorkerLogger } from '../../logger'

const logger = getWorkerLogger('ReconciliationHelper')

/**
 * Normalised Transaction type to store transactions in index
 * for easy searching and matching
 */
type NormalisedTransaction = {
  date: Date
  title: string
  amount: number
  import_id?: string
  isSplit: boolean
  category: number | null
  original: ITransaction
}

/**
 * Utility class to help Reconcile Transactions. The class is initialised
 * with a list of existing reference Transactions which are used to de-duplicate
 * and categorise new Transactions.
 *
 * The class will normalise the titles of the Transactions and create an index
 * to quickly search for similar transactions. It will also use a fuzzy search
 * to find similar transactions if no direct matches are found.
 */
export class ReconciliationHelper {
  /**
   * Index to lookup transactions by normalised title
   */
  private _index: Map<string, number[]> = new Map()

  /**
   * Fuze index for fuzzy searches on title
   */
  private _fuseIndex: Fuse<NormalisedTransaction>

  /**
   * Original list of transactions in index
   */
  private _normalisedTransactions: NormalisedTransaction[]

  /**
   * Initialise the index with a list of existing reference
   * transactions
   *
   * @param transactions  List of existing reference transactions
   *                      to index, match and use to predict categories
   *                      for new transactions
   */
  constructor(transactions: ITransaction[]) {
    const startTime = performance.now()
    // Create index and normalise transactions
    this._normalisedTransactions = transactions.map((t, idx) => {
      const normalisedTitle = this._normaliseTitle(t.title)
      if (this._index.has(normalisedTitle)) {
        const indexes = this._index.get(normalisedTitle) as number[]
        indexes.push(idx)
        this._index.set(normalisedTitle, indexes)
      } else {
        this._index.set(normalisedTitle, [idx])
      }
      // Return normalised Transaction
      return {
        date: t.date,
        title: normalisedTitle,
        amount: t.amount,
        import_id: t.import_id,
        isSplit: isSplitTransaction(t),
        category: getTransactionCategory(t),
        original: t,
      }
    })

    // Initialise Fuse index
    // Fuse options: https://www.fusejs.io/api/options.html
    this._fuseIndex = new Fuse(this._normalisedTransactions, {
      includeScore: true,
      threshold: 0.4,
      keys: ['title'],
    })

    const endTime = performance.now()
    logger.silly('Created Index', this._index)
    logger.debug(`Built index for ${transactions.length} Transactions in ${endTime - startTime}ms`)
  }

  /**
   * Given a list of transactions, will attempt to reconcile them, marking them as duplicate if they
   * aleady exist, and for new categories will attempt to predict the most likely category for the
   * transaction for the user to review
   *
   * @param transactions The transactions to reconcile
   * @returns            The reconciled transactions
   */
  public reconcile(transactions: ITransaction[]): ReconciledTransaction[] {
    const startTime = performance.now()

    let newCount = 0
    let duplicateCount = 0
    const results: ReconciledTransaction[] = transactions.map((transaction) => {
      // First find if there is a match for the transaction
      const matches = this.match(transaction)
      if (matches.length > 0) {
        // If we found a match, we can assume this is a duplicate transaction
        duplicateCount++
        return {
          import: false,
          reconciliation: 'duplicate',
          ...transaction,
          id: matches[0].id,
        }
      }
      // If no match is found, we can assume this is a new transaction
      newCount++

      // Do not update transaction if it is split or already categorised
      if (isSplitTransaction(transaction) || getTransactionCategory(transaction) !== null) {
        return {
          import: true,
          reconciliation: 'new',
          ...transaction,
        }
      }

      // Othereise predict the category for the transaction
      const category_id = this.predictCategory(transaction)
      return {
        import: true,
        reconciliation: 'new',
        ...updateTransaction(transaction, { category_id }),
      }
    })

    const endTime = performance.now()
    logger.debug(
      `Reconciled ${transactions.length} Transactions in ${
        endTime - startTime
      }ms: ${newCount} New, ${duplicateCount} Duplicates`,
    )
    return results
  }

  /**
   * Given a transaction, will search for similar transactions and predict
   * the most likely category for the transaction. This version does a simple
   * count of the most common category for that Payee. If it cannot find a clear
   * winner, or any search results, it will return null (Unclassified)
   *
   * Design Overview:
   *
   * Most personal finance tools use a rigid set of rules to categorise transactions when importing
   * transactions. While this can work well at first, I've found that over time the number of rules
   * explodes, and they need to be regularly fixed and maintained as my habits change. As a result,
   * Angelfish is first and foremost designed to make manually categorising all your transactions in
   * the UI as fast as possible, so you can quickly edit and correct categories on your transactions
   * for accurate reports. However, in an ideal world, the application should just "learn" my categorisation
   * habits over time and start to categorise transactions for me, with a decent UX to double check and
   * fix mistakes before importing new transactions to the database.
   *
   * An LLM model could be ideal for this, but is extremely slow and heavy, and would require the user to download
   * a large multi-GB model file to their local machine (assuming their machine can run it). Over time, I expect
   * most popular OS's to have a built in LLM with local API which we can use to automate this task locally for the
   * user among other things.
   *
   * Until then, we need a much lighter, simpler approach, that works fast so the user isn't waiting too long for
   * new imported transactions to appear in the review step of the UI so they can double check the reconciled
   * transactions before importing them to the database (i.e. < 2 seconds even for large list of transactions).
   *
   * This is where we use some simple normalisation and (in future) scoring to predict the category of a transaction.
   *
   * Generally, most transactions of the same type will have the same Payee. However many Payees
   * will use different titles depending on the store/location. For example, "Starbucks" could be
   * "Starbucks Coffee", "Starbucks LAX", "Starbucks#1234", "Starbucks STORE 1234", etc. This makes it
   * difficult to exactly match a transaction using title, unless a fuzzy matching algorithm is used.
   * However, fuzzy matching on long lists of transactions can be slow, so this is why we normalise the
   * title into the index when initialising the class removing all special characters and numbers. Generally,
   * this will return exact matches on title without using fuzzy search, however we can fall back to fuzzy
   * searching using Fuse.js if no exact matches are found (10s of ms slower than exact match which can add up if
   * importing a large number of transactions).
   *
   * Once matches are found using the title, we then need to determine the most likely category for the
   * transaction. For now, we will just return the most common category used for that Payee, as most of the
   * time, the user will use the same category for the same Payee. If we cannot find a clear winner, we return
   * null (Unclassified) and let the user set the category manually. If a user changes their habits on how they
   * categorise a particular Payee, eventally the algorithm will start to predict the new category as they import
   * more transactions. Potentially (TODO) we could also give more weight to recent transactions than older ones
   * to ensure the algoorithm adapts quicker to user habits changing as right now they would have to wait until
   * they have more transactions with the new category to see the change in prediction.
   *
   * In future (TODO) we could add a scoring algorithm to determine the most likely category based on the amount
   * too. For example, I regularly buy ground coffee from Philz, but also purchase a cup of coffee from there most
   * of the time. Amounts over $40 are generally me buying Ground Coffee (Groceries), and amounts under $40 are
   * generally me buying a cup of coffee (Dining Out). The score could combine the freqency of the category, recency of
   * the transaction and average distance in amount from the transaction, and potentially other factors, to determine
   * the most likely category for the transaction too.
   *
   * The key approach however is to do it fast, and lightweight without using any heavy machine learning models or
   * having the user create and maintain a large set of rules.
   *
   * For now, we just use the most common category for the Payee, and if we cannot find a clear winner, or the
   * Transaction is usually split (with multiple categories), we just return null and let the user decide when
   * they review the reconciled transactions.
   *
   * @param transaction   The Transaction to Categorise
   * @returns             The predicted category. Will return null if no matches
   *                      are found or the categories are split transactions which
   *                      require the user to split manually
   */
  public predictCategory(transaction: ITransaction): number | null {
    const startTime = performance.now()
    const matches = this._search(transaction.title)
    if (!matches || matches.length === 0) {
      // If no matches found, return null
      return null
    }
    // If matches found, iterate and determine most likely category
    const categories: Map<number | null, number> = new Map()
    matches.map((t) => {
      if (!t.isSplit) {
        // Skip over split transations
        // TODO figure out more complex categorisation for splits
        const category = t.category ?? null
        if (categories.has(category)) {
          const counter = (categories.get(category) as number) + 1
          categories.set(category, counter)
        } else {
          categories.set(category, 1)
        }
      }
    })

    logger.silly('Categories', [...categories.entries()])
    let mostFrequentCategory: number | null = null
    let highestCounter = 0
    let multiple = false

    // Iterate through all entries in the map to find
    // most frequent category. If more than one category
    // at top of list, return null as we can't decide
    // which of the two to use and let user set category
    // manually
    for (const [key, value] of categories.entries()) {
      if (value === highestCounter) {
        multiple = true
      }
      if (value > highestCounter) {
        highestCounter = value
        mostFrequentCategory = key
        multiple = false
      }
    }
    const result = multiple ? null : mostFrequentCategory
    const endTime = performance.now()
    logger.debug(
      `Predicted Category ${result} for '${transaction.title}' from ${
        matches.length
      } Transactions containing ${categories.size} categories in ${endTime - startTime}ms`,
    )
    return result
  }

  /**
   * Will try to find a match for a given transaction in the indexed transactions. It will
   * first look for an exact match on the import_id, if found will return the original.
   *
   * If no match, it will then look to see if a transaction, within the date range,
   * exists with the same amount and same title. We do not match on exact date as sometimes
   * different systems will show different dates, or banks will change the date once a
   * transaction is cleared, so we need to be fuzzy on the date.
   *
   * Will return all matches found or empty array if none found. There could be more than one
   * match if the user paid the same amount to the same payee on the same day several times. It
   * is up to the caller of this method to determine the best way to assign multiple matches like
   * this to existing transactions during reconciliation.
   *
   * @param transaction   The Transaction to find a match for
   * @param dayRange      The number of days before and after to search (@default 7)
   * @returns             The matched transaction(s) or empty array if no match found
   */
  public match(transaction: ITransaction, dayRange = 7): ITransaction[] {
    const startTime = performance.now()

    // 1. Match on import_id if it exists - highest fidelity match
    if (transaction.import_id) {
      // import_id is a unique identifier so should only be one match if found
      const match = this._normalisedTransactions.find((t) => t.import_id === transaction.import_id)
      if (match) {
        logger.silly(
          `Step 1: Found import_id match for '${transaction.title}' in ${
            performance.now() - startTime
          }ms`,
        )
        return [match.original]
      }
    }

    // 2. If no import_id match, then we need to do a fuzzy search based on date range and amount

    // Prune the index to the search date range
    // Calculate start and end dates of the range
    const startDate = new Date(transaction.date)
    startDate.setDate(transaction.date.getDate() - dayRange)
    const endDate = new Date(transaction.date)
    endDate.setDate(transaction.date.getDate() + dayRange)

    // Filter the array
    const matches = this._normalisedTransactions.filter(
      (t) => t.date >= startDate && t.date <= endDate && t.amount === transaction.amount,
    )

    // If multiple matches found, continue otherwise return results
    if (matches.length < 2) {
      logger.silly(
        `Step 2: Found ${matches.length} fuzzy matches for '${transaction.title}' on ${
          transaction.date
        } between ${startDate} and ${endDate} in ${performance.now() - startTime}ms`,
        matches,
      )
      logger.silly('Matches', matches)
      return matches.map((t) => t.original)
    }

    // 3. If we have more than 1 match then we need to do some additional
    // filtering. First check to see if any of them have the exact same
    // title, if we still have multiple transactions then get the one(s)
    // with the closest date
    const titleMatches = matches.filter((t) => t.title === this._normaliseTitle(transaction.title))
    // Return the best matches after title screening
    logger.silly(
      `Step 3: Found ${
        titleMatches.length === 0 ? matches.length : titleMatches.length
      } fuzzy title matches for '${transaction.title}' in ${performance.now() - startTime}ms`,
    )
    return titleMatches.length === 0
      ? matches.map((t) => t.original)
      : titleMatches.map((t) => t.original)
  }

  /**
   * Normalises a title string to remove special characters, numbers and
   * unnecessary spaces so its easier to match transactions from the same
   * Payee
   *
   * @param title     The original title for the transaction
   * @returns         The normalised title for the transaction
   */
  private _normaliseTitle(title: string): string {
    if (typeof title !== 'string') {
      logger.warn('Title is not a string', title)
      return ''
    }

    let normalisedTitle = title
    // First, remove all special characters and numbers
    // except for spaces and make uppercase
    normalisedTitle = normalisedTitle.replace(/[^a-zA-Z ]/g, '').toUpperCase()
    // Then, replace multiple consecutive spaces with a single space
    // and any leading and trailing spaces
    normalisedTitle = normalisedTitle.replace(/\s+/g, ' ').trim()

    return normalisedTitle
  }

  /**
   * Search index for all transactions with the same or similar title
   *
   * @param title     The title to search for
   * @returns         List of Transactions that match, or empty array
   *                  if no matches
   */
  private _search(title: string): NormalisedTransaction[] | undefined {
    const startTime = performance.now()
    const searchTerm = this._normaliseTitle(title)
    // First find exact matches in index
    let results = this._index.get(searchTerm)?.map((idx) => this._normalisedTransactions[idx])
    if (results === undefined) {
      // Try fuzzy searching on title - much slower so only used as backup
      results = this._fuseIndex.search(searchTerm)?.map((result: any) => result.item)
    }
    const endTime = performance.now()
    logger.silly(
      `Found ${results?.length} Transactions for title '${title}' in ${endTime - startTime}ms`,
    )
    logger.silly('Found Transcations', results)
    return results
  }
}
