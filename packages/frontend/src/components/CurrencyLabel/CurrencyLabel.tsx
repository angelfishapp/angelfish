import type { CurrencyLabelProps } from './CurrencyLabel.interface'

/**
 * CurrencyLabel Component: Renders a formated currency amount with integer and decimal
 * different sizes. Use decimalFontSize and integerFontSize to override the font sizes
 * and `currencyLabel-integer`, `currencyLabel-decimal` CSS classes to override any other
 * styling of the respective parts of the amount.
 */

export default function CurrencyLabel({
  className,
  currency = 'USD',
  displayDecimals = true,
  fontSize,
  onClick,
  showPositive = false,
  value = 0,
}: CurrencyLabelProps) {
  const localAmount = value.toLocaleString('en-US', {
    style: 'currency',
    currency,
  })
  const [integerAmount, decimalAmount] = localAmount.split('.')

  return (
    <span className={className} onClick={onClick} style={fontSize ? { fontSize } : undefined}>
      <span className="currencyLabel-integer">
        {value > 0 && showPositive ? '+' : undefined}
        {integerAmount}
      </span>
      {displayDecimals && (
        <span className="currencyLabel-decimal" style={{ fontSize: `0.8em` }}>
          .{decimalAmount}
        </span>
      )}
    </span>
  )
}
