import type { ITransaction } from '@angelfish/core'
import { createNewTransaction } from '@angelfish/core'

/**
 * See bottom of file for helper functions
 */

/* Short list of different transaction types for testing */
export const transactions: ITransaction[] = [
  {
    id: 1,
    date: new Date('2021-08-02'),
    created_on: new Date('2021-11-22T18:04:00Z'),
    modified_on: new Date('2021-11-22T18:04:00Z'),
    account_id: 122,
    title: 'Target',
    amount: -105.22,
    currency_code: 'USD',
    requires_sync: false,
    pending: false,
    is_reviewed: false,
    line_items: [
      {
        id: 1,
        transaction_id: 1,
        account_id: 122,
        amount: -105.22,
        local_amount: -105.22,
        note: undefined,
        tags: [],
      },
      {
        id: 2,
        transaction_id: 1,
        account_id: 42,
        amount: 105.22,
        local_amount: 105.22,
        note: undefined,
        tags: [],
      },
    ],
  },
  {
    id: 2,
    date: new Date('2021-08-13'),
    created_on: new Date('2021-11-22T18:04:00Z'),
    modified_on: new Date('2021-11-22T18:04:00Z'),
    account_id: 122,
    title: 'American Airlines',
    amount: -22.34,
    currency_code: 'USD',
    requires_sync: false,
    pending: false,
    is_reviewed: false,
    line_items: [
      {
        id: 3,
        transaction_id: 2,
        account_id: 122,
        amount: -22.34,
        local_amount: -22.34,
        note: undefined,
        tags: [],
      },
      {
        id: 4,
        transaction_id: 2,
        account_id: 69,
        amount: 22.34,
        local_amount: 22.34,
        note: undefined,
        tags: [],
      },
    ],
  },
  {
    id: 3,
    date: new Date('2021-08-23'),
    created_on: new Date('2021-11-22T18:04:00Z'),
    modified_on: new Date('2021-11-22T18:04:00Z'),
    account_id: 122,
    title: 'Split Transaction',
    amount: -100,
    currency_code: 'USD',
    requires_sync: false,
    pending: false,
    is_reviewed: false,
    line_items: [
      {
        id: 5,
        transaction_id: 3,
        account_id: 122,
        amount: -100,
        local_amount: -100,
        note: undefined,
        tags: [],
      },
      {
        id: 6,
        transaction_id: 3,
        account_id: 24,
        amount: 50,
        local_amount: 50,
        note: undefined,
        tags: [],
      },
      {
        id: 7,
        transaction_id: 3,
        account_id: 54,
        amount: 50,
        local_amount: 50,
        note: undefined,
        tags: [],
      },
    ],
  },
  {
    id: 4,
    date: new Date('2021-08-16'),
    created_on: new Date('2021-11-22T18:04:00Z'),
    modified_on: new Date('2021-11-22T18:04:00Z'),
    account_id: 122,
    title: 'Transfer Transaction',
    amount: -10000,
    currency_code: 'USD',
    requires_sync: false,
    pending: false,
    is_reviewed: false,
    line_items: [
      {
        id: 8,
        transaction_id: 4,
        account_id: 122,
        amount: -10000,
        local_amount: -10000,
        note: undefined,
        tags: [],
      },
      {
        id: 9,
        transaction_id: 4,
        account_id: 123,
        amount: 10000,
        local_amount: 10000,
        note: 'Transfer to Savings Account',
        tags: [],
      },
    ],
  },
  {
    id: 5,
    date: new Date('2021-07-29'),
    created_on: new Date('2021-11-22T18:04:00Z'),
    modified_on: new Date('2021-11-22T18:04:00Z'),
    account_id: 122,
    title: 'Deposit Transaction',
    amount: 15000,
    currency_code: 'USD',
    requires_sync: false,
    pending: false,
    is_reviewed: false,
    line_items: [
      {
        id: 10,
        transaction_id: 5,
        account_id: 122,
        amount: 15000,
        local_amount: 15000,
        note: undefined,
        tags: [],
      },
      {
        id: 11,
        transaction_id: 5,
        account_id: 120,
        amount: -15000,
        local_amount: -15000,
        note: undefined,
        tags: [],
      },
    ],
  },
  {
    id: 6,
    date: new Date('2021-07-27'),
    created_on: new Date('2021-11-22T18:04:00Z'),
    modified_on: new Date('2021-11-22T18:04:00Z'),
    account_id: 122,
    title: 'Unclassified Transaction',
    amount: 1234.5,
    currency_code: 'USD',
    requires_sync: false,
    pending: false,
    is_reviewed: false,
    line_items: [
      {
        id: 10,
        transaction_id: 6,
        account_id: 122,
        amount: 1234.5,
        local_amount: 1234.5,
        note: undefined,
        tags: [],
      },
      {
        id: 11,
        transaction_id: 6,
        account_id: undefined,
        amount: -1234.5,
        local_amount: -1234.5,
        note: undefined,
        tags: [],
      },
    ],
  },
]

/* Long list of different transaction types for performance testing */
export function getLongTransactions(): ITransaction[] {
  const transactions: ITransaction[] = []
  let lineItemId = 1
  const today = new Date()
  for (let i = 0; i < 728; i++) {
    const currentDate = new Date(today)
    const details = longTransactionDetails[i]
    currentDate.setDate(currentDate.getDate() - i + 40)
    const transaction = createNewTransaction({
      account_id: 125,
      date: currentDate,
      title: details.title,
      currency_code: 'USD',
      amount: details.amount,
      category_id: details.category_id,
      requires_sync: false,
      pending: false,
      is_reviewed: false,
      import_id: details.import_id ? details.import_id : crypto.randomUUID(),
    })

    transaction.id = i + 1
    transaction.created_on = new Date()
    transaction.modified_on = new Date()
    transaction.line_items[0].id = lineItemId++
    transaction.line_items[0].transaction_id = transaction.id
    transaction.line_items[1].id = lineItemId++
    transaction.line_items[1].transaction_id = transaction.id

    transactions.push(transaction as ITransaction)
  }

  return transactions
}

/**
 * Helper array to deterministically generate a long list of transactions
 * with categories for performance testing and reconciliation testing.
 *
 * 728 transactions
 */
const longTransactionDetails = [
  {
    title: 'Dicks Sporting Goods',
    amount: -20.8,
    category_id: 57,
  },
  {
    title: 'Bonito Tacos & Tequila',
    amount: -50.07,
    category_id: 44,
  },
  {
    title: 'Amazing Day Spa',
    amount: -60,
    category_id: 87,
  },
  {
    title: 'Macdonalds',
    amount: -79.52,
    category_id: 44,
  },
  {
    title: 'Applebees',
    amount: -57,
    category_id: 44,
  },
  {
    title: 'Johns Grill',
    amount: -40,
    category_id: 44,
  },
  {
    title: 'Starbucks',
    amount: -2.35,
    category_id: 44,
  },
  {
    title: 'Applebees',
    amount: -47.15,
    category_id: 44,
  },
  {
    title: 'Bonito Tacos & Tequila',
    amount: -6.41,
    category_id: 44,
  },
  {
    title: 'Johns Pizza',
    amount: -52.66,
    category_id: 44,
  },
  {
    title: 'Netflix',
    amount: -17.99,
    category_id: 51,
  },
  {
    title: 'Shell',
    amount: -44.4,
    category_id: 25,
  },
  {
    title: 'Johns Ramen',
    amount: -98.89,
    category_id: 44,
  },
  {
    title: 'Acme Airlines',
    amount: -324.8,
    category_id: 69,
  },
  {
    title: 'Acme Airlines',
    amount: -324.8,
    category_id: 69,
  },
  {
    title: 'Costco',
    amount: -193.9,
    category_id: 42,
  },
  {
    title: 'Macdonalds',
    amount: -35.4,
    category_id: 44,
  },
  {
    title: 'Dicks Sporting Goods',
    amount: -20.8,
    category_id: 57,
  },
  {
    title: 'CVS',
    amount: -21.94,
    category_id: 58,
  },
  {
    title: 'Safeway',
    amount: -10.28,
    category_id: 42,
  },
  {
    title: 'Johns Island Grill',
    amount: -22.66,
    category_id: 44,
  },
  {
    title: 'Applebees',
    amount: -52.66,
    category_id: 44,
  },
  {
    title: 'Whole Foods',
    amount: -7.99,
    category_id: 42,
  },
  {
    title: 'Safeway',
    amount: -57.5,
    category_id: 42,
  },
  {
    title: 'Safeway',
    amount: -27.47,
    category_id: 42,
  },
  {
    title: 'Johns Island Grill',
    amount: -32.22,
    category_id: 44,
  },
  {
    title: 'Convnience Store',
    amount: -6.75,
    category_id: 42,
  },
  {
    title: 'Safeway',
    amount: -21.27,
    category_id: 42,
  },
  {
    title: 'U-PARK Parking',
    amount: -14.71,
    category_id: 72,
  },
  {
    title: 'Ross Dress for Less',
    amount: -144.67,
    category_id: 97,
  },
  {
    title: 'COFFEE CO.',
    amount: -10.36,
    category_id: 44,
  },
  {
    title: 'CITY PARKING',
    amount: -2,
    category_id: 72,
  },
  {
    title: 'MAIN ST',
    amount: -31.9,
    category_id: 101,
  },
  {
    title: 'GREEK GRILL',
    amount: -35.63,
    category_id: 44,
  },
  {
    title: 'Safeway',
    amount: -4.39,
    category_id: 42,
  },
  {
    title: 'Safeway',
    amount: -8.58,
    category_id: 42,
  },
  {
    title: 'Spotify',
    amount: -14.99,
    category_id: 51,
    import_id: '83DXMgpp3bTb6ZQwN9kKuXLAVOJ6gDHJEE7Xy',
  },
  {
    title: 'FIELD BAR',
    amount: -45.43,
    category_id: 44,
  },
  {
    title: 'Acme Airlines',
    amount: -34,
    category_id: 69,
  },
  {
    title: 'Acme Airlines',
    amount: -34,
    category_id: 69,
  },
  {
    title: 'Rent A Car',
    amount: -317.7,
    category_id: 69,
  },
  {
    title: 'Japanese Restaurant',
    amount: -16.4,
    category_id: 44,
  },
  {
    title: 'Ski Resort',
    amount: -413.08,
    category_id: 67,
  },
  {
    title: 'Shell',
    amount: -36.74,
    category_id: 25,
  },
  {
    title: 'Starbucks',
    amount: -16.43,
    category_id: 44,
  },
  {
    title: 'Whole Foods',
    amount: -25.81,
    category_id: 42,
  },
  {
    title: 'Shell',
    amount: -44.6,
    category_id: 25,
  },
  {
    title: 'Applebees',
    amount: -52.66,
    category_id: 44,
  },
  {
    title: 'Luckys Supermarket',
    amount: -35.46,
    category_id: 42,
  },
  {
    title: 'JOHNS OPTOMETRY',
    amount: -25,
    category_id: 64,
  },
  {
    title: 'JOHNS OPTOMETRY',
    amount: -40,
    category_id: 64,
  },
  {
    title: 'Applebees',
    amount: -17.37,
    category_id: 44,
  },
  {
    title: 'THE HOTEL',
    amount: -74.29,
    category_id: 65,
  },
  {
    title: 'AMAZING LOUNGE SPA',
    amount: -30,
    category_id: 87,
  },
  {
    title: 'AMAZING LOUNGE SPA',
    amount: -200,
    category_id: 87,
  },
  {
    title: 'Safeway',
    amount: -7.98,
    category_id: 42,
  },
  {
    title: 'REI',
    amount: -216.89,
    category_id: 57,
  },
  {
    title: 'Nick The Greek',
    amount: -194.84,
    category_id: 44,
  },
  {
    title: 'Arabic Restaurant',
    amount: -90.78,
    category_id: 44,
  },
  {
    title: 'Whole Foods',
    amount: -34.65,
    category_id: 42,
  },
  {
    title: 'WATER/WEB RECURRING',
    amount: -122.72,
    category_id: 18,
  },
  {
    title: 'CITY PARKING',
    amount: -1.25,
    category_id: 72,
  },
  {
    title: 'Chevron',
    amount: -47.02,
    category_id: 25,
  },
  {
    title: 'Macdonalds',
    amount: -52.66,
    category_id: 44,
  },
  {
    title: 'TST* RESTAURANT',
    amount: -138.44,
    category_id: 44,
  },
  {
    title: 'WINE SHOP',
    amount: -17.95,
    category_id: 42,
  },
  {
    title: 'CITY PARKING',
    amount: -1,
    category_id: 72,
  },
  {
    title: 'Costco',
    amount: -257.97,
    category_id: 42,
  },
  {
    title: 'NICK THE GREEK',
    amount: -31.19,
    category_id: 44,
  },
  {
    title: 'TOTAL WINE AND MORE',
    amount: -22.32,
    category_id: 42,
  },
  {
    title: 'TST* PERUVIAN RESTAURANT',
    amount: -49.77,
    category_id: 44,
  },
  {
    title: 'NIGHT LOUNGE',
    amount: -13.98,
    category_id: 48,
  },
  {
    title: 'NIGHT LOUNGE',
    amount: -13.98,
    category_id: 48,
  },
  {
    title: 'NIGHT LOUNGE',
    amount: -15.14,
    category_id: 48,
  },
  {
    title: 'NIGHT LOUNGE',
    amount: -16.31,
    category_id: 48,
  },
  {
    title: 'NIGHT LOUNGE',
    amount: -17.48,
    category_id: 48,
  },
  {
    title: 'Safeway',
    amount: -13.61,
    category_id: 42,
  },
  {
    title: 'Safeway',
    amount: -54.38,
    category_id: 42,
  },
  {
    title: 'ARABIC RESTAURANT',
    amount: -45.09,
    category_id: 44,
  },
  {
    title: 'Amazon',
    amount: -96.32,
  },
  {
    title: 'HONDA SERVICES',
    amount: -167.08,
    category_id: 26,
  },
  {
    title: 'Macdonalds',
    amount: -33.67,
    category_id: 44,
  },
  {
    title: 'PIZZERIA',
    amount: -32.86,
    category_id: 44,
  },
  {
    title: 'GAS STATION',
    amount: -49.68,
    category_id: 25,
  },
  {
    title: 'CREAMERY',
    amount: -17.25,
    category_id: 44,
  },
  {
    title: 'Acme Airlines',
    amount: -521.8,
    category_id: 69,
  },
  {
    title: 'Acme Airlines',
    amount: -521.8,
    category_id: 69,
  },
  {
    title: 'Amazon.com',
    amount: -63.06,
  },
  {
    title: 'Costco',
    amount: -165.61,
    category_id: 42,
  },
  {
    title: 'GRIND COFFEE',
    amount: -43.85,
    category_id: 44,
  },
  {
    title: 'TST* LOCAL RESTAURANT',
    amount: -118.95,
    category_id: 44,
  },
  {
    title: 'Netflix',
    amount: -17.99,
    category_id: 51,
  },
  {
    title: 'Safeway',
    amount: -54.96,
    category_id: 42,
  },
  {
    title: 'Bonito Taqueria',
    amount: -7.52,
    category_id: 44,
  },
  {
    title: 'Bonito Taqueria',
    amount: -13.01,
    category_id: 44,
  },
  {
    title: 'TST* THE RESTAURANT',
    amount: -215.04,
    category_id: 44,
  },
  {
    title: 'Chevron',
    amount: -46.19,
    category_id: 25,
  },
  {
    title: 'GOTHAM ENTERPRISES',
    amount: -35.47,
    category_id: 67,
  },
  {
    title: 'DECK BAR',
    amount: -523.93,
    category_id: 44,
  },
  {
    title: 'TAVERN #9',
    amount: -93.81,
    category_id: 44,
  },
  {
    title: 'NIGHT LOUNGE',
    amount: -50.33,
    category_id: 48,
  },
  {
    title: 'JOHNS CLUB',
    amount: -35.25,
    category_id: 48,
  },
  {
    title: 'Safeway',
    amount: -21.03,
    category_id: 42,
  },
  {
    title: 'Shell',
    amount: -1.89,
    category_id: 25,
  },
  {
    title: 'VIETNAMESE RESTAURANT',
    amount: -45.85,
    category_id: 44,
  },
  {
    title: 'SURF SHOP',
    amount: -16.39,
    category_id: 57,
  },
  {
    title: 'AUTOMATIC PAYMENT - THANK',
    amount: 2944.5,
    category_id: 122,
  },
  {
    title: 'Walgreens',
    amount: -42.66,
    category_id: 58,
  },
  {
    title: 'Macdonalds',
    amount: -52.66,
    category_id: 44,
  },
  {
    title: 'Safeway',
    amount: -22.92,
    category_id: 42,
  },
  {
    title: 'Spotify',
    amount: -14.99,
    category_id: 51,
  },
  {
    title: 'Amazon.com',
    amount: -19.38,
  },
  {
    title: 'CREPERIE',
    amount: -14.8,
    category_id: 44,
  },
  {
    title: 'THE CLUB',
    amount: -48,
    category_id: 48,
  },
  {
    title: 'Safeway',
    amount: -2.99,
    category_id: 42,
  },
  {
    title: 'DOWNTOWN BAR',
    amount: -171.67,
    category_id: 48,
  },
  {
    title: 'Rent A Car',
    amount: -12.5,
    category_id: 70,
  },
  {
    title: 'LYFT   *2 RIDES 05-23',
    amount: -46.87,
    category_id: 74,
  },
  {
    title: 'Macdonalds',
    amount: -52.66,
    category_id: 44,
  },
  {
    title: 'TST* GERMAN RESTAURANT',
    amount: -40.59,
    category_id: 44,
  },
  {
    title: 'Uber',
    amount: -14.22,
    category_id: 74,
  },
  {
    title: 'Safeway',
    amount: -10.48,
    category_id: 42,
  },
  {
    title: 'Safeway',
    amount: -57.03,
    category_id: 42,
  },
  {
    title: 'Costco',
    amount: -157.74,
    category_id: 42,
  },
  {
    title: 'JAPANESE SUPERMARKET',
    amount: -48.86,
    category_id: 44,
  },
  {
    title: 'UPS',
    amount: -81.71,
    category_id: 92,
  },
  {
    title: 'WATER/WEB RECURRING',
    amount: -122.94,
    category_id: 18,
  },
  {
    title: 'Amazon',
    amount: -252.6,
  },
  {
    title: 'Chevron',
    amount: -45.08,
    category_id: 25,
  },
  {
    title: 'SANDWICH SHOP',
    amount: -10.48,
    category_id: 44,
  },
  {
    title: 'Safeway',
    amount: -8.08,
    category_id: 42,
  },
  {
    title: 'Safeway',
    amount: -13.97,
    category_id: 42,
  },
  {
    title: 'Amazon.com',
    amount: -82.11,
  },
  {
    title: 'LUNCH RUSH',
    amount: -5.12,
    category_id: 44,
  },
  {
    title: 'Supermarket',
    amount: -9.84,
    category_id: 42,
  },
  {
    title: 'Round Table Pizza',
    amount: -47.36,
    category_id: 44,
  },
  {
    title: 'CITY PARKING METER',
    amount: -2,
    category_id: 72,
  },
  {
    title: 'ARABIC RESTAURANT',
    amount: -70.81,
    category_id: 44,
  },
  {
    title: 'SUPERMARKET',
    amount: -25.04,
    category_id: 42,
  },
  {
    title: 'FROYO',
    amount: -11.58,
    category_id: 44,
  },
  {
    title: 'Amazon',
    amount: -10.94,
  },
  {
    title: 'Amazon',
    amount: -20.79,
  },
  {
    title: 'Amazon',
    amount: -38.82,
  },
  {
    title: 'Home Depot',
    amount: -5.33,
    category_id: 16,
  },
  {
    title: 'Macdonalds',
    amount: -33.67,
    category_id: 44,
  },
  {
    title: 'FROYO',
    amount: -21.71,
    category_id: 44,
  },
  {
    title: 'DINNER RUSH',
    amount: -61.71,
    category_id: 44,
  },
  {
    title: 'Whole Foods',
    amount: -53.55,
    category_id: 42,
  },
  {
    title: 'Safeway',
    amount: -16.21,
    category_id: 42,
  },
  {
    title: 'Chevron',
    amount: -47.04,
    category_id: 25,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -14.99,
    category_id: 51,
  },
  {
    title: 'Macdonalds',
    amount: -50.55,
    category_id: 44,
  },
  {
    title: 'TST* BAKERY',
    amount: -48.5,
    category_id: 44,
  },
  {
    title: 'BURGERS',
    amount: -38.31,
    category_id: 44,
  },
  {
    title: 'SURF SHOP',
    amount: -16.39,
    category_id: 57,
  },
  {
    title: 'Rite Aid',
    amount: -21.89,
    category_id: 58,
  },
  {
    title: 'JUICE SHOP',
    amount: -13.16,
    category_id: 44,
  },
  {
    title: 'Amazon',
    amount: -4.61,
  },
  {
    title: 'SUPERMARKET',
    amount: -20.1,
    category_id: 42,
  },
  {
    title: 'Safeway',
    amount: -53.12,
    category_id: 42,
  },
  {
    title: 'TST* INDIAN REST...',
    amount: -121.21,
    category_id: 44,
  },
  {
    title: 'Walgreens',
    amount: -2.49,
    category_id: 58,
  },
  {
    title: 'Macdonalds',
    amount: -45.07,
    category_id: 44,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -15.99,
    category_id: 51,
  },
  {
    title: 'Chevron',
    amount: -49.36,
    category_id: 25,
  },
  {
    title: 'COUNTY FAIR',
    amount: -64.5,
    category_id: 44,
  },
  {
    title: 'ARABIC RESTAURANT',
    amount: -114.42,
    category_id: 44,
  },
  {
    title: 'Netflix',
    amount: -17.99,
    category_id: 51,
  },
  {
    title: 'Target',
    amount: -25.23,
    category_id: 42,
  },
  {
    title: 'USPS',
    amount: -40.19,
    category_id: 92,
  },
  {
    title: 'FLOWERS SHOP',
    amount: -65.49,
    category_id: 102,
  },
  {
    title: 'CKE* COFFEE SHOP',
    amount: -7,
    category_id: 44,
  },
  {
    title: 'Costco',
    amount: -731.96,
    category_id: 44,
  },
  {
    title: 'ICE CREAM',
    amount: -35,
    category_id: 44,
  },
  {
    title: 'Safeway',
    amount: -19.11,
    category_id: 42,
  },
  {
    title: 'THE GREEK',
    amount: -62.1,
    category_id: 44,
  },
  {
    title: 'AMUSEMENTS INC',
    amount: -70,
    category_id: 47,
  },
  {
    title: 'Costco',
    amount: 731.96,
    category_id: 42,
  },
  {
    title: 'FROYO',
    amount: -11.73,
    category_id: 44,
  },
  {
    title: 'TOTAL WINE AND MORE',
    amount: -27.34,
    category_id: 42,
  },
  {
    title: 'ARABIC RESTAURANT',
    amount: -30.1,
    category_id: 44,
  },
  {
    title: 'DOORDASH*BURGERS',
    amount: -36.7,
    category_id: 43,
  },
  {
    title: 'Safeway',
    amount: -9.53,
    category_id: 42,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -5.99,
    category_id: 51,
  },
  {
    title: 'FROYO',
    amount: -5.87,
    category_id: 44,
  },
  {
    title: 'BLVD GAS',
    amount: -32.64,
    category_id: 25,
  },
  {
    title: 'PARKING US',
    amount: -8,
    category_id: 72,
  },
  {
    title: 'AUTOMATIC PAYMENT - THANK',
    amount: 4493.81,
    category_id: 122,
  },
  {
    title: 'FROYO',
    amount: -5.1,
    category_id: 44,
  },
  {
    title: 'Bonita Fish Market',
    amount: -17.37,
    category_id: 42,
  },
  {
    title: 'Spotify',
    amount: -15.99,
    category_id: 51,
  },
  {
    title: 'TST* GERMAN RESTAURANT',
    amount: -27.14,
    category_id: 44,
  },
  {
    title: 'Macdonalds',
    amount: -36.79,
    category_id: 44,
  },
  {
    title: 'SUPERMARKET',
    amount: -5.99,
    category_id: 42,
  },
  {
    title: 'Safeway',
    amount: -11.37,
    category_id: 42,
  },
  {
    title: 'TOTAL WINE AND MORE',
    amount: -8.75,
    category_id: 42,
  },
  {
    title: 'Whole Foods',
    amount: -9.98,
    category_id: 42,
  },
  {
    title: 'ACME AIRLINE',
    amount: -701.38,
    category_id: 69,
  },
  {
    title: 'Macdonalds',
    amount: -38.96,
    category_id: 44,
  },
  {
    title: 'Safeway',
    amount: -14.17,
    category_id: 42,
  },
  {
    title: 'Uber',
    amount: -21.46,
    category_id: 74,
  },
  {
    title: 'Uber',
    amount: -53.16,
    category_id: 74,
  },
  {
    title: 'Uber',
    amount: -36.05,
    category_id: 74,
  },
  {
    title: 'WATER/WEB RECURRING',
    amount: -122.99,
    category_id: 18,
  },
  {
    title: 'TAQUERIA',
    amount: -19.75,
    category_id: 44,
  },
  {
    title: 'Macdonalds',
    amount: -38.65,
    category_id: 44,
  },
  {
    title: 'Whole Foods',
    amount: -24.03,
    category_id: 42,
  },
  {
    title: 'BREWING COMPAN',
    amount: -63.72,
    category_id: 44,
  },
  {
    title: 'Chevron',
    amount: -45.84,
    category_id: 25,
  },
  {
    title: 'TST* PIZZA',
    amount: -31.09,
    category_id: 44,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -14.99,
    category_id: 51,
  },
  {
    title: 'Uber',
    amount: -56.9,
    category_id: 74,
  },
  {
    title: 'Uber Eats',
    amount: -40.61,
    category_id: 43,
  },
  {
    title: 'GREEK RESTAURANT',
    amount: -28.64,
    category_id: 44,
  },
  {
    title: 'Target',
    amount: -170.54,
    category_id: 42,
  },
  {
    title: 'HONDA SERVICES',
    amount: -24.78,
    category_id: 26,
  },
  {
    title: 'CAFFE',
    amount: -12.82,
    category_id: 44,
  },
  {
    title: 'CITY PARKING',
    amount: -1,
    category_id: 72,
  },
  {
    title: 'ROAD TOLLS',
    amount: -25,
    category_id: 75,
  },
  {
    title: 'Subway',
    amount: -10.45,
    category_id: 44,
  },
  {
    title: 'Uber',
    amount: -59.99,
    category_id: 74,
  },
  {
    title: 'RESTAURANT',
    amount: -58.91,
    category_id: 44,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -15.99,
    category_id: 51,
  },
  {
    title: 'Computer Store',
    amount: -1095.15,
    category_id: 54,
  },
  {
    title: 'ARABIC RESTAURANT LLC',
    amount: -61.53,
    category_id: 44,
  },
  {
    title: 'Computer Store',
    amount: 1095.15,
    category_id: 54,
  },
  {
    title: 'Computer Store',
    amount: -1204.78,
    category_id: 54,
  },
  {
    title: 'CITY PARKING',
    amount: -1.25,
    category_id: 72,
  },
  {
    title: 'JUICE SHOP',
    amount: -11.15,
    category_id: 44,
  },
  {
    title: 'Netflix',
    amount: -17.99,
    category_id: 51,
  },
  {
    title: 'TST* GREEK FOOD',
    amount: -32.28,
    category_id: 44,
  },
  {
    title: 'Uber',
    amount: -26.97,
    category_id: 74,
  },
  {
    title: 'ASIAN FOOD',
    amount: -16.87,
    category_id: 44,
  },
  {
    title: 'AUTOMATIC PAYMENT - THANK',
    amount: 2691.07,
    category_id: 122,
  },
  {
    title: 'Spotify',
    amount: -15.99,
    category_id: 51,
  },
  {
    title: 'ACME AIRLINE',
    amount: -396.4,
    category_id: 69,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -4.99,
    category_id: 51,
  },
  {
    title: 'FOREIGN TRANSACTION FEE',
    amount: -5.41,
    category_id: 2,
  },
  {
    title: 'Hotel at Booking.com',
    amount: -180.49,
    category_id: 65,
  },
  {
    title: 'WATER/WEB RECURRING',
    amount: -89.08,
    category_id: 18,
  },
  {
    title: 'FOREIGN TRANSACTION FEE',
    amount: 5.4,
    category_id: 2,
  },
  {
    title: 'Hotel at Booking.com',
    amount: 180.17,
    category_id: 65,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -14.99,
    category_id: 51,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -15.99,
    category_id: 51,
  },
  {
    title: 'Netflix',
    amount: -17.99,
    category_id: 51,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -98.99,
    category_id: 51,
  },
  {
    title: 'Airport Parking',
    amount: -54.25,
    category_id: 69,
  },
  {
    title: 'McDonalds',
    amount: -2.22,
    category_id: 44,
  },
  {
    title: 'McDonalds',
    amount: -9.93,
    category_id: 44,
  },
  {
    title: 'Amtrak',
    amount: -84,
    category_id: 69,
  },
  {
    title: 'Starbucks',
    amount: -5.31,
    category_id: 44,
  },
  {
    title: 'ICE CREAM',
    amount: -12.94,
    category_id: 44,
  },
  {
    title: 'ACME AIRLINES',
    amount: -158.2,
    category_id: 69,
  },
  {
    title: 'ACME AIRLINES',
    amount: -158.2,
    category_id: 69,
  },
  {
    title: 'ACME AIRLINES',
    amount: -158.2,
    category_id: 69,
  },
  {
    title: 'ACME AIRLINES',
    amount: -158.2,
    category_id: 69,
  },
  {
    title: 'PIZZERIA',
    amount: -100.49,
    category_id: 44,
  },
  {
    title: 'FACTORY US',
    amount: -31.41,
    category_id: 97,
  },
  {
    title: 'BAR 104',
    amount: -35.76,
    category_id: 48,
  },
  {
    title: 'FASHION MARKET',
    amount: -2.19,
    category_id: 97,
  },
  {
    title: 'FASHION MARKET',
    amount: -8.24,
    category_id: 97,
  },
  {
    title: 'ROAD TOLLS',
    amount: -1.8,
    category_id: 75,
  },
  {
    title: 'ROAD TOLLS',
    amount: -9.4,
    category_id: 75,
  },
  {
    title: 'ROAD TOLLS',
    amount: -3.25,
    category_id: 75,
  },
  {
    title: 'AUTOMATIC PAYMENT - THANK',
    amount: 4030.26,
    category_id: 122,
  },
  {
    title: 'ExxonMobil',
    amount: -28.99,
    category_id: 25,
  },
  {
    title: 'ROAD TOLLS',
    amount: -9.4,
    category_id: 75,
  },
  {
    title: 'ROAD TOLLS',
    amount: -2.9,
    category_id: 75,
  },
  {
    title: 'FOOT WORKS',
    amount: -3,
    category_id: 97,
  },
  {
    title: 'CONCESSION COM',
    amount: -5.8,
    category_id: 44,
  },
  {
    title: 'Sbarro',
    amount: -7.58,
    category_id: 44,
  },
  {
    title: 'Walgreens',
    amount: -9.03,
    category_id: 58,
  },
  {
    title: '360 RESTAURANT',
    amount: -110,
    category_id: 44,
  },
  {
    title: '360 RESTAURANT',
    amount: -16,
    category_id: 44,
  },
  {
    title: 'CITY PARKING',
    amount: -55,
    category_id: 72,
  },
  {
    title: 'COFFEE SHOP',
    amount: -4.18,
    category_id: 44,
  },
  {
    title: 'Hotel',
    amount: -206.41,
    category_id: 65,
  },
  {
    title: 'ROAD TOLLS',
    amount: -3.25,
    category_id: 75,
  },
  {
    title: 'GALAXY MUSEUM',
    amount: -30,
    category_id: 53,
  },
  {
    title: 'GALAXY MUSEUM',
    amount: -158.05,
    category_id: 53,
  },
  {
    title: 'Spotify',
    amount: -15.99,
    category_id: 51,
  },
  {
    title: 'CAR MUSEUM',
    amount: -58.22,
    category_id: 53,
  },
  {
    title: 'CAR MUSEUM',
    amount: -106,
    category_id: 53,
  },
  {
    title: 'ART PARTY ADMISSIONS',
    amount: -20,
    category_id: 47,
  },
  {
    title: 'WIFI #5',
    amount: -12,
    category_id: 92,
  },
  {
    title: 'DINER',
    amount: -212.32,
    category_id: 44,
  },
  {
    title: 'ROAD TOLLS',
    amount: -4.5,
    category_id: 75,
  },
  {
    title: 'Rent a Car',
    amount: -3.27,
    category_id: 70,
  },
  {
    title: 'FOODS SUPERMARKET',
    amount: -6.54,
    category_id: 42,
  },
  {
    title: 'FOODS SUPERMARKET',
    amount: -6.94,
    category_id: 42,
  },
  {
    title: 'FOODS SUPERMARKET',
    amount: -10.44,
    category_id: 42,
  },
  {
    title: 'FOODS SUPERMARKET',
    amount: -10.81,
    category_id: 42,
  },
  {
    title: 'NEW RESTAURANT',
    amount: -10.98,
    category_id: 44,
  },
  {
    title: 'Steakhouse',
    amount: -43.99,
    category_id: 44,
  },
  {
    title: 'McDonalds',
    amount: -9.99,
    category_id: 44,
  },
  {
    title: 'GAS STATION',
    amount: -20.05,
    category_id: 25,
  },
  {
    title: 'SGAS STATION',
    amount: -26.28,
    category_id: 25,
  },
  {
    title: 'Target',
    amount: -51.47,
    category_id: 42,
  },
  {
    title: 'Amazon',
    amount: -65.67,
  },
  {
    title: 'Costco',
    amount: -196.86,
    category_id: 42,
  },
  {
    title: 'Costco',
    amount: -270.17,
    category_id: 42,
  },
  {
    title: 'WATER SPORTS',
    amount: -72.54,
    category_id: 52,
  },
  {
    title: 'Prime Video',
    amount: -2.99,
    category_id: 50,
  },
  {
    title: 'LUNCH SPOT',
    amount: -51.07,
    category_id: 44,
  },
  {
    title: 'Safeway',
    amount: -20.25,
    category_id: 42,
  },
  {
    title: 'THE CLUB',
    amount: -214.26,
    category_id: 48,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -4.99,
    category_id: 51,
  },
  {
    title: 'Electronics Store',
    amount: -643.5,
    category_id: 54,
  },
  {
    title: 'TOTAL WINE AND MORE',
    amount: -27.92,
    category_id: 42,
  },
  {
    title: 'ARABIC RESTAURANT LLC',
    amount: -158.66,
    category_id: 44,
  },
  {
    title: 'Ticketmaster',
    amount: -32.5,
    category_id: 47,
  },
  {
    title: 'ARCO AMERICAN',
    amount: -45.79,
    category_id: 25,
  },
  {
    title: 'Amazon Prime Video',
    amount: -59.99,
    category_id: 50,
  },
  {
    title: 'Century Theatres',
    amount: -13.75,
    category_id: 49,
  },
  {
    title: 'HONDA SERVICING',
    amount: -49.22,
    category_id: 26,
  },
  {
    title: 'Macdonalds',
    amount: -19.69,
    category_id: 44,
  },
  {
    title: 'JAPANESE RESTAURANT',
    amount: -67.64,
    category_id: 44,
  },
  {
    title: 'FROYO',
    amount: -6.12,
    category_id: 44,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -14.99,
    category_id: 51,
  },
  {
    title: 'FRENCH RESTAURANT',
    amount: -105.58,
    category_id: 44,
  },
  {
    title: 'Safeway',
    amount: -164.43,
    category_id: 42,
  },
  {
    title: 'WATER/WEB RECURRING',
    amount: -54.29,
    category_id: 18,
  },
  {
    title: 'ROAD TOLLS',
    amount: -32.65,
    category_id: 75,
  },
  {
    title: 'Safeway',
    amount: -2.99,
    category_id: 42,
  },
  {
    title: 'GALA 2021',
    amount: -532.07,
    category_id: 47,
  },
  {
    title: 'Macdonalds',
    amount: -50.03,
    category_id: 44,
  },
  {
    title: 'CITY GROCER',
    amount: -2.99,
    category_id: 42,
  },
  {
    title: 'TOTAL WINE AND MORE',
    amount: -37.23,
    category_id: 42,
  },
  {
    title: 'Amazon',
    amount: -65.76,
  },
  {
    title: 'CVS',
    amount: -32.1,
    category_id: 58,
  },
  {
    title: 'CITY PARKING',
    amount: -0.5,
    category_id: 72,
  },
  {
    title: 'THE LUNCH SHOP',
    amount: -23.28,
    category_id: 44,
  },
  {
    title: 'TST* STEAJ PIZZA',
    amount: -168.62,
    category_id: 44,
  },
  {
    title: 'ARCO AMERICAN',
    amount: -41.37,
    category_id: 25,
  },
  {
    title: 'COFFEE SHOP',
    amount: -8.91,
    category_id: 44,
  },
  {
    title: 'COFFEE SHOP',
    amount: -11.79,
    category_id: 44,
  },
  {
    title: 'L ENTERPRISES',
    amount: -43.18,
    category_id: 103,
  },
  {
    title: 'TST* FRANCAIS',
    amount: -102.55,
    category_id: 44,
  },
  {
    title: 'Target',
    amount: -12.95,
    category_id: 42,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -15.99,
    category_id: 51,
  },
  {
    title: 'Rite Aid',
    amount: -5.47,
    category_id: 58,
  },
  {
    title: 'Bonitos Tacos',
    amount: -19.26,
    category_id: 44,
  },
  {
    title: 'ARCO AMERICAN',
    amount: -42.08,
    category_id: 25,
  },
  {
    title: 'Amazon Prime',
    amount: -130.45,
    category_id: 104,
  },
  {
    title: 'Costco',
    amount: -208.74,
    category_id: 42,
  },
  {
    title: 'Netflix',
    amount: -17.99,
    category_id: 51,
  },
  {
    title: 'Home Depot',
    amount: -23.44,
    category_id: 16,
  },
  {
    title: 'Safeway',
    amount: -60.45,
    category_id: 42,
  },
  {
    title: 'Macdonalds',
    amount: -31.09,
    category_id: 44,
  },
  {
    title: 'Whole Foods',
    amount: -23.86,
    category_id: 42,
  },
  {
    title: 'ExxonMobil',
    amount: -44.76,
    category_id: 25,
  },
  {
    title: 'ROAD TOLLS',
    amount: -12.05,
    category_id: 75,
  },
  {
    title: 'AUTOMATIC PAYMENT - THANK',
    amount: 2896.94,
    category_id: 122,
  },
  {
    title: 'BOOKSHOP',
    amount: -30.39,
    category_id: 45,
  },
  {
    title: 'ROAD TOLLS',
    amount: -25,
    category_id: 75,
  },
  {
    title: 'Bonitos Taco',
    amount: -13.64,
    category_id: 44,
  },
  {
    title: 'Spotify',
    amount: -15.99,
    category_id: 51,
  },
  {
    title: 'GAS STATION',
    amount: -49.15,
    category_id: 25,
  },
  {
    title: 'FROYO',
    amount: -8.45,
    category_id: 44,
  },
  {
    title: 'CITY PARKING METER',
    amount: -4.65,
    category_id: 72,
  },
  {
    title: 'Starbucks',
    amount: -3.45,
    category_id: 44,
  },
  {
    title: 'DOORDASH*JAPANESE',
    amount: -112.69,
    category_id: 43,
  },
  {
    title: 'SURF SHOP',
    amount: -22.42,
    category_id: 57,
  },
  {
    title: 'TOTAL WINE AND MORE',
    amount: -31.75,
    category_id: 42,
  },
  {
    title: 'Costco',
    amount: -93.87,
    category_id: 42,
  },
  {
    title: 'TST* AMERICAN DINER',
    amount: -29.3,
    category_id: 44,
  },
  {
    title: 'TST* THE BAKERY',
    amount: -12.99,
    category_id: 44,
  },
  {
    title: 'CITY PARKING',
    amount: -1,
    category_id: 72,
  },
  {
    title: 'JUICE SHOP',
    amount: -13.65,
    category_id: 44,
  },
  {
    title: 'SJ RESTAURANT',
    amount: -80,
    category_id: 44,
  },
  {
    title: 'TST* ROOMBA TACOS',
    amount: -125.09,
    category_id: 44,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -4.99,
    category_id: 51,
  },
  {
    title: 'ARCO AMERICAN',
    amount: -41.39,
    category_id: 25,
  },
  {
    title: 'Macdonalds',
    amount: -36.82,
    category_id: 44,
  },
  {
    title: 'Safeway',
    amount: -32.08,
    category_id: 42,
  },
  {
    title: 'TST* AMERICAN DINER',
    amount: -91.72,
    category_id: 44,
  },
  {
    title: 'Uber',
    amount: -39.89,
    category_id: 74,
  },
  {
    title: 'Uber',
    amount: -39.91,
    category_id: 74,
  },
  {
    title: 'Safeway',
    amount: -54.41,
    category_id: 42,
  },
  {
    title: 'WATER/WEB RECURRING',
    amount: -96.92,
    category_id: 18,
  },
  {
    title: 'Safeway',
    amount: -13.14,
    category_id: 42,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -14.99,
    category_id: 51,
  },
  {
    title: 'TST* HAWAIAN FOOD',
    amount: -15.65,
    category_id: 44,
  },
  {
    title: 'Uber Eats',
    amount: -53.52,
    category_id: 43,
  },
  {
    title: 'THAI CUISIN',
    amount: -56.56,
    category_id: 44,
  },
  {
    title: 'JAPANESE FOOD',
    amount: -47.64,
    category_id: 44,
  },
  {
    title: 'SUPERMARKET',
    amount: -5.99,
    category_id: 42,
  },
  {
    title: 'ARCO AMERICAN',
    amount: -45.48,
    category_id: 25,
  },
  {
    title: 'FROYO',
    amount: -5.87,
    category_id: 44,
  },
  {
    title: 'CVS',
    amount: -10.94,
    category_id: 58,
  },
  {
    title: 'Amazon',
    amount: -87.56,
  },
  {
    title: 'PIZZA SHOP',
    amount: -15.59,
    category_id: 44,
  },
  {
    title: 'FOOD SUPERMARKET',
    amount: -34.82,
    category_id: 42,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -15.99,
    category_id: 51,
  },
  {
    title: 'GYROS AND KEBABS',
    amount: -25.15,
    category_id: 44,
  },
  {
    title: 'Century Theatres',
    amount: -27.5,
    category_id: 49,
  },
  {
    title: 'American Bistro',
    amount: -116.3,
    category_id: 44,
  },
  {
    title: 'ARCO AMERICAN',
    amount: -45.94,
    category_id: 25,
  },
  {
    title: 'Round Table Pizza',
    amount: -56.25,
    category_id: 44,
  },
  {
    title: 'TST* JOLLY FOOD',
    amount: -20.99,
    category_id: 44,
  },
  {
    title: 'AMAZING LOUNGE SPA',
    amount: -46,
    category_id: 87,
  },
  {
    title: 'Netflix',
    amount: -17.99,
    category_id: 51,
  },
  {
    title: 'Safeway',
    amount: -17.93,
    category_id: 42,
  },
  {
    title: 'TST* FRENCH FOOD',
    amount: -60.1,
    category_id: 44,
  },
  {
    title: 'Uber',
    amount: -21.91,
    category_id: 74,
  },
  {
    title: 'Uber',
    amount: -22.97,
    category_id: 74,
  },
  {
    title: 'Whole Foods',
    amount: -58.22,
    category_id: 42,
  },
  {
    title: 'GYROS AND KEBABS',
    amount: -37.06,
    category_id: 44,
  },
  {
    title: 'FAMILY DENTIST',
    amount: -103.2,
    category_id: 62,
  },
  {
    title: 'ARCO AMERICAN',
    amount: -47.65,
    category_id: 25,
  },
  {
    title: 'FROYO',
    amount: -19.83,
    category_id: 44,
  },
  {
    title: 'CITY METER PARKING',
    amount: -4.7,
    category_id: 72,
  },
  {
    title: 'AMAZING LOUNGE SPA',
    amount: -46,
    category_id: 87,
  },
  {
    title: 'Macdonalds',
    amount: -19.69,
    category_id: 44,
  },
  {
    title: 'TST* GERMAN BAR',
    amount: -10.09,
    category_id: 44,
  },
  {
    title: 'TST* GERMAN BAR',
    amount: -36.57,
    category_id: 44,
  },
  {
    title: 'AUTOMATIC PAYMENT - THANK',
    amount: 4821.97,
    category_id: 122,
  },
  {
    title: 'BURGER BAR',
    amount: -53.95,
    category_id: 44,
  },
  {
    title: 'THAI CUISIN',
    amount: -67.35,
    category_id: 44,
  },
  {
    title: 'SEE TICKETS',
    amount: -110.92,
    category_id: 47,
  },
  {
    title: 'Safeway',
    amount: -13.24,
    category_id: 42,
  },
  {
    title: 'Health Care',
    amount: -20,
    category_id: 60,
  },
  {
    title: 'Spotify',
    amount: -15.99,
    category_id: 51,
  },
  {
    title: 'Whole Foods',
    amount: -42.4,
    category_id: 42,
  },
  {
    title: 'SUSHI BISTRO',
    amount: -132.24,
    category_id: 44,
  },
  {
    title: 'ARCO AMERICAN',
    amount: -45.38,
    category_id: 25,
  },
  {
    title: 'Costco',
    amount: -223.2,
    category_id: 42,
  },
  {
    title: 'TOTAL WINE AND MORE',
    amount: -37.23,
    category_id: 42,
  },
  {
    title: 'TST* HAWAIAN BBQ',
    amount: -19.15,
    category_id: 44,
  },
  {
    title: 'Macdonalds',
    amount: -16.14,
    category_id: 44,
  },
  {
    title: 'Safeway',
    amount: -4.99,
    category_id: 42,
  },
  {
    title: 'GAS STATION',
    amount: -53.78,
    category_id: 25,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -4.99,
    category_id: 51,
  },
  {
    title: 'JAPAN SUPERMARKET',
    amount: -31.92,
    category_id: 42,
  },
  {
    title: 'PARTY & TOY STORE',
    amount: -10.92,
    category_id: 36,
  },
  {
    title: 'Macdonalds',
    amount: -38.64,
    category_id: 44,
  },
  {
    title: 'CITY PARKING',
    amount: -3.5,
    category_id: 72,
  },
  {
    title: 'Whole Foods',
    amount: -23.86,
    category_id: 42,
  },
  {
    title: 'Century Theatres',
    amount: -14,
    category_id: 49,
  },
  {
    title: 'FROYO',
    amount: -11.73,
    category_id: 44,
  },
  {
    title: 'PIZZA HUT',
    amount: -29.77,
    category_id: 44,
  },
  {
    title: 'Halloween Superstores',
    amount: -43.94,
    category_id: 38,
  },
  {
    title: 'FOOD SERVICES',
    amount: -102,
    category_id: 44,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -14.99,
    category_id: 51,
  },
  {
    title: 'CVS',
    amount: -78.9,
    category_id: 58,
  },
  {
    title: 'Chevron',
    amount: -51.57,
    category_id: 25,
  },
  {
    title: 'Macdonalds',
    amount: -19.69,
    category_id: 44,
  },
  {
    title: 'TST* AMERICAN BISTRO',
    amount: -84.09,
    category_id: 44,
  },
  {
    title: 'WATER/WEB RECURRING',
    amount: -142.52,
    category_id: 18,
  },
  {
    title: 'LUNCH PLACE',
    amount: -9.3,
    category_id: 44,
  },
  {
    title: 'Starbucks',
    amount: -31.9,
    category_id: 44,
  },
  {
    title: 'Whole Foods',
    amount: -39.38,
    category_id: 42,
  },
  {
    title: 'ROAD TOLLS',
    amount: -25,
    category_id: 75,
  },
  {
    title: 'Uber Eats',
    amount: -22.72,
    category_id: 43,
  },
  {
    title: 'ARCO AMERICAN',
    amount: -46.84,
    category_id: 25,
  },
  {
    title: 'Costco',
    amount: -506.16,
    category_id: 42,
  },
  {
    title: 'Party Store',
    amount: -30,
    category_id: 36,
  },
  {
    title: 'Party Store',
    amount: -81.98,
    category_id: 36,
  },
  {
    title: 'Safeway',
    amount: -5.47,
    category_id: 42,
  },
  {
    title: 'Uber Eats',
    amount: -25.23,
    category_id: 43,
  },
  {
    title: 'Safeway',
    amount: -7.21,
    category_id: 42,
  },
  {
    title: 'GYROS AND KEBABS',
    amount: -57.29,
    category_id: 44,
  },
  {
    title: 'HEALTHCARE PROVIDER',
    amount: -100,
    category_id: 60,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -9.99,
    category_id: 51,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -15.99,
    category_id: 51,
  },
  {
    title: 'Safeway',
    amount: -17.33,
    category_id: 42,
  },
  {
    title: 'Safeway',
    amount: -30.88,
    category_id: 42,
  },
  {
    title: 'Starbucks',
    amount: -6.9,
    category_id: 44,
  },
  {
    title: 'AMAZING LOUNGE SPA',
    amount: -92,
    category_id: 87,
  },
  {
    title: 'Netflix',
    amount: -17.99,
    category_id: 51,
  },
  {
    title: 'ACME LLC',
    amount: -286.61,
    category_id: 44,
  },
  {
    title: 'ARCO AMERICAN',
    amount: -49.58,
    category_id: 25,
  },
  {
    title: 'Amazon',
    amount: -50,
  },
  {
    title: 'CITY PARKING',
    amount: -2,
    category_id: 72,
  },
  {
    title: 'Safeway',
    amount: -116.71,
    category_id: 42,
  },
  {
    title: 'Starbucks',
    amount: -3.65,
    category_id: 44,
  },
  {
    title: 'TST* FAMILY BBQ',
    amount: -24.04,
    category_id: 44,
  },
  {
    title: 'Walgreens',
    amount: -33.96,
    category_id: 58,
  },
  {
    title: 'NICE RESTAURANT',
    amount: -15.3,
    category_id: 44,
  },
  {
    title: 'ASIAN FOOD',
    amount: -68.1,
    category_id: 44,
  },
  {
    title: 'TST* American Bistro',
    amount: -101.44,
    category_id: 44,
  },
  {
    title: 'FROYO',
    amount: -7.57,
    category_id: 44,
  },
  {
    title: 'Chevron',
    amount: -2.19,
    category_id: 44,
  },
  {
    title: 'Chevron',
    amount: -51.75,
    category_id: 25,
  },
  {
    title: 'TRAVEL INSURANCE',
    amount: -108.4,
    category_id: 21,
  },
  {
    title: 'AUTOMATIC PAYMENT - THANK',
    amount: 2724.7,
    category_id: 122,
  },
  {
    title: 'PARKS & RECREATION',
    amount: -5,
    category_id: 72,
  },
  {
    title: 'CITY PARKS & RECREATION',
    amount: -5,
    category_id: 72,
  },
  {
    title: 'Starbucks',
    amount: -3.65,
    category_id: 44,
  },
  {
    title: 'TRANSACTION FEE',
    amount: -10,
    category_id: 2,
  },
  {
    title: 'TICKETS ONLINE',
    amount: -29.28,
    category_id: 47,
  },
  {
    title: 'ONLINE ECOMMERCE',
    amount: -116.08,
    category_id: 103,
  },
  {
    title: 'ARABIC RESTAURANT',
    amount: -43.32,
    category_id: 44,
  },
  {
    title: 'Spotify',
    amount: -15.99,
    category_id: 51,
  },
  {
    title: 'Whole Foods',
    amount: -28.06,
    category_id: 42,
  },
  {
    title: 'CASH ADVANCE INTEREST CHA',
    amount: -0.43,
    category_id: 1,
  },
  {
    title: 'GELATO CLASSICO',
    amount: -12.93,
    category_id: 44,
  },
  {
    title: 'IKEA.COM',
    amount: -16.94,
    category_id: 7,
  },
  {
    title: 'Macdonalds',
    amount: -45.17,
    category_id: 44,
  },
  {
    title: 'Starbucks',
    amount: -3.65,
    category_id: 42,
  },
  {
    title: 'ARABIC FOOD',
    amount: -70,
    category_id: 44,
  },
  {
    title: 'CREPERIE',
    amount: -17.13,
    category_id: 44,
  },
  {
    title: 'LYFT   *2 RIDES 11-22',
    amount: -60.24,
    category_id: 74,
  },
  {
    title: 'Starbucks',
    amount: -8.4,
    category_id: 44,
  },
  {
    title: 'Uber',
    amount: -46.93,
    category_id: 74,
  },
  {
    title: 'Costco',
    amount: -112.14,
    category_id: 42,
  },
  {
    title: 'Safeway',
    amount: -53.47,
    category_id: 42,
  },
  {
    title: 'Whole Foods',
    amount: -14.58,
    category_id: 42,
  },
  {
    title: 'ARCO AMERICAN',
    amount: -41.55,
    category_id: 25,
  },
  {
    title: 'Amazon',
    amount: -18.7,
  },
  {
    title: 'COFFEE SHOP',
    amount: -23.73,
    category_id: 44,
  },
  {
    title: 'Macdonalds',
    amount: -41.31,
    category_id: 44,
  },
  {
    title: 'Safeway',
    amount: -6.98,
    category_id: 42,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -4.99,
    category_id: 51,
  },
  {
    title: 'Costco',
    amount: -68.51,
    category_id: 42,
  },
  {
    title: 'Costco',
    amount: -174.99,
    category_id: 42,
  },
  {
    title: 'SURF SHOP',
    amount: -16.41,
    category_id: 57,
  },
  {
    title: 'SCHOOL FOOD SERVICES',
    amount: -78,
    category_id: 34,
  },
  {
    title: 'TST* BREWING -',
    amount: -64.81,
    category_id: 44,
  },
  {
    title: 'Safeway',
    amount: -21.62,
    category_id: 42,
  },
  {
    title: 'Prime Video',
    amount: -0.99,
    category_id: 50,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -14.99,
    category_id: 51,
  },
  {
    title: 'WATER/WEB RECURRING',
    amount: -155.06,
    category_id: 18,
  },
  {
    title: 'NICK THE GREEK',
    amount: -18.89,
    category_id: 44,
  },
  {
    title: 'TST* American Restaurant',
    amount: -539.4,
    category_id: 44,
  },
  {
    title: 'CITY PARKING',
    amount: -1.5,
    category_id: 72,
  },
  {
    title: 'Amazon.com',
    amount: -159.67,
  },
  {
    title: 'CAFE ROUGE',
    amount: -66.33,
    category_id: 44,
  },
  {
    title: "DSP* CHILDREN'S MUSEUM",
    amount: -114.66,
    category_id: 53,
  },
  {
    title: 'MARKET BAKERY',
    amount: -46.4,
    category_id: 44,
  },
  {
    title: 'Starbucks',
    amount: -3.65,
    category_id: 44,
  },
  {
    title: 'ARCO AMERICAN',
    amount: -47.41,
    category_id: 25,
  },
  {
    title: 'Safeway',
    amount: -1.67,
    category_id: 42,
  },
  {
    title: 'PARK METER PARKING',
    amount: -2,
    category_id: 72,
  },
  {
    title: 'PARK METER PARKING',
    amount: -2.75,
    category_id: 72,
  },
  {
    title: 'Whole Foods',
    amount: -43.13,
    category_id: 42,
  },
  {
    title: 'ARABIC FOOD',
    amount: -45.93,
    category_id: 44,
  },
  {
    title: 'Barnes & Noble',
    amount: -15.36,
    category_id: 45,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -15.99,
    category_id: 51,
  },
  {
    title: 'Starbucks',
    amount: -3.65,
    category_id: 44,
  },
  {
    title: 'Uber Eats',
    amount: -28.72,
    category_id: 43,
  },
  {
    title: 'Starbucks',
    amount: -7.9,
    category_id: 44,
  },
  {
    title: 'ARCO AMERICAN',
    amount: -48.13,
    category_id: 25,
  },
  {
    title: 'Uber Eats',
    amount: -3.7,
    category_id: 43,
  },
  {
    title: 'Amazon',
    amount: -15.34,
  },
  {
    title: 'CITY PARKING',
    amount: -2,
    category_id: 72,
  },
  {
    title: 'JAPANESE MARKET',
    amount: -53.01,
    category_id: 42,
  },
  {
    title: 'Netflix',
    amount: -17.99,
    category_id: 51,
  },
  {
    title: 'Safeway',
    amount: -27.52,
    category_id: 42,
  },
  {
    title: 'Safeway',
    amount: -83.14,
    category_id: 42,
  },
  {
    title: 'Starbucks',
    amount: -3.65,
    category_id: 44,
  },
  {
    title: 'Uber Eats',
    amount: -21.67,
    category_id: 43,
  },
  {
    title: 'GYROS AND KEBABS',
    amount: -37.19,
    category_id: 44,
  },
  {
    title: 'FIVE ELEPHANTS',
    amount: -18.63,
    category_id: 44,
  },
  {
    title: 'LYFT   *2 RIDES 12-13',
    amount: -68.78,
    category_id: 74,
  },
  {
    title: 'Starbucks',
    amount: -7.7,
    category_id: 44,
  },
  {
    title: 'Uber',
    amount: -57.9,
    category_id: 74,
  },
  {
    title: 'Barnes & Noble',
    amount: -8.24,
    category_id: 45,
  },
  {
    title: 'FOOD SUPERMARKET',
    amount: -39.94,
    category_id: 42,
  },
  {
    title: 'Uber Eats',
    amount: -42.5,
    category_id: 43,
  },
  {
    title: 'AMAZING LOUNGE SPA',
    amount: -40,
    category_id: 87,
  },
  {
    title: "DJ'S CAFE",
    amount: -3.65,
    category_id: 44,
  },
  {
    title: 'Uber Eats',
    amount: -53.07,
    category_id: 43,
  },
  {
    title: 'PETROL GAS',
    amount: -55.2,
    category_id: 25,
  },
  {
    title: 'AUTOMATIC PAYMENT - THANK',
    amount: 3218.3,
    category_id: 122,
  },
  {
    title: 'Amazon',
    amount: -87.56,
  },
  {
    title: 'Whole Foods',
    amount: -35.98,
    category_id: 42,
  },
  {
    title: 'Costco',
    amount: -225.16,
    category_id: 42,
  },
  {
    title: 'JAPANESE FOOD',
    amount: -95.48,
    category_id: 44,
  },
  {
    title: 'FOOD',
    amount: -55.23,
    category_id: 44,
  },
  {
    title: 'JUICE STORE',
    amount: -32.32,
    category_id: 44,
  },
  {
    title: 'Macdonalds',
    amount: -49.29,
    category_id: 44,
  },
  {
    title: 'Safeway',
    amount: -6.92,
    category_id: 42,
  },
  {
    title: 'Spotify',
    amount: -15.99,
    category_id: 51,
  },
  {
    title: 'Starbucks',
    amount: -3.65,
    category_id: 44,
  },
  {
    title: 'CITY PARKING',
    amount: -1.75,
    category_id: 72,
  },
  {
    title: 'PERSIAN RESTAURANT',
    amount: -69.43,
    category_id: 44,
  },
  {
    title: 'Computer Store',
    amount: -396.99,
    category_id: 54,
  },
  {
    title: 'ARABIC RESTAURANT',
    amount: -2.2,
    category_id: 44,
  },
  {
    title: 'ARABIC RESTAURANT',
    amount: -69.09,
    category_id: 44,
  },
  {
    title: 'CITY PARKING',
    amount: -8,
    category_id: 72,
  },
  {
    title: 'CASH ADVANCE INTEREST CHA',
    amount: -2.19,
    category_id: 1,
  },
  {
    title: 'CAR WASH',
    amount: -18,
    category_id: 32,
  },
  {
    title: 'ROSS STORES',
    amount: -37.26,
    category_id: 97,
  },
  {
    title: 'SUPER CAFE',
    amount: -4.99,
    category_id: 44,
  },
  {
    title: 'Uber',
    amount: -96.94,
    category_id: 74,
  },
  {
    title: 'ACME AIRLINES',
    amount: -30,
    category_id: 69,
  },
  {
    title: 'SURF SHOP',
    amount: -125.64,
    category_id: 57,
  },
  {
    title: 'TST* Bar & Gril',
    amount: -209.2,
    category_id: 44,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -4.99,
    category_id: 51,
  },
  {
    title: 'BEACH HOUSE',
    amount: -70.39,
    category_id: 44,
  },
  {
    title: 'CONVENIENCE STORE',
    amount: -26.16,
    category_id: 42,
  },
  {
    title: 'SUPERMARKET',
    amount: -111.08,
    category_id: 42,
  },
  {
    title: 'SURF SHOP',
    amount: -73.3,
    category_id: 57,
  },
  {
    title: 'FOOD SUPERMARKET',
    amount: -51,
    category_id: 42,
  },
  {
    title: 'CONVENIENCE STORE',
    amount: -18.15,
    category_id: 42,
  },
  {
    title: 'GH* Activities',
    amount: -179.35,
    category_id: 67,
  },
  {
    title: 'FROYO',
    amount: -8.9,
    category_id: 44,
  },
  {
    title: 'Prime Video',
    amount: -0.99,
    category_id: 50,
  },
  {
    title: 'TST* Coffee',
    amount: -112,
    category_id: 44,
  },
  {
    title: 'CAFE',
    amount: -31.87,
    category_id: 44,
  },
  {
    title: 'TST* ITALIAN',
    amount: -79.77,
    category_id: 44,
  },
  {
    title: 'CAFE',
    amount: -15.49,
    category_id: 44,
  },
  {
    title: 'CONVENIENCE STORE',
    amount: -2.35,
    category_id: 42,
  },
  {
    title: 'FF###-WALGREENS',
    amount: -16.5,
    category_id: 58,
  },
  {
    title: 'FFF###-WALGREENS',
    amount: -50.25,
    category_id: 58,
  },
  {
    title: 'JAPANESE RESTAUR',
    amount: -230.62,
    category_id: 44,
  },
  {
    title: 'TST* LOCAL RESTAURANT',
    amount: -62.15,
    category_id: 44,
  },
  {
    title: 'SURF CO',
    amount: -20.94,
    category_id: 57,
  },
  {
    title: 'Convenience Store',
    amount: -3.71,
    category_id: 42,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -14.99,
    category_id: 51,
  },
  {
    title: 'WATER/WEB RECURRING',
    amount: -155.06,
    category_id: 18,
  },
  {
    title: 'BBQ PLACE',
    amount: -31.41,
    category_id: 44,
  },
  {
    title: 'MARKET',
    amount: -15.07,
    category_id: 42,
  },
  {
    title: 'GH* Activities',
    amount: -51.31,
    category_id: 67,
  },
  {
    title: 'CAFFE',
    amount: -12.66,
    category_id: 44,
  },
  {
    title: 'Convenience Store',
    amount: -31.96,
    category_id: 42,
  },
  {
    title: 'Convenience Store',
    amount: -13.58,
    category_id: 42,
  },
  {
    title: 'CAFFE',
    amount: -10.73,
    category_id: 44,
  },
  {
    title: 'SURF CO',
    amount: -20.94,
    category_id: 57,
  },
  {
    title: 'CONVENIENCE STORE',
    amount: -12.56,
    category_id: 42,
  },
  {
    title: 'ANTIQUES & A',
    amount: -204.47,
    category_id: 7,
  },
  {
    title: 'Acme Car Rental',
    amount: -1656.81,
    category_id: 70,
  },
  {
    title: 'Chevron',
    amount: -41.78,
    category_id: 25,
  },
  {
    title: 'ACME AIRLINES',
    amount: -90,
    category_id: 69,
  },
  {
    title: 'CAFFE',
    amount: -12.23,
    category_id: 44,
  },
  {
    title: 'EAST HOTEL',
    amount: -2828.9,
    category_id: 65,
  },
  {
    title: 'EAST HOTEL',
    amount: -2911.43,
    category_id: 65,
  },
  {
    title: 'Shell',
    amount: -10.26,
    category_id: 25,
  },
  {
    title: 'Shell',
    amount: -64.72,
    category_id: 25,
  },
  {
    title: 'TST* Food Hall',
    amount: -23.94,
    category_id: 44,
  },
  {
    title: 'Safeway',
    amount: -198.31,
    category_id: 42,
  },
  {
    title: 'Starbucks',
    amount: -3.65,
    category_id: 44,
  },
  {
    title: 'JAPANESE MARKET',
    amount: -54.86,
    category_id: 42,
  },
  {
    title: 'Whole Foods',
    amount: -105.9,
    category_id: 42,
  },
  {
    title: 'ARCO AMERICAN',
    amount: -45.15,
    category_id: 25,
  },
  {
    title: 'FFFKE*GTEDFFG, INC.',
    amount: -29.58,
    category_id: 44,
  },
  {
    title: 'TST* Bakery &',
    amount: -1.7,
    category_id: 44,
  },
  {
    title: 'TST* Bakery &',
    amount: -72.95,
    category_id: 44,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -15.99,
    category_id: 51,
  },
  {
    title: 'Uber Eats',
    amount: -3.9,
    category_id: 43,
  },
  {
    title: 'AMAZING LOUNGE SPA',
    amount: -40,
    category_id: 87,
  },
  {
    title: 'Chevron',
    amount: -36.67,
    category_id: 25,
  },
  {
    title: 'Netflix',
    amount: -17.99,
    category_id: 51,
  },
  {
    title: 'SCHOOL FOOD SERVICES',
    amount: -82.8,
    category_id: 34,
  },
  {
    title: 'Uber Eats',
    amount: -23.03,
    category_id: 43,
  },
  {
    title: 'Starbucks',
    amount: -3.65,
    category_id: 44,
  },
  {
    title: 'ROAD TOLLS',
    amount: -25,
    category_id: 75,
  },
  {
    title: 'Amazon',
    amount: -1.99,
  },
  {
    title: 'Safeway',
    amount: -22.42,
    category_id: 42,
  },
  {
    title: 'Uber',
    amount: -38.66,
    category_id: 74,
  },
  {
    title: 'Uber',
    amount: -39.92,
    category_id: 74,
  },
  {
    title: 'KOREAN RESTAURAN',
    amount: -141,
    category_id: 44,
  },
  {
    title: 'Costco',
    amount: -235.12,
    category_id: 42,
  },
  {
    title: 'AUTOMATIC PAYMENT - THANK',
    amount: 4164.72,
    category_id: 122,
  },
  {
    title: 'Spotify',
    amount: -15.99,
    category_id: 51,
  },
  {
    title: 'Uber Eats',
    amount: -57.05,
    category_id: 43,
  },
  {
    title: 'Costco',
    amount: -1.65,
    category_id: 42,
  },
  {
    title: 'Costco',
    amount: -349.76,
    category_id: 42,
  },
  {
    title: 'Costco Gas',
    amount: -33.23,
    category_id: 25,
  },
  {
    title: 'Uber Eats',
    amount: -55.79,
    category_id: 43,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -4.99,
    category_id: 51,
  },
  {
    title: 'Uber Eats',
    amount: -31.04,
    category_id: 43,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -14.99,
    category_id: 51,
  },
  {
    title: 'WATER/WEB RECURRING',
    amount: -144.59,
    category_id: 18,
  },
  {
    title: 'Costco',
    amount: -23.97,
    category_id: 42,
  },
  {
    title: 'Costco',
    amount: -248.32,
    category_id: 42,
  },
  {
    title: 'Amazon',
    amount: -17.53,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -15.99,
    category_id: 51,
  },
  {
    title: 'Uber Eats',
    amount: -56.28,
    category_id: 43,
  },
  {
    title: 'Netflix',
    amount: -17.99,
    category_id: 51,
  },
  {
    title: 'Prime Video',
    amount: -3.99,
    category_id: 50,
  },
  {
    title: 'Uber',
    amount: -16.66,
    category_id: 74,
  },
  {
    title: 'ONLINE TICKETS',
    amount: 55.46,
    category_id: 47,
  },
  {
    title: 'ONLINE TICKETS',
    amount: 55.46,
    category_id: 47,
  },
  {
    title: 'AUTOMATIC PAYMENT - THANK',
    amount: 11091.16,
    category_id: 122,
  },
  {
    title: 'Spotify',
    amount: -15.99,
    category_id: 51,
  },
  {
    title: 'Uber Eats',
    amount: -33.52,
    category_id: 43,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -4.99,
    category_id: 51,
  },
  {
    title: 'FOREIGN TRANSACTION FEE',
    amount: -5.04,
    category_id: 2,
  },
  {
    title: 'www.amazing.com',
    amount: -168.28,
    category_id: 37,
  },
  {
    title: 'Costco',
    amount: -169.22,
    category_id: 42,
  },
  {
    title: 'Safeway',
    amount: -29.44,
    category_id: 42,
  },
  {
    title: 'WATER/WEB RECURRING',
    amount: -161.89,
    category_id: 18,
  },
  {
    title: 'SKATING',
    amount: -50,
    category_id: 36,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -14.99,
    category_id: 51,
  },
  {
    title: 'Chevron',
    amount: -62.51,
    category_id: 25,
  },
  {
    title: 'JUICE SHOP',
    amount: -33.46,
    category_id: 44,
  },
  {
    title: 'Safeway',
    amount: -16.47,
    category_id: 42,
  },
  {
    title: 'APPLE.COM/BILL',
    amount: -15.99,
    category_id: 51,
  },
  {
    title: 'Macdonalds',
    amount: -44.74,
    category_id: 44,
  },
  {
    title: 'Whole Foods',
    amount: -22.21,
    category_id: 42,
  },
  {
    title: 'TSA*TAVERNA',
    amount: -151.26,
    category_id: 44,
  },
  {
    title: 'Safeway',
    amount: -21.91,
    category_id: 42,
  },
  {
    title: 'Safeway',
    amount: -28.05,
    category_id: 42,
  },
  {
    title: 'Amazon',
    amount: -96.51,
  },
  {
    title: 'TOYOTA SERVICES',
    amount: -682.82,
    category_id: 26,
  },
  {
    title: 'Macdonalds',
    amount: -56.83,
    category_id: 44,
  },
  {
    title: 'TST* City Kitchen',
    amount: -980.28,
    category_id: 44,
  },
  {
    title: 'USPS',
    amount: -76.95,
    category_id: 92,
  },
  {
    title: 'OUT CAFFFE',
    amount: -69.69,
    category_id: 44,
  },
  {
    title: 'BREWING COMPAN',
    amount: -108.58,
    category_id: 44,
  },
  {
    title: 'Netflix',
    amount: -17.99,
    category_id: 51,
  },
  {
    title: 'ARCO AMERICAN',
    amount: -50.59,
    category_id: 25,
  },
  {
    title: 'CITY PARKING',
    amount: -1.25,
    category_id: 72,
  },
  {
    title: 'Costco',
    amount: -468.25,
    category_id: 42,
  },
  {
    title: 'JUICE SHOP',
    amount: -3.92,
    category_id: 44,
  },
  {
    title: 'JUICE SHOP',
    amount: -33.69,
    category_id: 44,
  },
  {
    title: 'ARABIC CUSINE.',
    amount: -163.53,
    category_id: 44,
  },
  {
    title: 'INTERNATIONAL MARKE',
    amount: -50.94,
    category_id: 42,
  },
  {
    title: 'Safeway',
    amount: -21.66,
    category_id: 42,
  },
  {
    title: 'Safeway',
    amount: -3.5,
    category_id: 42,
  },
  {
    title: 'Acme Airlines',
    amount: -866.21,
    category_id: 69,
  },
  {
    title: 'Best Buy',
    amount: -945.51,
    category_id: 54,
  },
  {
    title: 'Uber',
    amount: -62.16,
    category_id: 74,
  },
  {
    title: 'AUTOMATIC PAYMENT - THANK',
    amount: 1086.28,
    category_id: 122,
  },
  {
    title: 'Amazon',
    amount: -109.45,
  },
  {
    title: 'ExxonMobil',
    amount: -64.89,
    category_id: 25,
  },
  {
    title: 'Spotify',
    amount: -15.99,
    category_id: 51,
  },
  {
    title: 'TST* American Place',
    amount: -129.25,
    category_id: 44,
  },
  {
    title: 'Costco',
    amount: -156.24,
    category_id: 42,
  },
  {
    title: 'SURF SHOP',
    amount: -44.84,
    category_id: 57,
  },
  {
    title: 'Safeway',
    amount: -21.81,
    category_id: 42,
  },
  {
    title: '83332674343433',
    amount: -36,
    category_id: 103,
  },
  {
    title: 'SUPERMARKET',
    amount: -2.49,
    category_id: 42,
  },
  {
    title: 'KOREAN BBQ',
    amount: -98.61,
    category_id: 44,
  },
  {
    title: 'PIZZA AN',
    amount: -39.56,
    category_id: 44,
  },
  {
    title: 'ARCO AMERICAN',
    amount: -57.57,
    category_id: 25,
  },
]
