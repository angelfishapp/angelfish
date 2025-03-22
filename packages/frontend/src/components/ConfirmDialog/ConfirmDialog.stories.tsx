import { DialogContentText } from '@mui/material'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { ConfirmDialog } from '.'

/**
 * Story Book Meta
 */

const meta = {
  title: 'Components/Confirm Dialog',
  component: ConfirmDialog,
  args: {},
  render: ({ ...args }) => <ConfirmDialog {...args} />,
} satisfies Meta<typeof ConfirmDialog>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */
export const Default: Story = {
  args: {
    title: 'Delete Category',
    children: (
      <DialogContentText>
        Are you sure you want to delete the category <em>Honey Boo Boo</em> from Angelfish?
      </DialogContentText>
    ),
    confirmText: 'Remove Category',
    onConfirm: () => action('onConfirm')(),
    onClose: () => action('onClose')(),
    open: true,
  },
}
