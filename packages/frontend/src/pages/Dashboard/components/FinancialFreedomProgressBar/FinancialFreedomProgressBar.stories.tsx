import Box from '@mui/material/Box'
import type { Meta, StoryObj } from '@storybook/react'

import { getDataSetColors } from '@/utils/palette.utils'
import { reportsData } from '@angelfish/tests/fixtures'
import { FinancialFreedomProgressBar } from '.'

/**
 * Story Metadata
 */

const meta = {
  title: 'Dashboard/Financial Freedom Progress Bar',
  component: FinancialFreedomProgressBar,
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
        <FinancialFreedomProgressBar data={reportsData} {...args} />
      </Box>
    )
  },
} satisfies Meta<typeof FinancialFreedomProgressBar>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Storys
 */

export const Default: Story = {
  args: {
    currency: 'USD',
  },
}
