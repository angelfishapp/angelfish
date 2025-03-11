import type { ValidationArguments, ValidationOptions } from 'class-validator'
import { registerDecorator } from 'class-validator'

import { getCountryFromCode } from '@angelfish/core'

/**
 * Custom Validation Decorator to check if a country field is using a valid
 * ISO 3166-1 alpha-2 country code
 */
export function IsCountry(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCountry',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string, _args: ValidationArguments) {
          const country = getCountryFromCode(value)
          return country ? true : false
        },

        defaultMessage(args: ValidationArguments) {
          return `${propertyName} Country Code '${args.value}' is an invalid ISO 3166-1 alpha-2 country code`
        },
      },
    })
  }
}
