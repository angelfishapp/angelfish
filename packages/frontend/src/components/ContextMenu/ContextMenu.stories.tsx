import DeleteIcon from '@mui/icons-material/Delete'
import Paper from '@mui/material/Paper'
import type { PopoverPosition } from '@mui/material/Popover'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { ContextMenu } from '.'

/**
 * Story Book Meta
 */

const meta = {
  title: 'Components/Context Menu',
  component: ContextMenu,
  args: {
    open: true,
    anchorPosition: { top: 0, left: 0 },
    onClose: () => {},
  },
  render: ({ items }) => {
    const RenderComponent = () => {
      const [contextMenuPos, setContextMenuPos] = React.useState<PopoverPosition | null>(null)
      return (
        <Paper sx={{ height: '100vh' }}>
          <span
            onContextMenu={(event) => {
              event.preventDefault()
              setContextMenuPos({
                top: event.clientY,
                left: event.clientX,
              })
            }}
            style={{ width: '100%', height: '100%', display: 'block', cursor: 'context-menu' }}
          >
            Right Click On Me
          </span>
          <ContextMenu
            open={contextMenuPos !== null}
            anchorPosition={contextMenuPos ?? { top: 0, left: 0 }}
            onClose={() => setContextMenuPos(null)}
            items={items}
          />
        </Paper>
      )
    }
    return <RenderComponent />
  },
} satisfies Meta<typeof ContextMenu>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */
export const Default: Story = {
  args: {
    items: [
      {
        item: 'My Context Menu',
      },
      {
        item: 'Option 1-1',
        onClick: () => action('Option 1-1 Clicked')(),
      },
      {
        item: 'Option 1-2',
        divider: true,
        subMenu: [
          {
            item: 'Sub-Option 1-2-1',
            onClick: () => action('Sub-Option 1-2-1 Clicked')(),
            subMenu: [
              {
                item: 'SubMenu-3-Title',
              },
              {
                item: 'Sub-Sub-Option Group 1-2',
                onClick: () => action('Sub-Sub-Option 1-2-1-2 Clicked')(),
                divider: true,
              },
              {
                item: 'Sub-Sub-Option Group 2-1 (Disabled)',
                onClick: () => action('Sub-Sub-Option 1-2-2-1 (Disabled) Clicked')(),
                disabled: true,
              },
              {
                item: 'Sub-Sub-Option Group 2-2 (Selected)',
                onClick: () => action('Sub-Sub-Option 1-2-2-2 (Selected) Clicked')(),
                selected: true,
              },
              {
                item: 'Sub-Sub-Option Group 2-3',
                onClick: () => action('Sub-Sub-Option 1-2-2-3 Clicked')(),
                color: 'success',
                subMenuIsOpen: true,
                subMenu: [
                  {
                    item: <input type="text" placeholder="Should Be Shown" />,
                    className: 'input',
                  },
                  {
                    item: <input type="text" placeholder="Should Be Hidden" />,
                    disabled: true,
                  },
                ],
              },
            ],
          },
          {
            item: 'Sub-Option 1-2-2',
            onClick: () => action('Sub-Option 1-2-2 Clicked')(),
          },
        ],
      },
      {
        item: 'Option 1-3',
        onClick: () => action('Option 1-3 Clicked')(),
        icon: DeleteIcon,
        color: 'error',
      },
    ],
  },
}
