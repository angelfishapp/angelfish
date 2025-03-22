import DeleteIcon from '@mui/icons-material/Delete'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import type { DropdownMenuItem } from '.'
import { DropdownMenuButton } from '.'

const meta = {
  title: 'Components/Dropdown Menu Button',
  component: DropdownMenuButton,
  args: {},
  render: ({ ...args }) => <DropdownMenuButton {...args} />,
} satisfies Meta<typeof DropdownMenuButton>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

const menuItems: DropdownMenuItem[] = [
  {
    label: 'Sub Menu Header 1',
  },
  {
    label: 'Menu Item 1',
    onClick: () => action('Menu Item 1 clicked')(),
  },
  {
    label: 'Menu Item 2',
    onClick: () => action('Menu Item 2 clicked')(),
    divider: true,
  },
  {
    label: 'Sub Menu Header 2',
  },
  {
    label: 'Disabled Menu Item 3',
    onClick: () => action('Disabled Menu Item 3 clicked')(),
    disabled: true,
  },
  {
    label: 'Selected Menu Item 4',
    onClick: () => action('Selected Menu Item 4 clicked')(),
    selected: true,
  },
  {
    label: 'Menu Item 5',
    icon: DeleteIcon,
    onClick: () => action('Menu Item 5 clicked')(),
    color: 'error',
  },
]

export const Default: Story = {
  args: {
    label: 'Menu',
    menuItems,
  },
}

export const NoIcons: Story = {
  args: {
    label: 'Menu',
    menuItems: menuItems.map((item) => ({ ...item, icon: undefined })),
  },
}

export const TextButton: Story = {
  args: {
    label: 'Select',
    variant: 'text',
    disableRipple: true,
    menuItems,
  },
}

export const ContainedButton = {
  args: {
    label: 'Select',
    variant: 'contained',
    disableRipple: true,
    menuItems,
  },
}

export const OutlinedButton = {
  args: {
    label: 'Select',
    variant: 'outlined',
    disableRipple: true,
    menuItems,
  },
}
