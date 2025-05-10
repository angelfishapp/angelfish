/* eslint-disable */
// This file is auto-generated. DO NOT EDIT.
'use strict'
module.exports = validate10
module.exports.default = validate10
const schema11 = {
  type: 'object',
  properties: {
    date: { type: 'string', pattern: '^(LATEST|\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$' },
    currency: {
      type: 'string',
      enum: [
        'AED',
        'AFN',
        'ALL',
        'AMD',
        'ANG',
        'AOA',
        'ARS',
        'AUD',
        'AWG',
        'AZN',
        'BAM',
        'BBD',
        'BDT',
        'BGN',
        'BHD',
        'BIF',
        'BMD',
        'BND',
        'BOB',
        'BRL',
        'BSD',
        'BTN',
        'BWP',
        'BYN',
        'BZD',
        'CAD',
        'CDF',
        'CHF',
        'CLP',
        'CNY',
        'COP',
        'CRC',
        'CUP',
        'CVE',
        'CZK',
        'DJF',
        'DKK',
        'DOP',
        'DZD',
        'EGP',
        'ERN',
        'ETB',
        'EUR',
        'FJD',
        'FKP',
        'GBP',
        'GEL',
        'GHS',
        'GIP',
        'GMD',
        'GNF',
        'GTQ',
        'GYD',
        'HKD',
        'HNL',
        'HRK',
        'HTG',
        'HUF',
        'IDR',
        'ILS',
        'INR',
        'IQD',
        'IRR',
        'ISK',
        'JMD',
        'JOD',
        'JPY',
        'KES',
        'KGS',
        'KHR',
        'KMF',
        'KPW',
        'KRW',
        'KWD',
        'KYD',
        'KZT',
        'LAK',
        'LBP',
        'LKR',
        'LRD',
        'LSL',
        'LYD',
        'MAD',
        'MDL',
        'MGA',
        'MKD',
        'MMK',
        'MNT',
        'MOP',
        'MRU',
        'MUR',
        'MVR',
        'MWK',
        'MXN',
        'MYR',
        'MZN',
        'NAD',
        'NGN',
        'NIO',
        'NOK',
        'NPR',
        'NZD',
        'OMR',
        'PEN',
        'PGK',
        'PHP',
        'PKR',
        'PLN',
        'PYG',
        'QAR',
        'RON',
        'RSD',
        'RUB',
        'RWF',
        'SAR',
        'SBD',
        'SCR',
        'SDG',
        'SEK',
        'SGD',
        'SLL',
        'SOS',
        'SRD',
        'SSP',
        'STD',
        'SYP',
        'SZL',
        'THB',
        'TJS',
        'TMT',
        'TND',
        'TOP',
        'TRY',
        'TTD',
        'TWD',
        'TZS',
        'UAH',
        'UGX',
        'USD',
        'UYU',
        'UZS',
        'VES',
        'VND',
        'VUV',
        'WST',
        'XAF',
        'XCD',
        'XOF',
        'XPF',
        'YER',
        'ZAR',
        'ZMW',
      ],
    },
    rate: { type: 'number', minimum: 0 },
  },
  required: ['date', 'currency', 'rate'],
  additionalProperties: false,
}
const pattern0 = new RegExp('^(LATEST|\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$', 'u')

function validate10(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null
  let errors = 0
  if (errors === 0) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      let missing0
      if (
        (data.date === undefined && (missing0 = 'date')) ||
        (data.currency === undefined && (missing0 = 'currency')) ||
        (data.rate === undefined && (missing0 = 'rate'))
      ) {
        validate10.errors = [
          {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: missing0 },
            message: "must have required property '" + missing0 + "'",
          },
        ]
        return false
      } else {
        const _errs1 = errors
        for (const key0 in data) {
          if (!(key0 === 'date' || key0 === 'currency' || key0 === 'rate')) {
            validate10.errors = [
              {
                instancePath,
                schemaPath: '#/additionalProperties',
                keyword: 'additionalProperties',
                params: { additionalProperty: key0 },
                message: 'must NOT have additional properties',
              },
            ]
            return false
            break
          }
        }
        if (_errs1 === errors) {
          if (data.date !== undefined) {
            let data0 = data.date
            const _errs2 = errors
            if (errors === _errs2) {
              if (typeof data0 === 'string') {
                if (!pattern0.test(data0)) {
                  validate10.errors = [
                    {
                      instancePath: instancePath + '/date',
                      schemaPath: '#/properties/date/pattern',
                      keyword: 'pattern',
                      params: {
                        pattern: '^(LATEST|\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$',
                      },
                      message:
                        'must match pattern "' +
                        '^(LATEST|\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$' +
                        '"',
                    },
                  ]
                  return false
                }
              } else {
                validate10.errors = [
                  {
                    instancePath: instancePath + '/date',
                    schemaPath: '#/properties/date/type',
                    keyword: 'type',
                    params: { type: 'string' },
                    message: 'must be string',
                  },
                ]
                return false
              }
            }
            var valid0 = _errs2 === errors
          } else {
            var valid0 = true
          }
          if (valid0) {
            if (data.currency !== undefined) {
              let data1 = data.currency
              const _errs4 = errors
              if (typeof data1 !== 'string') {
                validate10.errors = [
                  {
                    instancePath: instancePath + '/currency',
                    schemaPath: '#/properties/currency/type',
                    keyword: 'type',
                    params: { type: 'string' },
                    message: 'must be string',
                  },
                ]
                return false
              }
              if (
                !(
                  data1 === 'AED' ||
                  data1 === 'AFN' ||
                  data1 === 'ALL' ||
                  data1 === 'AMD' ||
                  data1 === 'ANG' ||
                  data1 === 'AOA' ||
                  data1 === 'ARS' ||
                  data1 === 'AUD' ||
                  data1 === 'AWG' ||
                  data1 === 'AZN' ||
                  data1 === 'BAM' ||
                  data1 === 'BBD' ||
                  data1 === 'BDT' ||
                  data1 === 'BGN' ||
                  data1 === 'BHD' ||
                  data1 === 'BIF' ||
                  data1 === 'BMD' ||
                  data1 === 'BND' ||
                  data1 === 'BOB' ||
                  data1 === 'BRL' ||
                  data1 === 'BSD' ||
                  data1 === 'BTN' ||
                  data1 === 'BWP' ||
                  data1 === 'BYN' ||
                  data1 === 'BZD' ||
                  data1 === 'CAD' ||
                  data1 === 'CDF' ||
                  data1 === 'CHF' ||
                  data1 === 'CLP' ||
                  data1 === 'CNY' ||
                  data1 === 'COP' ||
                  data1 === 'CRC' ||
                  data1 === 'CUP' ||
                  data1 === 'CVE' ||
                  data1 === 'CZK' ||
                  data1 === 'DJF' ||
                  data1 === 'DKK' ||
                  data1 === 'DOP' ||
                  data1 === 'DZD' ||
                  data1 === 'EGP' ||
                  data1 === 'ERN' ||
                  data1 === 'ETB' ||
                  data1 === 'EUR' ||
                  data1 === 'FJD' ||
                  data1 === 'FKP' ||
                  data1 === 'GBP' ||
                  data1 === 'GEL' ||
                  data1 === 'GHS' ||
                  data1 === 'GIP' ||
                  data1 === 'GMD' ||
                  data1 === 'GNF' ||
                  data1 === 'GTQ' ||
                  data1 === 'GYD' ||
                  data1 === 'HKD' ||
                  data1 === 'HNL' ||
                  data1 === 'HRK' ||
                  data1 === 'HTG' ||
                  data1 === 'HUF' ||
                  data1 === 'IDR' ||
                  data1 === 'ILS' ||
                  data1 === 'INR' ||
                  data1 === 'IQD' ||
                  data1 === 'IRR' ||
                  data1 === 'ISK' ||
                  data1 === 'JMD' ||
                  data1 === 'JOD' ||
                  data1 === 'JPY' ||
                  data1 === 'KES' ||
                  data1 === 'KGS' ||
                  data1 === 'KHR' ||
                  data1 === 'KMF' ||
                  data1 === 'KPW' ||
                  data1 === 'KRW' ||
                  data1 === 'KWD' ||
                  data1 === 'KYD' ||
                  data1 === 'KZT' ||
                  data1 === 'LAK' ||
                  data1 === 'LBP' ||
                  data1 === 'LKR' ||
                  data1 === 'LRD' ||
                  data1 === 'LSL' ||
                  data1 === 'LYD' ||
                  data1 === 'MAD' ||
                  data1 === 'MDL' ||
                  data1 === 'MGA' ||
                  data1 === 'MKD' ||
                  data1 === 'MMK' ||
                  data1 === 'MNT' ||
                  data1 === 'MOP' ||
                  data1 === 'MRU' ||
                  data1 === 'MUR' ||
                  data1 === 'MVR' ||
                  data1 === 'MWK' ||
                  data1 === 'MXN' ||
                  data1 === 'MYR' ||
                  data1 === 'MZN' ||
                  data1 === 'NAD' ||
                  data1 === 'NGN' ||
                  data1 === 'NIO' ||
                  data1 === 'NOK' ||
                  data1 === 'NPR' ||
                  data1 === 'NZD' ||
                  data1 === 'OMR' ||
                  data1 === 'PEN' ||
                  data1 === 'PGK' ||
                  data1 === 'PHP' ||
                  data1 === 'PKR' ||
                  data1 === 'PLN' ||
                  data1 === 'PYG' ||
                  data1 === 'QAR' ||
                  data1 === 'RON' ||
                  data1 === 'RSD' ||
                  data1 === 'RUB' ||
                  data1 === 'RWF' ||
                  data1 === 'SAR' ||
                  data1 === 'SBD' ||
                  data1 === 'SCR' ||
                  data1 === 'SDG' ||
                  data1 === 'SEK' ||
                  data1 === 'SGD' ||
                  data1 === 'SLL' ||
                  data1 === 'SOS' ||
                  data1 === 'SRD' ||
                  data1 === 'SSP' ||
                  data1 === 'STD' ||
                  data1 === 'SYP' ||
                  data1 === 'SZL' ||
                  data1 === 'THB' ||
                  data1 === 'TJS' ||
                  data1 === 'TMT' ||
                  data1 === 'TND' ||
                  data1 === 'TOP' ||
                  data1 === 'TRY' ||
                  data1 === 'TTD' ||
                  data1 === 'TWD' ||
                  data1 === 'TZS' ||
                  data1 === 'UAH' ||
                  data1 === 'UGX' ||
                  data1 === 'USD' ||
                  data1 === 'UYU' ||
                  data1 === 'UZS' ||
                  data1 === 'VES' ||
                  data1 === 'VND' ||
                  data1 === 'VUV' ||
                  data1 === 'WST' ||
                  data1 === 'XAF' ||
                  data1 === 'XCD' ||
                  data1 === 'XOF' ||
                  data1 === 'XPF' ||
                  data1 === 'YER' ||
                  data1 === 'ZAR' ||
                  data1 === 'ZMW'
                )
              ) {
                validate10.errors = [
                  {
                    instancePath: instancePath + '/currency',
                    schemaPath: '#/properties/currency/enum',
                    keyword: 'enum',
                    params: { allowedValues: schema11.properties.currency.enum },
                    message: 'must be equal to one of the allowed values',
                  },
                ]
                return false
              }
              var valid0 = _errs4 === errors
            } else {
              var valid0 = true
            }
            if (valid0) {
              if (data.rate !== undefined) {
                let data2 = data.rate
                const _errs6 = errors
                if (errors === _errs6) {
                  if (typeof data2 == 'number' && isFinite(data2)) {
                    if (data2 < 0 || isNaN(data2)) {
                      validate10.errors = [
                        {
                          instancePath: instancePath + '/rate',
                          schemaPath: '#/properties/rate/minimum',
                          keyword: 'minimum',
                          params: { comparison: '>=', limit: 0 },
                          message: 'must be >= 0',
                        },
                      ]
                      return false
                    }
                  } else {
                    validate10.errors = [
                      {
                        instancePath: instancePath + '/rate',
                        schemaPath: '#/properties/rate/type',
                        keyword: 'type',
                        params: { type: 'number' },
                        message: 'must be number',
                      },
                    ]
                    return false
                  }
                }
                var valid0 = _errs6 === errors
              } else {
                var valid0 = true
              }
            }
          }
        }
      }
    } else {
      validate10.errors = [
        {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        },
      ]
      return false
    }
  }
  validate10.errors = vErrors
  return errors === 0
}
