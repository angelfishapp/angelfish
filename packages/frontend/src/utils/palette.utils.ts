import theme from '@/app/theme'
import type { CategorySpendReportDataRow } from '@angelfish/core'

// Default color palette
export const palette = [
  '#9A7EAA',
  '#F8D092',
  '#FFBED2',
  '#F16872',
  '#FF9454',
  '#47CCAF',
  '#1B5678',
  '#228b22',
  '#DC143C',
  '#9400D3',
  '#FFD700',
  '#800080',
  '#4169E1',
  '#FF69B4',
  '#F4A460',
]

/**
 * Returns a HEX color for a specific expense category group. If the Category Group
 * has a color set already will use that, otherwise will generate a random unique color.
 *
 * @param row   The rows to get a color for
 * @returns     A map of HEX colors for the rows
 */

export function getDataSetColors(rows: CategorySpendReportDataRow[]) {
  const colors: Record<string, string> = {}
  let palletteIndex = 0

  const sortedRows = [...rows].sort((a, b) => {
    // Sort by row amount descending
    return b.total - a.total
  })

  sortedRows.forEach((row) => {
    if (row.color) {
      colors[row.name] = row.color
    } else if (row.id === null) {
      // Unclassified expenses will always be grey
      colors[row.name] = '#C4C4C4'
    } else {
      // If no color, use the next color in the pallette
      colors[row.name] = palette[palletteIndex++]
      // Reset pallette index if we've reached the end
      if (palletteIndex >= palette.length) {
        palletteIndex = 0
      }
    }
  })

  return colors
}

/**
 * Default Theme Colors
 */
export type PalletColors = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'

/**
 * Get the HEX color from either a theme pallet color, or provided HEX color
 * if the color is not a pallet color
 *
 * @param color     Any PalletColor or HEX color as string
 * @returns         The HEX color as string
 */
export function getPalletColor(color: PalletColors | string): string {
  switch (color) {
    case 'primary':
      return theme.palette.primary.main
    case 'secondary':
      return theme.palette.secondary.main
    case 'error':
      return theme.palette.error.main
    case 'warning':
      return theme.palette.warning.main
    case 'info':
      return theme.palette.info.main
    case 'success':
      return theme.palette.success.main
    default:
      return color
  }
}
