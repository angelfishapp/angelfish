/**
 * Interface to represent OFX response body
 */
export interface OfxBody {
  OFX: {
    SIGNUPMSGSRSV1: {
      ACCTINFOTRNRS: {
        TRNUID: string
        ACCTINFORS: {
          DTACCTUP: string
          ACCTINFO:
            | OfxCreditCardAccount
            | OfxCreditCardAccount[]
            | OfxInvestmentAccount
            | OfxInvestmentAccount[]
            | OfxBankAccount
            | OfxBankAccount[]
        }
      }
    }
    BANKMSGSRSV1: OfxBankMessage
    CREDITCARDMSGSRSV1: OfxCreditCardMessage
  }
}

/**
 * Interface to represent OFX BANKMSGSRSV1 Body
 */
export interface OfxBankMessage {
  STMTTRNRS: {
    TRNUID: string
    STATUS: OfxResponseStatus
    CLTCOOKIE: string
    STMTRS: {
      CURDEF: string
      BANKACCTFROM: OfxBankAccountFrom
      BANKTRANLIST: {
        DTSTART: string
        DTEND: string
        STMTTRN: Array<OfxStatementTransaction>
      }
      LEDGERBAL: OfxBalance
      AVAILBAL: OfxBalance
    }
  }
}

/**
 * Interface to represent OFX CREDITCARDMSGSRSV1 Body
 */
export interface OfxCreditCardMessage {
  CCSTMTTRNRS: {
    TRNUID: string
    STATUS: OfxResponseStatus
    CLTCOOKIE: string
    CCSTMTRS: {
      CURDEF: string
      CCACCTFROM: {
        ACCTID: string
        ACCTTYPE: string
      }
      BANKTRANLIST: {
        DTSTART: string
        DTEND: string
        STMTTRN: Array<OfxStatementTransaction>
      }
      LEDGERBAL: OfxBalance
      AVAILBAL: OfxBalance
    }
  }
}

/**
 * Interface to represent OFX Response Status
 */
export interface OfxResponseStatus {
  CODE: string
  SEVERITY: string
  MESSAGE: string
}

/**
 * Interface to represent OFX Balance
 */
export interface OfxBalance {
  BALAMT: string
  DTASOF: string
}

/**
 * Interface to represent OFX Statement Transaction
 */
export interface OfxStatementTransaction {
  TRNTYPE: string
  DTPOSTED: string
  DTUSER: string
  DTAVAIL: string
  TRNAMT: string
  FITID: string
  CHECKNUM: string
  NAME?: string
  MEMO: string
  EXTDNAME?: string
  CORRECTFITID?: string
  CORRECTACTION?: 'REPLACE' | 'DELETE'
  REFNUM?: string
  SRVRTID?: string
  PAYEE?: OfxPayee
  BANKACCTTO?: string
  CCACCTTO?: string
  IMAGEDATA?: string
}

/**
 * Interface to represent OFX Payee
 */
export interface OfxPayee {
  NAME: string
  CITY: string
  STATE: string
  POSTALCODE: string
  PHONE: string
}

/**
 * Interface for OFX Credit Card Account
 */
export interface OfxCreditCardAccount {
  CCACCTINFO: {
    CCACCTFROM: {
      ACCTID: string
      ACCTTYPE: 'CREDITCARD'
      BANKID: string
    }
    SUPTXDL: string
    XFERSRC: string
    XFERDEST: string
    SVCSTATUS: 'AVAIL' | 'PEND' | 'ACTIVE'
  }
}

/**
 * Interface for OFX Loan Account
 */
export interface OfxLoanAccount {
  LOANACCTINFO: {
    LOANCCTFROM: {
      ACCTID: string
      ACCTTYPE: 'LOAN'
      BANKID: string
    }
    SUPTXDL: string
    XFERSRC: string
    XFERDEST: string
    SVCSTATUS: 'AVAIL' | 'PEND' | 'ACTIVE'
  }
}

/**
 * Interface for OFX Investment Account
 */
export interface OfxInvestmentAccount {
  INVACCTINFO: {
    CHECKING: string
    INVACCTFROM: {
      ACCTID: string
      BROKERID: string
    }
    SVCSTATUS: 'AVAIL' | 'PEND' | 'ACTIVE'
    USPRODUCTTYPE: string
  }
}

/**
 * Interface for OFX Bank Account
 */
export interface OfxBankAccount {
  BANKACCTINFO: {
    BANKACCTFROM: OfxBankAccountFrom
    SUPTXDL: string
    XFERSRC: string
    XFERDEST: string
    SVCSTATUS: string
  }
}

/**
 * Interface for OFX Bank Account From
 */
export interface OfxBankAccountFrom {
  BANKID: string
  ACCTID: string
  ACCTTYPE?:
    | 'CHECKING'
    | 'SAVINGS'
    | 'MONEYMARKET'
    | 'MONEYMRKT'
    | 'CREDITLINE'
    | 'CD'
    | 'CREDITCARD'
    | 'INVESTMENT'
    | undefined
}
