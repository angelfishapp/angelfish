import type { Meta, StoryObj } from '@storybook/react'

import { Background } from '.'

const meta = {
  title: 'App/Background',
  component: Background,
  args: {},
  argTypes: {
    view: {
      control: {
        type: 'radio',
      },
      options: ['sky', 'land', 'underwater'],
    },
    phase: {
      control: {
        type: 'radio',
      },
      options: ['morning', 'day', 'evening', 'night'],
    },
  },
  render: ({ ...args }) => <Background {...args} />,
} satisfies Meta<typeof Background>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const LandDay: Story = {
  args: {
    view: 'land',
    phase: 'day',
  },
}

export const SubmergedEvening: Story = {
  args: {
    view: 'underwater',
    phase: 'evening',
  },
}
