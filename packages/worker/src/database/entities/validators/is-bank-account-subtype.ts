import type { ValidationArguments, ValidationOptions } from 'class-validator'
import { registerDecorator } from 'class-validator'

import { validateAccountSubType } from '@angelfish/core'
import type { AccountEntity } from '..'

/**
 * Custom Validation Decorator to check if an Account of type 'ACCOUNT' has a valid
 * Bank Account SubType. Will lookup the value of Account.acc_type during check
 */
export function IsBankAccountSubType(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBankAccountSubType',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const acc_type = (args.object as AccountEntity).acc_type as string
          return validateAccountSubType(acc_type, value)
        },

        defaultMessage(args: ValidationArguments) {
          const acc_type = (args.object as AccountEntity).acc_type
          return `${propertyName} Account Subtype '${args.value}' is invalid for Account Type '${acc_type}'`
        },
      },
    })
  }
}
