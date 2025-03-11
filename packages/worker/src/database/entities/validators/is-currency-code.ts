import type { ValidationArguments, ValidationOptions } from 'class-validator'
import { registerDecorator } from 'class-validator'

import { getCurrencyFromCode } from '@angelfish/core'

/**
 * Custom Validation Decorator to check if a currency field is using a valid
 * ISO 4217 currency code
 */
export function IsCurrencyCode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCurrencyCode',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string, _args: ValidationArguments) {
          const currency = getCurrencyFromCode(value)
          return currency ? true : false
        },

        defaultMessage(args: ValidationArguments) {
          return `${propertyName} Currency Code '${args.value}' is an invalid ISO 4217 currency code`
        },
      },
    })
  }
}
