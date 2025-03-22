import Box from '@mui/material/Box'
import type { Meta, StoryObj } from '@storybook/react'

import { getDataSetColors } from '@/utils/palette.utils'
import { reportsData } from '@angelfish/tests/fixtures'
import { IncomeAndExpensesSankey } from '.'

/**
 * Story Metadata
 */

const meta = {
  title: 'Dashboard/Income & Expenses Sankey',
  component: IncomeAndExpensesSankey,
  args: {
    data: reportsData,
  },
  render: ({ data, ...args }) => {
    const colors = getDataSetColors(data.rows)
    for (const row of data.rows) {
      if (!row.color) {
        row.color = colors[row.name]
      }
    }
    return (
      <Box py={2} px={8}>
        <IncomeAndExpensesSankey data={data} {...args} />
      </Box>
    )
  },
} satisfies Meta<typeof IncomeAndExpensesSankey>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Storys
 */

export const Default: Story = {
  args: {
    currency: 'USD',
    periods: 12,
  },
}
