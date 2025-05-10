import type { ValidationArguments, ValidationOptions } from 'class-validator'
import { registerDecorator } from 'class-validator'

import { validateLineItems } from '@angelfish/core'
import type { LineItemEntity, TransactionEntity } from '..'

/**
 * Custom Validation Decorator to check if array of LineItems are valid for a
 * Transaction
 */
export function IsLineItemsValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    let errorMsg = ''

    registerDecorator({
      name: 'isLineItemTotalValid',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: LineItemEntity[], args: ValidationArguments) {
          errorMsg = ''

          if (value) {
            const transaction = args.object as TransactionEntity

            const isValid = validateLineItems(value, transaction.amount)
            if (!isValid.valid) {
              errorMsg = `${propertyName} ${isValid.message}`
              return false
            }

            return true
          }
          return false
        },
        defaultMessage(_args: ValidationArguments) {
          return errorMsg
        },
      },
    })
  }
}
