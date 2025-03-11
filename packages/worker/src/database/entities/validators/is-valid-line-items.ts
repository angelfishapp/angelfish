import type { ValidationArguments, ValidationOptions } from 'class-validator'
import { registerDecorator } from 'class-validator'

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

            // Line Items must sum to 0 and have at least one line item for full
            // transaction amount for bank account it belongs too
            let sum = 0
            let isValid = false
            for (const line_item of value) {
              sum += line_item.amount
              if (
                line_item.account_id == transaction.account_id &&
                line_item.amount == transaction.amount
              ) {
                // Found valid line_item for bank account
                isValid = true
              }
              if (line_item.transaction_id && line_item.transaction_id != transaction.id) {
                // Make sure all line items belong to transaction
                isValid = false
              }
            }
            // Round Sum to 2 decimal places
            sum = Math.round(sum * 100) / 100

            if (!isValid) {
              errorMsg = `${propertyName} does not include valid LineItemEntities; `
            }

            if (sum != 0) {
              errorMsg += `${propertyName} array must sum to 0. Sum=${sum}`
            }

            if (!isValid || sum != 0) {
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
