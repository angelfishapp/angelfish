/**
 * Account Types
 */

export const AccountTypes = ['depository', 'credit', 'loan', 'investment', 'other'] as const

export interface AccountType {
  // Display name for Account Type
  name: string
  // Description to provide more details
  description: string
  // Main type of account: https://plaid.com/docs/api/accounts/#account-type-schema
  type: (typeof AccountTypes)[number]
  // Subtype of account: https://plaid.com/docs/api/accounts/#account-type-schema
  subtype: string
  // Optionally specify an ISO 3166-1 alpha-2 country code the account type
  // is only available in
  country?: string
  // Optionally mark account type as Tax Exempt
  taxExempt?: boolean
}

export const allAccountTypes: Array<AccountType> = [
  {
    name: 'Checking Account',
    description: 'Everyday checking account',
    type: 'depository',
    subtype: 'checking',
  },
  {
    name: 'Savings Account',
    description: 'Everyday savings account',
    type: 'depository',
    subtype: 'savings',
  },
  {
    name: 'HSA Cash Account',
    description: 'Health Savings Account (US only) that can only hold cash',
    type: 'depository',
    subtype: 'hsa',
    country: 'US',
    taxExempt: true,
  },
  {
    name: 'Certificate of Deposit',
    description: 'Certificate of deposit account',
    type: 'depository',
    subtype: 'cd',
  },
  {
    name: 'Money Market Account',
    description: 'Money Market Account',
    type: 'depository',
    subtype: 'money market',
  },
  {
    name: 'PayPal Cash Account',
    description: 'PayPal Cash Account',
    type: 'depository',
    subtype: 'paypal',
  },
  {
    name: 'Prepaid Debit Card',
    description: 'A prepaid Debit Card Account that you can load money onto to spend',
    type: 'depository',
    subtype: 'prepaid',
  },
  {
    name: 'Brokerage Cash Management Account',
    description: 'A cash management account, typically a cash account at a brokerage',
    type: 'depository',
    subtype: 'cash management',
  },
  {
    name: 'Electronic Benefit Transfer (EBT) Account',
    description:
      'An Electronic Benefit Transfer (EBT) account, used by certain public assistance programs to distribute funds (US only)',
    type: 'depository',
    subtype: 'ebt',
    country: 'US',
    taxExempt: true,
  },
  {
    name: 'Credit Card',
    description: 'Bank-issued credit card',
    type: 'credit',
    subtype: 'credit card',
  },
  {
    name: 'PayPal Credit Card',
    description: 'PayPal-issued credit card',
    type: 'credit',
    subtype: 'paypal',
  },
  {
    name: 'Auto/Car Loan',
    description: 'Auto/Car Finance Loan',
    type: 'loan',
    subtype: 'auto',
  },
  {
    name: 'Business Loan',
    description: 'Business Loan',
    type: 'loan',
    subtype: 'business',
  },
  {
    name: 'Commercial Loan',
    description: 'Commercial Loan',
    type: 'loan',
    subtype: 'commercial',
  },
  {
    name: 'Construction Loan',
    description: 'Construction Loan',
    type: 'loan',
    subtype: 'construction',
  },
  {
    name: 'Home Equity Line of Credit (HELOC) Loan',
    description: 'Home Equity Line of Credit (HELOC) Loan',
    type: 'loan',
    subtype: 'home equity',
  },
  {
    name: 'General Loan',
    description: 'General Loan',
    type: 'loan',
    subtype: 'loan',
  },
  {
    name: 'Mortgage Loan',
    description: 'Property Mortgage Loan',
    type: 'loan',
    subtype: 'mortgage',
  },
  {
    name: 'Overdraft Account',
    description: 'Pre-approved overdraft account, usually tied to a checking account',
    type: 'loan',
    subtype: 'overdraft',
  },
  {
    name: 'Line of Credit',
    description: 'Pre-approved line of credit',
    type: 'loan',
    subtype: 'line of credit',
  },
  {
    name: 'Student Loan',
    description: 'Student Loan',
    type: 'loan',
    subtype: 'student',
  },
  {
    name: 'Other/Miscellaneous Loan',
    description: 'Any other type of loan not listed already',
    type: 'loan',
    subtype: 'other',
  },
  {
    name: '529 Plan College Investment Account',
    description: 'ax-advantaged college savings and prepaid tuition 529 plans (US only)',
    type: 'investment',
    subtype: '529',
    country: 'US',
    taxExempt: true,
  },
  {
    name: '401a Plan Employer Sponsored Money-Purchase Retriement Account',
    description: 'Employer-sponsored money-purchase 401(a) retirement plan (US only)',
    type: 'investment',
    subtype: '401a',
    country: 'US',
    taxExempt: true,
  },
  {
    name: '401k Retirement Account',
    description: 'Standard 401(k) retirement account (US only)',
    type: 'investment',
    subtype: '401k',
    country: 'US',
    taxExempt: true,
  },
  {
    name: '403(b) Retirement Savings Account',
    description: '403(b) retirement savings account for non-profits and schools (US only)',
    type: 'investment',
    subtype: '403B',
    country: 'US',
    taxExempt: true,
  },
  {
    name: '457(b) Retirement Plan',
    description:
      'Tax-advantaged deferred-compensation 457(b) retirement plan for governments and non-profits (US only)',
    type: 'investment',
    subtype: '457b',
    country: 'US',
    taxExempt: true,
  },
  {
    name: 'Stock Brokerage Investment Account',
    description: 'Standard stock brokerage investment account',
    type: 'investment',
    subtype: 'brokerage',
  },
  {
    name: 'Cash ISA Savings Account',
    description: 'Individual Savings Account (ISA) that pays interest tax-free (UK only)',
    type: 'investment',
    subtype: 'cash isa',
    country: 'GB',
    taxExempt: true,
  },
  {
    name: 'Coverdell Education Savings Account (ESA)',
    description: 'Tax-advantaged Coverdell Education Savings Account (ESA) (US only)',
    type: 'investment',
    subtype: 'education savings account',
    country: 'US',
    taxExempt: true,
  },
  {
    name: 'Fixed Annuity Investment Account',
    description: 'Fixed Annuity Investment Account',
    type: 'investment',
    subtype: 'fixed annuity',
  },
  {
    name: 'Guaranteed Investment Certificate',
    description: 'Guaranteed Investment Certificate (Canada only)',
    type: 'investment',
    subtype: 'gic',
    country: 'CA',
  },
  {
    name: 'Health Reimbursement Arrangement (HRA) Plan',
    description: 'Tax-advantaged Health Reimbursement Arrangement (HRA) benefit plan (US only)',
    type: 'investment',
    subtype: 'health reimbursement arrangement',
    country: 'US',
    taxExempt: true,
  },
  {
    name: 'Health Savings Account (HSA)',
    description: 'Non-cash tax-advantaged medical Health Savings Account (HSA) (US only)',
    type: 'investment',
    subtype: 'hsa',
    country: 'US',
    taxExempt: true,
  },
  {
    name: 'Traditional Invididual Retirement Account (IRA)',
    description: 'Traditional Invididual Retirement Account (IRA) (US only)',
    type: 'investment',
    subtype: 'ira',
    country: 'US',
    taxExempt: true,
  },
  {
    name: 'Non-Cash ISA Savings Account',
    description: 'Non-cash Individual Savings Account (ISA) (UK only)',
    type: 'investment',
    subtype: 'isa',
    country: 'GB',
    taxExempt: true,
  },
  {
    name: 'Keogh Self-Employed Retirement Plan',
    description: 'Keogh self-employed retirement plan (US only)',
    type: 'investment',
    subtype: 'keogh',
    country: 'US',
    taxExempt: true,
  },
  {
    name: 'Life Income Fund (LIF) Retirement Account',
    description: 'Life Income Fund (LIF) retirement account (Canada only)',
    type: 'investment',
    subtype: 'lif',
    country: 'CA',
    taxExempt: true,
  },
  {
    name: 'Locked-in Retirement Account (LIRA)',
    description: 'Locked-in Retirement Account (LIRA) (Canada only)',
    type: 'investment',
    subtype: 'lira',
    country: 'CA',
    taxExempt: true,
  },
  {
    name: 'Locked-in Retirement Income Fund (LRIF)',
    description: 'Locked-in Retirement Income Fund (LRIF) (Canada only)',
    type: 'investment',
    subtype: 'lrif',
    country: 'CA',
    taxExempt: true,
  },
  {
    name: 'Locked-in Retirement Savings Plan',
    description: 'Locked-in Retirement Savings Plan (Canada only)',
    type: 'investment',
    subtype: 'lrsp',
    country: 'CA',
    taxExempt: true,
  },
  {
    name: 'Mutual Fund',
    description: 'Mutual fund account',
    type: 'investment',
    subtype: 'mutual fund',
  },
  {
    name: 'Non-Taxable Brokerage Account',
    description: 'A non-taxable brokerage account that is not covered by other available options',
    type: 'investment',
    subtype: 'non-taxable brokerage account',
    taxExempt: true,
  },
  {
    name: 'Other/Miscellaneous Investment Account',
    description: 'An Investment Account type that is not covered by other available options',
    type: 'investment',
    subtype: 'other',
  },
  {
    name: 'Other Annuity',
    description: 'An Annuity Account type that is not covered by other available options',
    type: 'investment',
    subtype: 'other annuity',
  },
  {
    name: 'Other Insurance',
    description: 'Other Insurance Account type that is not covered by other available options',
    type: 'investment',
    subtype: 'other insurance',
  },
  {
    name: 'Pension',
    description: 'Standard pension account',
    type: 'investment',
    subtype: 'pension',
    taxExempt: true,
  },
  {
    name: 'Prescribed Registered Retirement Income Fund',
    description: 'Prescribed Registered Retirement Income Fund (Canada only)',
    type: 'investment',
    subtype: 'prif',
    taxExempt: true,
  },
  {
    name: 'Company Profit Sharing Plan',
    description: 'Plan that gives employees share of company profits',
    type: 'investment',
    subtype: 'profit sharing plan',
  },
  {
    name: 'Qualifying Share Account',
    description: 'Qualifying share account',
    type: 'investment',
    subtype: 'qshr',
  },
  {
    name: 'Registered Disability Savings Plan (RSDP)',
    description: 'Registered Disability Savings Plan (RSDP) (Canada only)',
    type: 'investment',
    subtype: 'rdsp',
    country: 'CA',
  },
  {
    name: 'Registered Education Savings Plan',
    description: 'Registered Education Savings Plan (Canada only)',
    type: 'investment',
    subtype: 'resp',
    country: 'CA',
  },
  {
    name: 'Retirement Account',
    description: 'Retirement account not covered by other available options',
    type: 'investment',
    subtype: 'retirement',
  },
  {
    name: 'Restricted Life Income Fund (RLIF)',
    description: 'Restricted Life Income Fund (RLIF) (Canada only)',
    type: 'investment',
    subtype: 'rlif',
    country: 'CA',
  },
  {
    name: 'Roth IRA',
    description: 'Roth IRA (US only)',
    type: 'investment',
    subtype: 'roth',
    country: 'US',
    taxExempt: true,
  },
  {
    name: 'Roth 401(k) Plan',
    description: 'Employer-sponsored Roth 401(k) plan (US only)',
    type: 'investment',
    subtype: 'roth 401k',
    country: 'US',
    taxExempt: true,
  },
  {
    name: 'Registered Retirement Income Fund (RRIF)',
    description: 'Registered Retirement Income Fund (RRIF) (Canada only)',
    type: 'investment',
    subtype: 'rrif',
    country: 'CA',
  },
  {
    name: 'Canadian Registered Retirement Savings Plan',
    description: 'Registered Retirement Savings Plan (Canadian, similar to US 401(k))',
    type: 'investment',
    subtype: 'rrsp',
    country: 'CA',
  },
  {
    name: 'Salary Reduction Simplified Employee Pension Plan (SARSEP)',
    description:
      'Salary Reduction Simplified Employee Pension Plan (SARSEP), discontinued retirement plan (US Only)',
    type: 'investment',
    subtype: 'sarsep',
    country: 'US',
  },
  {
    name: 'Simplified Employee Pension IRA (SEP IRA)',
    description:
      'Simplified Employee Pension IRA (SEP IRA), retirement plan for small businesses and self-employed (US only)',
    type: 'investment',
    subtype: 'sep ira',
    country: 'US',
    taxExempt: true,
  },
  {
    name: 'Savings Incentive Match Plan for Employees IRA',
    description:
      'Savings Incentive Match Plan for Employees IRA, retirement plan for small businesses (US only)',
    type: 'investment',
    subtype: 'simple ira',
    country: 'US',
    taxExempt: true,
  },
  {
    name: 'Self-Invested Personal Pension (SIPP)',
    description: 'Self-Invested Personal Pension (SIPP) (UK only)',
    type: 'investment',
    subtype: 'sipp',
    country: 'GB',
    taxExempt: true,
  },
  {
    name: 'Company Stock Plan',
    description: 'Standard stock plan account',
    type: 'investment',
    subtype: 'stock plan',
  },
  {
    name: 'Tax-Free Savings Account (TFSA)',
    description:
      'Tax-Free Savings Account (TFSA), a retirement plan similar to a Roth IRA (Canada only)',
    type: 'investment',
    subtype: 'tfsa',
    country: 'CA',
    taxExempt: true,
  },
  {
    name: 'Trust',
    description:
      'Account representing funds or assets held by a trustee for the benefit of a beneficiary. Includes both revocable and irrevocable trusts.',
    type: 'investment',
    subtype: 'trust',
  },
  {
    name: 'Uniform Gift to Minors Brokerage Account',
    description: "'Uniform Gift to Minors Act' (brokerage account for minors, US only)",
    type: 'investment',
    subtype: 'ugma',
    country: 'US',
  },
  {
    name: 'Uniform Transfers to Minors Brokerage Account',
    description: "''Uniform Transfers to Minors Act' (brokerage account for minors, US only)",
    type: 'investment',
    subtype: 'utma',
    country: 'US',
  },
  {
    name: 'Variable Annuity',
    description: 'Tax-deferred capital accumulation annuity contract',
    type: 'investment',
    subtype: 'variable annuity',
  },
  {
    name: 'Other/Miscellaneous Account',
    description: 'Other or unknown account type',
    type: 'other',
    subtype: 'other',
  },
]

// separate account types into groups
export const groupedAccountTypes: Array<AccountType> = [
  ...allAccountTypes.filter((c) => c.type == 'depository').sort(),
  ...allAccountTypes.filter((c) => c.type == 'credit').sort(),
  ...allAccountTypes.filter((c) => c.type == 'investment').sort(),
  ...allAccountTypes.filter((c) => c.type == 'loan').sort(),
  ...allAccountTypes.filter((c) => c.type == 'other').sort(),
]

/**
 * Helper Function to get display label for AccountType.type field
 *
 * @param type  The AccountType.type field
 * @returns     Display label for type
 */
export function getAccountTypeLabel(type: string) {
  switch (type) {
    case 'depository':
      return 'Cash Accounts'
    case 'credit':
      return 'Credit Cards'
    case 'loan':
      return 'Loans'
    case 'investment':
      return 'Investment Accounts'
    default:
      return 'Other'
  }
}

/**
 * Helper function to get an AccountType from string values
 *
 * @param type      The primary account type
 * @param subtype   The sub account type
 * @returns         The AccounType if valid, otherwise null
 */
export function getAccountType(type: string, subtype: string): AccountType | null {
  const found = allAccountTypes.filter((accType) => {
    if (accType.subtype == subtype && accType.type == type) {
      return true
    }
    return false
  })
  if (found.length < 1) {
    // Not Found
    return null
  }
  return found[0]
}

/**
 * Validate if an Account Type is Valid. Returns true if valid, false
 * if invalid.
 * https://plaid.com/docs/api/accounts/#account-type-schema
 *
 * @param type  The Account Type string to validate
 * @returns     true - valid, false - invalid
 */
export function validateAccountSubType(type: string, subtype: string): boolean {
  const found = allAccountTypes.filter((accType) => {
    if (accType.subtype == subtype && accType.type == type) {
      return true
    }
    return false
  })
  if (found.length < 1) {
    // Not Found
    return false
  }

  // All good
  return true
}
