/**
 * Currencies
 */

export type Currency = {
  // Full English Currency Name
  name: string
  // ISO 4217 currency code
  code: string
  // Currency Symbol
  symbol: string
  // Currency Main Country Flag
  flag: string
  // Display in Suggested List (true)
  suggested?: boolean
}

export const allCurrencies: Array<Currency> = [
  { name: 'Afghan Afghani', code: 'AFN', symbol: '؋', flag: 'AF' },
  { name: 'Albanian Lek', code: 'ALL', symbol: 'L', flag: 'AL' },
  { name: 'Algerian Dinar', code: 'DZD', symbol: 'د.ج', flag: 'DZ' },
  { name: 'Angolan Kwanza', code: 'AOA', symbol: 'Kz', flag: 'AO' },
  { name: 'Argentine Peso', code: 'ARS', symbol: '$', flag: 'AR' },
  { name: 'Armenian Dram', code: 'AMD', symbol: 'դր.', flag: 'AM' },
  { name: 'Aruban Florin', code: 'AWG', symbol: 'ƒ', flag: 'AW' },
  { name: 'Australian Dollar', code: 'AUD', symbol: '$', flag: 'AU' },
  { name: 'Azerbaijani Manat', code: 'AZN', symbol: 'm', flag: 'AZ' },
  { name: 'Bahamian Dollar', code: 'BSD', symbol: '$', flag: 'BS' },
  { name: 'Bahraini Dinar', code: 'BHD', symbol: '.د.ب', flag: 'BH' },
  { name: 'Bangladeshi Taka', code: 'BDT', symbol: '৳', flag: 'BD' },
  { name: 'Barbados Dollar', code: 'BBD', symbol: '$', flag: 'BB' },
  { name: 'Belarusian Ruble', code: 'BYN', symbol: 'Br', flag: 'BY' },
  { name: 'Belize Dollar', code: 'BZD', symbol: '$', flag: 'BZ' },
  { name: 'Bermudian Dollar', code: 'BMD', symbol: 'BD$', flag: 'BM' },
  { name: 'Bhutanese Ngultrum', code: 'BTN', symbol: 'Nu.', flag: 'BT' },
  { name: 'Boliviano', code: 'BOB', symbol: 'Bs.', flag: 'BO' },
  { name: 'Bosnia And Herzegovina Convertible Mark', code: 'BAM', symbol: 'КМ', flag: 'BA' },
  { name: 'Botswana Pula', code: 'BWP', symbol: 'P', flag: 'BW' },
  { name: 'Brazilian Real', code: 'BRL', symbol: 'R$', flag: 'BR' },
  { name: 'British Pound Sterling', code: 'GBP', symbol: '£', flag: 'GB', suggested: true },
  { name: 'Brunei Dollar', code: 'BND', symbol: '$', flag: 'BN' },
  { name: 'Bulgarian Lev', code: 'BGN', symbol: 'лв', flag: 'BG' },
  { name: 'Burundian Franc', code: 'BIF', symbol: 'Fr', flag: 'BI' },
  { name: 'Cambodian Riel', code: 'KHR', symbol: '៛', flag: 'KH' },
  { name: 'Canadian Dollar', code: 'CAD', symbol: '$', flag: 'CA', suggested: true },
  { name: 'Cape Verde Escudo', code: 'CVE', symbol: 'Esc', flag: 'CV' },
  { name: 'Cayman Islands Dollar', code: 'KYD', symbol: '$', flag: 'KY' },
  { name: 'Central African CFA Franc', code: 'XAF', symbol: 'FCFA', flag: 'XX' },
  { name: 'Chilean Peso', code: 'CLP', symbol: '$', flag: 'CL' },
  { name: 'Chinese Yuan', code: 'CNY', symbol: '¥', flag: 'CN' },
  { name: 'Colombian Peso', code: 'COP', symbol: '$', flag: 'CO' },
  { name: 'Comorian Franc', code: 'KMF', symbol: 'CF', flag: 'KM' },
  { name: 'Congolese Franc', code: 'CDF', symbol: 'FC', flag: 'CG' },
  { name: 'Costa Rican Colon', code: 'CRC', symbol: '₡', flag: 'CR' },
  { name: 'Croatian Kuna', code: 'HRK', symbol: 'kn', flag: 'HR' },
  { name: 'Cuban Peso', code: 'CUP', symbol: '$', flag: 'CU' },
  { name: 'Czech Koruna', code: 'CZK', symbol: 'Kč', flag: 'CZ' },
  { name: 'Danish Krone', code: 'DKK', symbol: 'kr', flag: 'DK' },
  { name: 'Djiboutian Franc', code: 'DJF', symbol: 'Fr', flag: 'DJ' },
  { name: 'Dominican Peso', code: 'DOP', symbol: '$', flag: 'DO' },
  { name: 'Eastern Caribbean Dollar', code: 'XCD', symbol: 'EC$', flag: 'XX' },
  { name: 'Egyptian Pound', code: 'EGP', symbol: 'ج.م', flag: 'EG' },
  { name: 'Eritrean Nakfa', code: 'ERN', symbol: 'Nfk', flag: 'ER' },
  { name: 'Ethiopian Birr', code: 'ETB', symbol: 'Br', flag: 'ET' },
  { name: 'Euro', code: 'EUR', symbol: '€', flag: 'EU', suggested: true },
  { name: 'Falkland Islands Pound', code: 'FKP', symbol: '£', flag: 'FK' },
  { name: 'Fijian Dollar', code: 'FJD', symbol: 'FJ$', flag: 'FJ' },
  { name: 'French Pacific Franc', code: 'XPF', symbol: '₣', flag: 'XX' },
  { name: 'Gambian Dalasi', code: 'GMD', symbol: 'D', flag: 'GM' },
  { name: 'Georgian Lari', code: 'GEL', symbol: 'ლ', flag: 'GE' },
  { name: 'Ghanaian Cedi', code: 'GHS', symbol: '₵', flag: 'GH' },
  { name: 'Gibraltar Pound', code: 'GIP', symbol: '£', flag: 'GI' },
  { name: 'Guatemalan Quetzal', code: 'GTQ', symbol: 'Q', flag: 'GT' },
  { name: 'Guinean Franc', code: 'GNF', symbol: 'FG', flag: 'GN' },
  { name: 'Guyanese Dollar', code: 'GYD', symbol: '$', flag: 'GY' },
  { name: 'Haitian Gourde', code: 'HTG', symbol: 'G', flag: 'HT' },
  { name: 'Honduran Lempira', code: 'HNL', symbol: 'L', flag: 'HN' },
  { name: 'Hong Kong Dollar', code: 'HKD', symbol: '$', flag: 'HK' },
  { name: 'Hungarian Forint', code: 'HUF', symbol: 'Ft', flag: 'HU' },
  { name: 'Icelandic Króna', code: 'ISK', symbol: 'kr', flag: 'IS' },
  { name: 'Indian Rupee', code: 'INR', symbol: '₹', flag: 'IN' },
  { name: 'Indonesian Rupiah', code: 'IDR', symbol: 'Rp', flag: 'ID' },
  { name: 'Iranian Rial', code: 'IRR', symbol: '﷼', flag: 'IR' },
  { name: 'Iraqi Dinar', code: 'IQD', symbol: 'ع.د', flag: 'IQ' },
  { name: 'Israeli Shekel', code: 'ILS', symbol: '₪', flag: 'IL' },
  { name: 'Jamaican Dollars', code: 'JMD', symbol: '$', flag: 'JM' },
  { name: 'Japanese Yen', code: 'JPY', symbol: '¥', flag: 'JP' },
  { name: 'Jordanian Dinar', code: 'JOD', symbol: 'د.ا', flag: 'JO' },
  { name: 'Kazakhstani Tenge', code: 'KZT', symbol: '₸', flag: 'KZ' },
  { name: 'Kenyan Shilling', code: 'KES', symbol: '/-', flag: 'KE' },
  { name: 'North Korean Won', code: 'KPW', symbol: '₩', flag: 'KP' },
  { name: 'South Korean Won', code: 'KRW', symbol: '₩', flag: 'KR' },
  { name: 'Kuwaiti Dinar', code: 'KWD', symbol: 'KD', flag: 'KW' },
  { name: 'Kyrgyzstani Som', code: 'KGS', symbol: 'Лв', flag: 'KG' },
  { name: 'Lao Kip', code: 'LAK', symbol: '₭', flag: 'LA' },
  { name: 'Lebanese Pound', code: 'LBP', symbol: 'ل.ل', flag: 'LB' },
  { name: 'Lesotho Loti', code: 'LSL', symbol: 'L', flag: 'LS' },
  { name: 'Liberian Dollar', code: 'LRD', symbol: 'L$', flag: 'LR' },
  { name: 'Libyan Dinar', code: 'LYD', symbol: 'LD', flag: 'LY' },
  { name: 'Macanese Pataca', code: 'MOP', symbol: 'MOP$', flag: 'MO' },
  { name: 'Macedonian Denar', code: 'MKD', symbol: 'Ден', flag: 'MK' },
  { name: 'Malagasy Ariary', code: 'MGA', symbol: 'Ar', flag: 'MG' },
  { name: 'Malawian Kwacha', code: 'MWK', symbol: 'MK', flag: 'MW' },
  { name: 'Malaysian Ringgit', code: 'MYR', symbol: 'RM', flag: 'MY' },
  { name: 'Rufiyaa', code: 'MVR', symbol: 'Rf', flag: 'MV' },
  { name: 'Mauritanian Ouguiya', code: 'MRU', symbol: 'UM', flag: 'MR' },
  { name: 'Mauritian Rupee', code: 'MUR', symbol: '₨', flag: 'MU' },
  { name: 'Mexican Peso', code: 'MXN', symbol: 'Mex$', flag: 'MX' },
  { name: 'Moldovan Leu', code: 'MDL', symbol: 'L', flag: 'MD' },
  { name: 'Mongolian Tögrög', code: 'MNT', symbol: '₮', flag: 'MN' },
  { name: 'Moroccan Dirham', code: 'MAD', symbol: 'MAD', flag: 'MA' },
  { name: 'Mozambican Metical', code: 'MZN', symbol: 'MT', flag: 'MZ' },
  { name: 'Myanmar Kyat', code: 'MMK', symbol: 'K', flag: 'MM' },
  { name: 'Namibian Dollar', code: 'NAD', symbol: 'N$', flag: 'NA' },
  { name: 'Nepalese Rupee', code: 'NPR', symbol: 'रु', flag: 'NP' },
  { name: 'Netherlands Antillean Guilder', code: 'ANG', symbol: 'NAf', flag: 'NL' },
  { name: 'New Zealand Dollar', code: 'NZD', symbol: '$', flag: 'NZ' },
  { name: 'Nicaraguan Córdoba', code: 'NIO', symbol: 'C$', flag: 'NI' },
  { name: 'Nigerian Naira', code: 'NGN', symbol: '₦', flag: 'NG' },
  { name: 'Norwegian Krone', code: 'NOK', symbol: 'kr', flag: 'NO' },
  { name: 'Omani Rial', code: 'OMR', symbol: 'ر.ع', flag: 'OM' },
  { name: 'Pakistani Rupee', code: 'PKR', symbol: '₨', flag: 'PK' },
  { name: 'Papua New Guinean Kina', code: 'PGK', symbol: 'K', flag: 'PG' },
  { name: 'Paraguayan Guaraní', code: 'PYG', symbol: '₲', flag: 'PY' },
  { name: 'Peruvian Sol', code: 'PEN', symbol: 'S/', flag: 'PE' },
  { name: 'Philippine Peso', code: 'PHP', symbol: '₱', flag: 'PH' },
  { name: 'Polish Złoty', code: 'PLN', symbol: 'zł', flag: 'PL' },
  { name: 'Qatari Riyal', code: 'QAR', symbol: 'QR', flag: 'PL' },
  { name: 'Romanian Leu', code: 'RON', symbol: 'lei', flag: 'RO' },
  { name: 'Russian Ruble', code: 'RUB', symbol: '₽', flag: 'RU' },
  { name: 'Rwandan Franc', code: 'RWF', symbol: 'FRw', flag: 'RW' },
  { name: 'Samoan Tālā', code: 'WST', symbol: 'ST', flag: 'WS' },
  { name: 'São Tomé and Príncipe Dobra', code: 'STD', symbol: 'Db', flag: 'ST' },
  { name: 'Saudi Riyal', code: 'SAR', symbol: 'SR', flag: 'SA' },
  { name: 'Serbian Dinar', code: 'RSD', symbol: 'din', flag: 'RS' },
  { name: 'Seychellois Rupee', code: 'SCR', symbol: 'SRe', flag: 'SC' },
  { name: 'Sierra Leonean Leone', code: 'SLL', symbol: 'Le', flag: 'SL' },
  { name: 'Singapore Dollar', code: 'SGD', symbol: 'S$', flag: 'SG' },
  { name: 'Solomon Islands Dollar', code: 'SBD', symbol: 'Si$', flag: 'SB' },
  { name: 'Somali Shilling', code: 'SOS', symbol: 'Sh.so.', flag: 'SO' },
  { name: 'South African Rand', code: 'ZAR', symbol: 'R', flag: 'ZA' },
  { name: 'South Sudanese Pound', code: 'SSP', symbol: '£', flag: 'SS' },
  { name: 'Sri Lankan Rupee', code: 'LKR', symbol: 'Rs', flag: 'LK' },
  { name: 'Sudanese Pound', code: 'SDG', symbol: 'ج.س', flag: 'LK' },
  { name: 'Surinamese Dollar', code: 'SRD', symbol: '$', flag: 'SR' },
  { name: 'Swazi Lilangeni', code: 'SZL', symbol: 'L', flag: 'SZ' },
  { name: 'Swedish Krona', code: 'SEK', symbol: 'kr', flag: 'SE' },
  { name: 'Swiss Franc', code: 'CHF', symbol: 'CHf', flag: 'CH' },
  { name: 'Syrian Pound', code: 'SYP', symbol: 'LS', flag: 'SY' },
  { name: 'New Taiwan Dollar', code: 'TWD', symbol: 'NT$', flag: 'TW' },
  { name: 'Tajikistani Somoni', code: 'TJS', symbol: 'SM', flag: 'TJ' },
  { name: 'Thai Baht', code: 'THB', symbol: '฿', flag: 'TH' },
  { name: 'Tongan Paʻanga', code: 'TOP', symbol: 'PT', flag: 'TO' },
  { name: 'Trinidad and Tobago Dollar', code: 'TTD', symbol: 'TT$', flag: 'TT' },
  { name: 'Tunisian Dinar', code: 'TND', symbol: 'DT', flag: 'TN' },
  { name: 'Turkish Lira', code: 'TRY', symbol: '₺', flag: 'TR' },
  { name: 'Turkmenistani Manat', code: 'TMT', symbol: 'T', flag: 'TM' },
  { name: 'Ugandan Shilling', code: 'UGX', symbol: 'USh', flag: 'UG' },
  { name: 'Ukrainian Bryvnia', code: 'UAH', symbol: '₴', flag: 'UA' },
  { name: 'United Arab Emirates Dirham', code: 'AED', symbol: 'د.إ', flag: 'AE' },
  { name: 'United States Dollar', code: 'USD', symbol: '$', flag: 'US', suggested: true },
  { name: 'Tanzanian Shilling', code: 'TZS', symbol: 'TSh', flag: 'TZ' },
  { name: 'Uruguayan Peso', code: 'UYU', symbol: '$U', flag: 'UY' },
  { name: 'Uzbekistani Soʻm', code: 'UZS', symbol: "so'm", flag: 'UZ' },
  { name: 'Vanuatu Vatu', code: 'VUV', symbol: 'VT', flag: 'VU' },
  { name: 'Venezuelan Bolívar', code: 'VES', symbol: 'Bs', flag: 'VE' },
  { name: 'Vietnamese Dong', code: 'VND', symbol: '₫', flag: 'VN' },
  { name: 'West African CFA Franc', code: 'XOF', symbol: 'CFA', flag: 'XX' },
  { name: 'Yemeni Rial', code: 'YER', symbol: '﷼', flag: 'YE' },
  { name: 'Zambian Kwacha', code: 'ZMW', symbol: 'ZK', flag: 'ZM' },
]

// separate currencies into groups
export const groupedCurrencies: Array<{
  label: string
  options: Array<Currency>
}> = [
  {
    label: 'Suggested',
    options: allCurrencies.filter((c) => c.suggested),
  },
  {
    label: 'All Countries',
    options: allCurrencies.filter((c) => !c.suggested),
  },
]

/**
 * Helper function to get Currency from Code. Will return null
 * if not found.
 *
 * @param code  The Currency Code to lookup
 * @returns     The Currency if found, otherwise null
 */
export function getCurrencyFromCode(code: string): Currency | null {
  const codeUpper = code.toUpperCase()
  const selectedCurrency = allCurrencies.filter((currency) => currency.code === codeUpper)
  if (selectedCurrency.length > 0) {
    return selectedCurrency[0]
  }
  return null
}

/**
 * Helper function to get all valid Currency Codes. Useful for validation
 *
 * @returns     Array of Currency Codes
 */
export function getCurrencyCodes(): string[] {
  return allCurrencies.map((c) => c.code).sort()
}
