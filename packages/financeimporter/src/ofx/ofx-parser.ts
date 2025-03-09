import { decodeXML } from 'entities'
import xml2js from 'xml2js'

import type { Account } from '../types/account'
import type { ParsedData, Parser } from '../types/parser'
import type { Transaction } from '../types/transaction'
import type { OfxBankMessage, OfxBody, OfxCreditCardMessage } from './ofx-parser-types'
import { parseOFXDate } from './ofx-parser-utils'

/**
 * Parser for OFX Files
 */
export class OfxParser implements Parser {
  /**
   * Use this function to parse the OFX File String Data
   *
   * @param fileData The file data as string to parse
   * @returns        A promise that resolves to a ParsedData object
   */
  public async parse(fileData: string): Promise<ParsedData> {
    // Parse the XML string to object
    const data = (await this.convertFromXML(fileData)).OFX
    // Iterate through entries in OFX File
    const dataentries = Object.entries(data)
    const result = dataentries.reduce(
      (accumulator, [key, value]) => {
        switch (key) {
          case 'SIGNONMSGSRSV1': {
            // Do nothing for signon messages
            return accumulator
          }
          case 'BANKMSGSRSV1': {
            // Parse BankMessage account/transaction data
            const bdata = this.parseBANKMSGS(value as OfxBankMessage)
            return {
              accounts: [...accumulator.accounts, ...bdata.accounts],
              transactions: [...accumulator.transactions, ...bdata.transactions],
            }
          }
          case 'CREDITCARDMSGSRSV1': {
            // Parse CreditCardMessage account/transaction data
            const ccdata = this.parseCREDITCARDMSG(value as OfxCreditCardMessage)
            return {
              accounts: [...accumulator.accounts, ...ccdata.accounts],
              transactions: [...accumulator.transactions, ...ccdata.transactions],
            }
          }
          default: {
            throw new Error(`Unrecognised OFX Type: '${key}': ${JSON.stringify(value)}`)
          }
        }
      },
      { accounts: [], transactions: [] } as ParsedData,
    )

    return result
  }

  /**
   * Parse the BANKMSGS data from an OFX File
   *
   * @param data The XML data to parse
   * @returns    ParsedData object with accounts and transactions
   */
  private parseBANKMSGS(data: OfxBankMessage): ParsedData {
    // Parse Account Data
    const account: Account = {
      id: data.STMTTRNRS.STMTRS.BANKACCTFROM.ACCTID,
      name: data.STMTTRNRS.STMTRS.BANKACCTFROM.ACCTID,
      balances: {
        current: data.STMTTRNRS?.STMTRS?.LEDGERBAL?.BALAMT
          ? parseFloat(data.STMTTRNRS.STMTRS.LEDGERBAL.BALAMT)
          : undefined,
        available: data.STMTTRNRS?.STMTRS?.AVAILBAL?.BALAMT
          ? parseFloat(data.STMTTRNRS.STMTRS.AVAILBAL.BALAMT)
          : undefined,
        iso_currency_code: data.STMTTRNRS.STMTRS.CURDEF,
      },
    }

    // Parse Statement Transactions Data
    const transactions: Transaction[] = data.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN.reduce(
      (accumulator, { FITID, DTPOSTED, NAME, TRNAMT, MEMO }) => {
        return [
          ...accumulator,
          {
            id: FITID,
            date: parseOFXDate(DTPOSTED),
            name: NAME,
            pending: false,
            amount: parseFloat(TRNAMT),
            account_id: account.id,
            memo: MEMO,
            iso_currency_code: account.balances.iso_currency_code,
          } as Transaction,
        ]
      },
      [],
    )

    return {
      accounts: [account],
      transactions,
    }
  }

  /**
   * Parse the CREDITCARDMSG data from an OFX File
   *
   * @param data The XML data to parse
   * @returns    ParsedData object with accounts and transactions
   */
  private parseCREDITCARDMSG(data: OfxCreditCardMessage): ParsedData {
    // Parse Account Data
    const account: Account = {
      id: data.CCSTMTTRNRS.CCSTMTRS.CCACCTFROM.ACCTID,
      name: data.CCSTMTTRNRS.CCSTMTRS.CCACCTFROM.ACCTID,
      balances: {
        current: data.CCSTMTTRNRS?.CCSTMTRS?.LEDGERBAL?.BALAMT
          ? parseFloat(data.CCSTMTTRNRS.CCSTMTRS.LEDGERBAL.BALAMT)
          : undefined,
        available: data.CCSTMTTRNRS?.CCSTMTRS?.AVAILBAL?.BALAMT
          ? parseFloat(data.CCSTMTTRNRS.CCSTMTRS.AVAILBAL.BALAMT)
          : undefined,
        iso_currency_code: data.CCSTMTTRNRS.CCSTMTRS.CURDEF,
      },
    }

    // Parse Statement Transactions Data
    const transactions: Transaction[] = data.CCSTMTTRNRS.CCSTMTRS.BANKTRANLIST.STMTTRN.reduce(
      (accumulator, { FITID, DTPOSTED, NAME, TRNAMT, MEMO }) => {
        return [
          ...accumulator,
          {
            id: FITID,
            date: parseOFXDate(DTPOSTED),
            name: NAME,
            pending: false,
            amount: parseFloat(TRNAMT),
            account_id: account.id,
            memo: MEMO,
            iso_currency_code: account.balances.iso_currency_code,
          } as Transaction,
        ]
      },
      [],
    )

    return {
      accounts: [account],
      transactions,
    }
  }

  /**
   * Convert OFX String data from file into JavaScript object of type OfxBody
   * for parsing
   *
   * @param ofxString   The raw OFX string data
   * @returns           A promise that resolves to an OfxBody object
   */
  private convertFromXML(ofxString: string): Promise<OfxBody> {
    return new Promise((resolve, reject) => {
      if (!this.validOfxString(ofxString)) {
        reject(new Error('Attempting to convert an invalid string.'))
      }
      const ofxResult = ofxString.split('<OFX>', 2)
      const ofxPart = `<OFX>${ofxResult[1]}`

      const xml = ofxPart
        // Replace ampersand
        .replace(/&/g, `&#038;`)
        .replace(/&amp;/g, `&#038;`)
        // Remove empty spaces and line breaks between tags
        .replace(/>\s+</g, '><')
        // Remove empty spaces and line breaks before tags content
        .replace(/\s+</g, '<')
        // Remove empty spaces and line breaks after tags content
        .replace(/>\s+/g, '>')
        // Remove dots in start-tags names and remove end-tags with dots
        .replace(/<([A-Z0-9_]*)+\.+([A-Z0-9_]*)>([^<]+)(<\/\1\.\2>)?/g, '<$1$2>$3')
        // Add a new end-tags for the ofx elements
        .replace(/<(\w+?)>([^<]+)/g, '<$1>$2</<added>$1>')
        // Remove duplicate end-tags
        .replace(/<\/<added>(\w+?)>(<\/\1>)?/g, '</$1>')

      let json: any
      const parser = new xml2js.Parser({
        explicitArray: false,
        valueProcessors: [(value, _) => decodeXML(value).trim()],
      })
      parser.parseString(xml, (err, result) => {
        if (err) {
          reject(err)
        }
        json = result
        resolve(json)
      })
    })
  }

  /**
   * Validate if this is a valid OFX string
   *
   * @param ofxString   The raw OFX string data
   * @returns           true - is valid, false - is invalid
   */
  private validOfxString(ofxString: string) {
    return ofxString.indexOf('<OFX>') > -1
  }
}
