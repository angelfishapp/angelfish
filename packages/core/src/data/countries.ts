/**
 * Countries
 */

export type Country = {
  // Full English Country Name
  name: string
  // ISO 3166-1 alpha-2 country code
  code: string
  // ISO 4217 currency code
  currency: string
  // Dial Code for country
  dialCode: string
  // Used to select if countries share same dialCode
  dialAreaCodes?: string[]
  // Optionally set local phone number formatting with (i.e. (###) ###-####)
  dialFormat?: string
  // Display in Suggested List (true)
  suggested?: boolean
}

export const allCountries: Array<Country> = [
  { name: 'Afghanistan', code: 'AF', currency: 'AFN', dialCode: '93' },
  {
    name: 'Alland Islands',
    code: 'AX',
    currency: 'EUR',
    dialCode: '358',
    dialAreaCodes: ['18'],
    dialFormat: '## ### ## ##',
  },
  { name: 'Albania', code: 'AL', currency: 'ALL', dialCode: '355' },
  { name: 'Algeria', code: 'DZ', currency: 'DZD', dialCode: '213' },
  {
    name: 'American Samoa',
    code: 'AS',
    currency: 'USD',
    dialCode: '1',
    dialAreaCodes: ['684'],
    dialFormat: '(###) ###-####',
  },
  { name: 'Andorra', code: 'AD', currency: 'EUR', dialCode: '376' },
  { name: 'Angola', code: 'AO', currency: 'AOA', dialCode: '244' },
  {
    name: 'Anguilla',
    code: 'AI',
    currency: 'XCD',
    dialCode: '1',
    dialAreaCodes: ['264'],
    dialFormat: '(###) ###-####',
  },
  {
    name: 'Antigua and Barbuda',
    code: 'AG',
    currency: 'XCD',
    dialCode: '1268',
    dialFormat: '(###) ###-####',
  },
  { name: 'Argentina', code: 'AR', currency: 'ARS', dialCode: '54', dialFormat: '(##) ########' },
  { name: 'Armenia', code: 'AM', currency: 'AMD', dialCode: '374', dialFormat: '## ######' },
  { name: 'Aruba', code: 'AW', currency: 'AWG', dialCode: '297' },
  { name: 'Australia', code: 'AU', currency: 'AUD', dialCode: '61', dialFormat: '(##) #### ####' },
  { name: 'Austria', code: 'AT', currency: 'EUR', dialCode: '43' },
  { name: 'Azerbaijan', code: 'AZ', currency: 'AZN', dialCode: '994' },
  {
    name: 'Bahamas',
    code: 'BS',
    currency: 'BSD',
    dialCode: '1',
    dialAreaCodes: ['242'],
    dialFormat: '(###) ###-####',
  },
  { name: 'Bahrain', code: 'BH', currency: 'BHD', dialCode: '973' },
  { name: 'Bangladesh', code: 'BD', currency: 'BDT', dialCode: '880' },
  { name: 'Barbados', code: 'BB', currency: 'BBD', dialCode: '1', dialAreaCodes: ['246'] },
  { name: 'Belarus', code: 'BY', currency: 'BYN', dialCode: '375', dialFormat: '(##) ### ## ##' },
  { name: 'Belgium', code: 'BE', currency: 'EUR', dialCode: '32', dialFormat: '### ## ## ##' },
  { name: 'Belize', code: 'BZ', currency: 'BZD', dialCode: '501' },
  { name: 'Benin', code: 'BJ', currency: 'XOF', dialCode: '229' },
  {
    name: 'Bermuda',
    code: 'BM',
    currency: 'BMD',
    dialCode: '1',
    dialAreaCodes: ['441'],
    dialFormat: '(###) ###-####',
  },
  { name: 'Bhutan', code: 'BT', currency: 'BTN', dialCode: '975' },
  { name: 'Bolivia', code: 'BO', currency: 'BOB', dialCode: '591' },
  { name: 'Bosnia and Herzegovina', code: 'BA', currency: 'BAM', dialCode: '387' },
  { name: 'Botswana', code: 'BW', currency: 'BWP', dialCode: '267' },
  { name: 'Brazil', code: 'BR', currency: 'BRL', dialCode: '55', dialFormat: '(##) #########' },
  { name: 'British Indian Ocean Territory', code: 'IO', currency: 'USD', dialCode: '246' },
  {
    name: 'British Virgin Islands',
    code: 'VG',
    currency: 'USD',
    dialCode: '1',
    dialAreaCodes: ['284'],
    dialFormat: '(###) ###-####',
  },
  { name: 'Brunei Darussalam', code: 'BN', currency: 'BND', dialCode: '673' },
  { name: 'Bulgaria', code: 'BG', currency: 'BGN', dialCode: '359' },
  { name: 'Burkina Faso', code: 'BF', currency: 'XOF', dialCode: '226' },
  { name: 'Burundi', code: 'BI', currency: 'BIF', dialCode: '257' },
  { name: 'Cambodia', code: 'KH', currency: 'KHR', dialCode: '855' },
  { name: 'Cameroon', code: 'CM', currency: 'XAF', dialCode: '237' },
  {
    name: 'Canada',
    code: 'CA',
    currency: 'CAD',
    dialCode: '1',
    dialAreaCodes: [
      '204',
      '226',
      '236',
      '249',
      '250',
      '289',
      '306',
      '343',
      '365',
      '387',
      '403',
      '416',
      '418',
      '431',
      '437',
      '438',
      '450',
      '506',
      '514',
      '519',
      '548',
      '579',
      '581',
      '587',
      '604',
      '613',
      '639',
      '647',
      '672',
      '705',
      '709',
      '742',
      '778',
      '780',
      '782',
      '807',
      '819',
      '825',
      '867',
      '873',
      '902',
      '905',
    ],
    dialFormat: '(###) ###-####',
    suggested: true,
  },
  { name: 'Cape Verde', code: 'CV', currency: 'CVE', dialCode: '238' },
  {
    name: 'Cayman Islands',
    code: 'KY',
    currency: 'KYD',
    dialCode: '1',
    dialAreaCodes: ['345'],
    dialFormat: '(###) ###-####',
  },
  { name: 'Central African Republic', code: 'CF', currency: 'XAF', dialCode: '236' },
  { name: 'Chad', code: 'TD', currency: 'XAF', dialCode: '235' },
  { name: 'Chile', code: 'CL', currency: 'CLP', dialCode: '56' },
  { name: 'China', code: 'CN', currency: 'CNY', dialCode: '86', dialFormat: '##-#########' },
  {
    name: 'Christmas Island',
    code: 'CX',
    currency: 'AUD',
    dialCode: '61',
    dialAreaCodes: ['89164'],
    dialFormat: '(##) #### ####',
  },
  {
    name: 'Cocos (Keeling) Islands',
    code: 'CC',
    currency: 'AUD',
    dialCode: '61',
    dialAreaCodes: ['89162'],
    dialFormat: '(##) #### ####',
  },
  { name: 'Colombia', code: 'CO', currency: 'COP', dialCode: '57', dialFormat: '### ### ####' },
  { name: 'Comoros', code: 'KM', currency: 'KMF', dialCode: '269' },
  { name: 'Congo, Democratic Republic of the', code: 'CG', currency: 'CDF', dialCode: '243' },
  { name: 'Congo, Republic of the', code: 'CD', currency: 'XAF', dialCode: '242' },
  { name: 'Cook Islands', code: 'CK', currency: 'NZD', dialCode: '682' },
  { name: 'Costa Rica', code: 'CR', currency: 'CRC', dialCode: '506', dialFormat: '####-####' },
  {
    name: "Cote d'Ivoire",
    code: 'CI',
    currency: 'XOF',
    dialCode: '225',
    dialFormat: '## ## ## ##',
  },
  { name: 'Croatia', code: 'HR', currency: 'HRK', dialCode: '385' },
  { name: 'Cuba', code: 'CU', currency: 'CUP', dialCode: '53' },
  { name: 'Curacao', code: 'CW', currency: 'ANG', dialCode: '599' },
  { name: 'Cyprus', code: 'CY', currency: 'EUR', dialCode: '357', dialFormat: '## ######' },
  {
    name: 'Czech Republic',
    code: 'CZ',
    currency: 'CZK',
    dialCode: '420',
    dialFormat: '### ### ###',
  },
  { name: 'Denmark', code: 'DK', currency: 'DKK', dialCode: '45', dialFormat: '## ## ## ##' },
  { name: 'Djibouti', code: 'DJ', currency: 'DJF', dialCode: '253' },
  {
    name: 'Dominica',
    code: 'DM',
    currency: 'XCD',
    dialCode: '1',
    dialAreaCodes: ['767'],
    dialFormat: '(###) ###-####',
  },
  {
    name: 'Dominican Republic',
    code: 'DO',
    currency: 'DOP',
    dialCode: '1',
    dialAreaCodes: ['809', '829', '849'],
    dialFormat: '(###) ###-####',
  },
  { name: 'Ecuador', code: 'EC', currency: 'USD', dialCode: '593' },
  { name: 'Egypt', code: 'EG', currency: 'EGP', dialCode: '20' },
  { name: 'El Salvador', code: 'SV', currency: 'USD', dialCode: '503', dialFormat: '####-####' },
  { name: 'Equatorial Guinea', code: 'GQ', currency: 'XAF', dialCode: '240' },
  { name: 'Eritrea', code: 'ER', currency: 'ERN', dialCode: '291' },
  { name: 'Estonia', code: 'EE', currency: 'EUR', dialCode: '372', dialFormat: '#### ######' },
  { name: 'Ethiopia', code: 'ET', currency: 'ETB', dialCode: '251' },
  {
    name: 'Falkland Islands (Malvinas)',
    code: 'FK',
    currency: 'FKP',
    dialCode: '500',
    dialAreaCodes: ['2', '3', '4', '5', '6', '7'],
  },
  { name: 'Faroe Islands', code: 'FO', currency: 'DKK', dialCode: '298' },
  { name: 'Fiji', code: 'FJ', currency: 'FJD', dialCode: '679' },
  { name: 'Finland', code: 'FI', currency: 'EUR', dialCode: '358', dialFormat: '## ### ## ##' },
  { name: 'France', code: 'FR', currency: 'EUR', dialCode: '33', dialFormat: '# ## ## ## ##' },
  { name: 'French Guiana', code: 'GF', currency: 'EUR', dialCode: '594' },
  { name: 'French Polynesia', code: 'PF', currency: 'XPF', dialCode: '689' },
  { name: 'French Southern Territories', code: 'TF', currency: 'EUR', dialCode: '262' },
  { name: 'Gabon', code: 'GA', currency: 'XAF', dialCode: '241' },
  { name: 'Gambia', code: 'GM', currency: 'GMD', dialCode: '220' },
  { name: 'Georgia', code: 'GE', currency: 'GEL', dialCode: '995' },
  { name: 'Germany', code: 'DE', currency: 'EUR', dialCode: '49', dialFormat: '#### ########' },
  { name: 'Ghana', code: 'GH', currency: 'GHS', dialCode: '233' },
  { name: 'Gibraltar', code: 'GI', currency: 'GIP', dialCode: '350' },
  { name: 'Greece', code: 'GR', currency: 'EUR', dialCode: '30' },
  { name: 'Greenland', code: 'GL', currency: 'DKK', dialCode: '299' },
  {
    name: 'Grenada',
    code: 'GD',
    currency: 'XCD',
    dialCode: '1',
    dialAreaCodes: ['473'],
    dialFormat: '(###) ###-####',
  },
  { name: 'Guadeloupe', code: 'GP', currency: 'EUR', dialCode: '590' },
  {
    name: 'Guam',
    code: 'GU',
    currency: 'USD',
    dialCode: '1',
    dialAreaCodes: ['671'],
    dialFormat: '(###) ###-####',
  },
  { name: 'Guatemala', code: 'GT', currency: 'GTQ', dialCode: '502' },
  {
    name: 'Guernsey',
    code: 'GG',
    currency: 'GBP',
    dialCode: '44',
    dialAreaCodes: ['1481'],
    dialFormat: '#### ######',
  },
  { name: 'Guinea-Bissau', code: 'GW', currency: 'XOF', dialCode: '245' },
  { name: 'Guinea', code: 'GN', currency: 'GNF', dialCode: '224' },
  { name: 'Guyana', code: 'GY', currency: 'GYD', dialCode: '592' },
  { name: 'Haiti', code: 'HT', currency: 'HTG', dialCode: '509' },
  { name: 'Heard Island and McDonald Islands', code: 'HM', currency: 'AUD', dialCode: '672' },
  {
    name: 'Holy See (Vatican City State)',
    code: 'VA',
    currency: 'EUR',
    dialCode: '379',
    dialFormat: '## #### ####',
  },
  { name: 'Honduras', code: 'HN', currency: 'HNL', dialCode: '504' },
  { name: 'Hong Kong', code: 'HK', currency: 'HKD', dialCode: '852' },
  { name: 'Hungary', code: 'HU', currency: 'HUF', dialCode: '36' },
  { name: 'Iceland', code: 'IS', currency: 'ISK', dialCode: '354', dialFormat: '### ####' },
  { name: 'India', code: 'IN', currency: 'INR', dialCode: '91', dialFormat: '#####-#####' },
  { name: 'Indonesia', code: 'ID', currency: 'IDR', dialCode: '62' },
  {
    name: 'Iran, Islamic Republic of',
    code: 'IR',
    currency: 'IRR',
    dialCode: '98',
    dialFormat: '### ### ####',
  },
  { name: 'Iraq', code: 'IQ', currency: 'IQD', dialCode: '964' },
  { name: 'Ireland', code: 'IE', currency: 'EUR', dialCode: '353', dialFormat: '## #######' },
  {
    name: 'Isle of Man',
    code: 'IM',
    currency: 'GBP',
    dialCode: '44',
    dialAreaCodes: ['1624'],
    dialFormat: '#### ######',
  },
  { name: 'Israel', code: 'IL', currency: 'ILS', dialCode: '972', dialFormat: '### ### ####' },
  { name: 'Italy', code: 'IT', currency: 'EUR', dialCode: '39' },
  { name: 'Jamaica', code: 'JM', currency: 'JMD', dialCode: '1', dialAreaCodes: ['876'] },
  { name: 'Japan', code: 'JP', currency: 'JPY', dialCode: '81' },
  {
    name: 'Jersey',
    code: 'JE',
    currency: 'GBP',
    dialCode: '44',
    dialAreaCodes: ['1534'],
    dialFormat: '#### ######',
  },
  { name: 'Jordan', code: 'JO', currency: 'JOD', dialCode: '962' },
  {
    name: 'Kazakhstan',
    code: 'KZ',
    currency: 'KZT',
    dialCode: '7',
    dialAreaCodes: [
      '310',
      '311',
      '312',
      '313',
      '315',
      '318',
      '321',
      '324',
      '325',
      '326',
      '327',
      '336',
      '7172',
      '73622',
    ],
    dialFormat: '### ###-##-##',
  },
  { name: 'Kenya', code: 'KE', currency: 'KES', dialCode: '254' },
  { name: 'Kiribati', code: 'KI', currency: 'AUD', dialCode: '686' },
  { name: "Korea, Democratic People's Republic of", code: 'KP', currency: 'KPW', dialCode: '850' },
  {
    name: 'Korea, Republic of',
    code: 'KR',
    currency: 'KRW',
    dialCode: '82',
    dialFormat: '### #### ####',
  },
  { name: 'Kosovo', code: 'XK', currency: 'EUR', dialCode: '383' },
  { name: 'Kuwait', code: 'KW', currency: 'KWD', dialCode: '965' },
  { name: 'Kyrgyzstan', code: 'KG', currency: 'KGS', dialCode: '996', dialFormat: '### ### ###' },
  { name: "Lao People's Democratic Republic", code: 'LA', currency: 'LAK', dialCode: '856' },
  { name: 'Latvia', code: 'LV', currency: 'EUR', dialCode: '371', dialFormat: '## ### ###' },
  { name: 'Lebanon', code: 'LB', currency: 'LBP', dialCode: '961' },
  { name: 'Lesotho', code: 'LS', currency: 'LSL', dialCode: '266' },
  { name: 'Liberia', code: 'LR', currency: 'LRD', dialCode: '231' },
  { name: 'Libya', code: 'LY', currency: 'LYD', dialCode: '218' },
  { name: 'Liechtenstein', code: 'LI', currency: 'CHF', dialCode: '423' },
  { name: 'Lithuania', code: 'LT', currency: 'EUR', dialCode: '370' },
  { name: 'Luxembourg', code: 'LU', currency: 'EUR', dialCode: '352' },
  { name: 'Macao', code: 'MO', currency: 'MOP', dialCode: '853' },
  { name: 'Macedonia', code: 'MK', currency: 'MKD', dialCode: '389' },
  { name: 'Madagascar', code: 'MG', currency: 'MGA', dialCode: '261' },
  { name: 'Malawi', code: 'MW', currency: 'MWK', dialCode: '265' },
  { name: 'Malaysia', code: 'MY', currency: 'MYR', dialCode: '60', dialFormat: '##-####-####' },
  { name: 'Maldives', code: 'MV', currency: 'MVR', dialCode: '960' },
  { name: 'Mali', code: 'ML', currency: 'XOF', dialCode: '223' },
  { name: 'Malta', code: 'MT', currency: 'EUR', dialCode: '356' },
  { name: 'Marshall Islands', code: 'MH', currency: 'USD', dialCode: '692' },
  { name: 'Martinique', code: 'MQ', currency: 'EUR', dialCode: '596' },
  { name: 'Mauritania', code: 'MR', currency: 'MRU', dialCode: '222' },
  { name: 'Mauritius', code: 'MU', currency: 'MUR', dialCode: '230' },
  { name: 'Mayotte', code: 'YT', currency: 'EUR', dialCode: '262', dialAreaCodes: ['269', '639'] },
  { name: 'Mexico', code: 'MX', currency: 'MXN', dialCode: '52' },
  { name: 'Micronesia, Federated States of', code: 'FM', currency: 'USD', dialCode: '691' },
  {
    name: 'Moldova, Republic of',
    code: 'MD',
    currency: 'MDL',
    dialCode: '373',
    dialFormat: '(##) ##-##-##',
  },
  { name: 'Monaco', code: 'MC', currency: 'EUR', dialCode: '377' },
  { name: 'Mongolia', code: 'MN', currency: 'MNT', dialCode: '976' },
  { name: 'Montenegro', code: 'ME', currency: 'EUR', dialCode: '382' },
  {
    name: 'Montserrat',
    code: 'MS',
    currency: 'XCD',
    dialCode: '1',
    dialAreaCodes: ['664'],
    dialFormat: '(###) ###-####',
  },
  { name: 'Morocco', code: 'MA', currency: 'MAD', dialCode: '212' },
  { name: 'Mozambique', code: 'MZ', currency: 'MZN', dialCode: '258' },
  { name: 'Myanmar', code: 'MM', currency: 'MMK', dialCode: '95' },
  { name: 'Namibia', code: 'NA', currency: 'NAD', dialCode: '264' },
  { name: 'Nauru', code: 'NR', currency: 'AUD', dialCode: '674' },
  { name: 'Nepal', code: 'NP', currency: 'NPR', dialCode: '977' },
  { name: 'Netherlands', code: 'NL', currency: 'EUR', dialCode: '31', dialFormat: '## ########' },
  { name: 'New Caledonia', code: 'NC', currency: 'XPF', dialCode: '687' },
  { name: 'New Zealand', code: 'NZ', currency: 'NZD', dialCode: '64', dialFormat: '###-###-####' },
  { name: 'Nicaragua', code: 'NI', currency: 'NIO', dialCode: '505' },
  { name: 'Niger', code: 'NE', currency: 'XOF', dialCode: '227' },
  { name: 'Nigeria', code: 'NG', currency: 'NGN', dialCode: '234' },
  { name: 'Niue', code: 'NU', currency: 'NZD', dialCode: '683' },
  { name: 'Norfolk Island', code: 'NF', currency: 'AUD', dialCode: '672', dialAreaCodes: ['3'] },
  {
    name: 'Northern Mariana Islands',
    code: 'MP',
    currency: 'USD',
    dialCode: '1',
    dialAreaCodes: ['670'],
    dialFormat: '(###) ###-####',
  },
  { name: 'Norway', code: 'NO', currency: 'NOK', dialCode: '47', dialFormat: '### ## ###' },
  { name: 'Oman', code: 'OM', currency: 'OMR', dialCode: '968' },
  { name: 'Pakistan', code: 'PK', currency: 'PKR', dialCode: '92', dialFormat: '###-#######' },
  { name: 'Palau', code: 'PW', currency: 'USD', dialCode: '680' },
  { name: 'Palestine, State of', code: 'PS', currency: 'JOD', dialCode: '970' },
  { name: 'Panama', code: 'PA', currency: 'USD', dialCode: '507' },
  { name: 'Papua New Guinea', code: 'PG', currency: 'PGK', dialCode: '675' },
  { name: 'Paraguay', code: 'PY', dialCode: '595', currency: 'PYG' },
  { name: 'Peru', code: 'PE', dialCode: '51', currency: 'PEN' },
  { name: 'Philippines', code: 'PH', currency: 'PHP', dialCode: '63', dialFormat: '#### #######' },
  { name: 'Pitcairn', code: 'PN', currency: 'NZD', dialCode: '870' },
  { name: 'Poland', code: 'PL', currency: 'PLN', dialCode: '48', dialFormat: '###-###-##' },
  { name: 'Portugal', code: 'PT', currency: 'EUR', dialCode: '351' },
  {
    name: 'Puerto Rico',
    code: 'PR',
    currency: 'USD',
    dialCode: '1',
    dialAreaCodes: ['787', '939'],
    dialFormat: '(###) ###-####',
  },
  { name: 'Qatar', code: 'QA', currency: 'QAR', dialCode: '974' },
  {
    name: 'Reunion',
    code: 'RE',
    currency: 'EUR',
    dialCode: '262',
    dialAreaCodes: ['263', '693', '976'],
  },
  { name: 'Romania', code: 'RO', currency: 'RON', dialCode: '40' },
  {
    name: 'Russian Federation',
    code: 'RU',
    currency: 'RUB',
    dialCode: '7',
    dialFormat: '(###) ###-##-##',
  },
  { name: 'Rwanda', code: 'RW', currency: 'RWF', dialCode: '250' },
  { name: 'Saint Barthelemy', code: 'BL', currency: 'EUR', dialCode: '590', dialAreaCodes: ['27'] },
  { name: 'Saint Helena', code: 'SH', currency: 'GBP', dialCode: '290' },
  {
    name: 'Saint Kitts and Nevis',
    code: 'KN',
    currency: 'XCD',
    dialCode: '1',
    dialAreaCodes: ['869'],
    dialFormat: '(###) ###-####',
  },
  {
    name: 'Saint Lucia',
    code: 'LC',
    currency: 'XCD',
    dialCode: '1',
    dialAreaCodes: ['758'],
    dialFormat: '(###) ###-####',
  },
  {
    name: 'Saint Martin (French part)',
    code: 'MF',
    currency: 'EUR',
    dialCode: '590',
    dialAreaCodes: ['590', '690'],
  },
  { name: 'Saint Pierre and Miquelon', code: 'PM', currency: 'EUR', dialCode: '508' },
  {
    name: 'Saint Vincent and the Grenadines',
    code: 'VC',
    currency: 'XCD',
    dialCode: '1',
    dialAreaCodes: ['784'],
    dialFormat: '(###) ###-####',
  },
  { name: 'Samoa', code: 'WS', currency: 'WST', dialCode: '685' },
  { name: 'San Marino', code: 'SM', currency: 'EUR', dialCode: '378' },
  { name: 'Sao Tome and Principe', code: 'ST', currency: 'STD', dialCode: '239' },
  { name: 'Saudi Arabia', code: 'SA', currency: 'SAR', dialCode: '966' },
  { name: 'Senegal', code: 'SN', currency: 'XOF', dialCode: '221' },
  { name: 'Serbia', code: 'RS', currency: 'RSD', dialCode: '381' },
  { name: 'Seychelles', code: 'SC', currency: 'SCR', dialCode: '248' },
  { name: 'Sierra Leone', code: 'SL', currency: 'SLL', dialCode: '232' },
  { name: 'Singapore', code: 'SG', currency: 'SGD', dialCode: '65', dialFormat: '####-####' },
  {
    name: 'Sint Maarten (Dutch part)',
    code: 'SX',
    currency: 'ANG',
    dialCode: '1',
    dialAreaCodes: ['721'],
    dialFormat: '(###) ###-####',
  },
  { name: 'Slovakia', code: 'SK', currency: 'EUR', dialCode: '421' },
  { name: 'Slovenia', code: 'SI', currency: 'EUR', dialCode: '386' },
  { name: 'Solomon Islands', code: 'SB', currency: 'SBD', dialCode: '677' },
  { name: 'Somalia', code: 'SO', currency: 'SOS', dialCode: '252' },
  { name: 'South Africa', code: 'ZA', currency: 'ZAR', dialCode: '27' },
  {
    name: 'South Georgia and the South Sandwich Islands',
    code: 'GS',
    currency: 'GBP',
    dialCode: '500',
  },
  { name: 'South Sudan', code: 'SS', currency: 'SSP', dialCode: '211' },
  { name: 'Spain', code: 'ES', currency: 'EUR', dialCode: '34', dialFormat: '### ### ###' },
  { name: 'Sri Lanka', code: 'LK', currency: 'LKR', dialCode: '94' },
  { name: 'Sudan', code: 'SD', currency: 'SDG', dialCode: '249' },
  { name: 'Suriname', code: 'SR', currency: 'SRD', dialCode: '597' },
  {
    name: 'Svalbard and Jan Mayen',
    code: 'SJ',
    currency: 'NOK',
    dialCode: '47',
    dialAreaCodes: ['79', '40', '41', '45', '46', '47', '48', '59', '9'],
    dialFormat: '### ## ###',
  },
  { name: 'Swaziland', code: 'SZ', currency: 'SZL', dialCode: '268' },
  { name: 'Sweden', code: 'SE', currency: 'SEK', dialCode: '46', dialFormat: '(###) ###-###' },
  { name: 'Switzerland', code: 'CH', currency: 'CHF', dialCode: '41', dialFormat: '## ### ## ##' },
  { name: 'Syrian Arab Republic', code: 'SY', currency: 'SYP', dialCode: '963' },
  { name: 'Taiwan', code: 'TW', currency: 'TWD', dialCode: '886' },
  { name: 'Tajikistan', code: 'TJ', currency: 'TJS', dialCode: '992' },
  { name: 'Thailand', code: 'TH', currency: 'THB', dialCode: '66' },
  { name: 'Timor-Leste', code: 'TL', currency: 'USD', dialCode: '670' },
  { name: 'Togo', code: 'TG', currency: 'XOF', dialCode: '228' },
  { name: 'Tokelau', code: 'TK', currency: 'NZD', dialCode: '690' },
  { name: 'Tonga', code: 'TO', currency: 'TOP', dialCode: '676' },
  {
    name: 'Trinidad and Tobago',
    code: 'TT',
    currency: 'TTD',
    dialCode: '1',
    dialAreaCodes: ['868'],
    dialFormat: '(###) ###-####',
  },
  { name: 'Tunisia', code: 'TN', currency: 'TND', dialCode: '216' },
  { name: 'Turkey', code: 'TR', currency: 'TRY', dialCode: '90', dialFormat: '### ### ## ##' },
  { name: 'Turkmenistan', code: 'TM', currency: 'TMT', dialCode: '993' },
  {
    name: 'Turks and Caicos Islands',
    code: 'TC',
    currency: 'USD',
    dialCode: '1',
    dialAreaCodes: ['649'],
    dialFormat: '(###) ###-####',
  },
  { name: 'Tuvalu', code: 'TV', currency: 'AUD', dialCode: '688' },
  { name: 'Uganda', code: 'UG', currency: 'UGX', dialCode: '256' },
  { name: 'Ukraine', code: 'UA', currency: 'UAH', dialCode: '380', dialFormat: '(##) ### ## ##' },
  { name: 'United Arab Emirates', code: 'AE', currency: 'AED', dialCode: '971' },
  {
    name: 'United Kingdom',
    code: 'GB',
    currency: 'GBP',
    dialCode: '44',
    dialFormat: '#### ######',
    suggested: true,
  },
  { name: 'United Republic of Tanzania', code: 'TZ', currency: 'TZS', dialCode: '255' },
  {
    name: 'United States',
    code: 'US',
    currency: 'USD',
    dialCode: '1',
    dialFormat: '(###) ###-####',
    suggested: true,
  },
  { name: 'Uruguay', code: 'UY', currency: 'UYU', dialCode: '598' },
  {
    name: 'US Virgin Islands',
    code: 'VI',
    currency: 'USD',
    dialCode: '1',
    dialAreaCodes: ['340'],
    dialFormat: '(###) ###-####',
  },
  { name: 'Uzbekistan', code: 'UZ', currency: 'UZS', dialCode: '998' },
  { name: 'Vanuatu', code: 'VU', currency: 'VUV', dialCode: '678' },
  { name: 'Venezuela', code: 'VE', currency: 'VES', dialCode: '58' },
  { name: 'Vietnam', code: 'VN', currency: 'VND', dialCode: '84' },
  { name: 'Wallis and Futuna', code: 'WF', currency: 'XPF', dialCode: '681' },
  {
    name: 'Western Sahara',
    code: 'EH',
    currency: 'MAD',
    dialCode: '212',
    dialAreaCodes: ['5288', '5289', '6', '7'],
  },
  { name: 'Yemen', code: 'YE', currency: 'YER', dialCode: '967' },
  { name: 'Zambia', code: 'ZM', currency: 'ZMW', dialCode: '260' },
  { name: 'Zimbabwe', code: 'ZW', currency: 'USD', dialCode: '263' },
]

// separate countries into groups
export const groupedCountries: Array<{
  label: string
  options: Array<Country>
}> = [
  {
    label: 'Suggested',
    options: allCountries.filter((c) => c.suggested),
  },
  {
    label: 'All Countries',
    options: allCountries.filter((c) => !c.suggested),
  },
]

/**
 * Helper function to get Country from Code. Will return null
 * if not found.
 *
 * @param code  The Country Code to lookup
 * @returns     The Country if found, otherwise null
 */
export function getCountryFromCode(code: string): Country | null {
  const searchCode = code.toUpperCase()
  const selectedCountry = allCountries.filter((country) => country.code == searchCode)
  if (selectedCountry.length > 0) {
    return selectedCountry[0]
  }
  return null
}

/**
 * Model for Country Phone Lookups
 */

export type PhoneCountry = Country & {
  // Set automatically when getting DialCodeLookupArray
  dialCodeLength?: number
  // Set automatically when getting DialCodeLookupArray
  originalDialCodeLength?: number
}

/**
 * Gets a Map of all countries organised by dial code for quick lookup
 *
 * @returns   Array of Countries with generated dialCodes for lookup
 * @raises    Error if any duplicate dialCodes in allCountries Array
 */
export function getDialCodeLookupArray(): PhoneCountry[] {
  const dialCodeMap = new Map<string, PhoneCountry>()

  for (const country of allCountries) {
    if (country.dialAreaCodes) {
      // If the country has Area Codes add them as distinct dialcodes in Map
      for (const areaCode of country.dialAreaCodes) {
        const dialCode = `${country.dialCode}${areaCode}`
        if (!dialCodeMap.has(dialCode)) {
          const areaCodeCountry: PhoneCountry = { ...country }
          delete areaCodeCountry.dialAreaCodes
          areaCodeCountry.dialCode = dialCode
          areaCodeCountry.dialCodeLength = dialCode.length
          areaCodeCountry.originalDialCodeLength = country.dialCode.length
          dialCodeMap.set(dialCode, areaCodeCountry)
        } else {
          // Duplicate dialCode
          throw Error(`Duplicate dialCode ${dialCode} for country ${country.code}`)
        }
      }
    } else if (!dialCodeMap.has(country.dialCode)) {
      const areaCodeCountry: PhoneCountry = { ...country }
      delete areaCodeCountry.dialAreaCodes
      areaCodeCountry.dialCodeLength = country.dialCode.length
      areaCodeCountry.originalDialCodeLength = country.dialCode.length
      dialCodeMap.set(country.dialCode, areaCodeCountry)
    } else {
      // Duplicate dialCode
      throw Error(`Duplicate dialCode ${country.dialCode} for country ${country.code}`)
    }
  }

  // Return sorted Array
  return Array.from(new Map([...dialCodeMap.entries()].sort()).values())
}

/**
 * Infers the country from a full or partial E.164 phone number string.
 *
 * @param phone                 The full or partial E.164 phone number
 * @param dialCodeLookupArray   The Array returned from getDialCodeMap() function above
 * @returns                     The Country, or null if none found
 */
export function inferCountryFromPhone(
  phone: string,
  dialCodeLookupArray: PhoneCountry[],
): PhoneCountry | null {
  // Remove + at beginning of number
  const search = phone.replace('+', '')

  // Reduce array until we have a match
  const inferedCountry = dialCodeLookupArray.reduce(
    (inferedCountry, country) => {
      if (search.startsWith(country.dialCode)) {
        if (
          country.dialCodeLength &&
          inferedCountry.dialCodeLength &&
          country.dialCodeLength > inferedCountry.dialCodeLength
        ) {
          return country
        }
      }
      return inferedCountry
    },
    {
      name: '',
      code: '',
      currency: '',
      dialCode: '',
      dialCodeLength: -1,
    },
  )

  if (inferedCountry.dialCodeLength === -1) {
    return null
  }
  return inferedCountry
}
