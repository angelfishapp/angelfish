import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { reportsData } from '@angelfish/tests/fixtures'
import { ReportsTable } from '.'

const meta = {
  title: 'Reports/Reports Table',
  component: ReportsTable,
  args: {
    data: reportsData,
    onClick: (period, name, id, isCategoryGroup) =>
      action('onClick action')(period, name, id, isCategoryGroup),
  },
  render: ({ ...args }) => (
    <Paper>
      <ReportsTable {...args} />
    </Paper>
  ),
} satisfies Meta<typeof ReportsTable>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Default: Story = {
  args: {},
}
