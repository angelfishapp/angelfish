import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import Paper from '@mui/material/Paper'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { SideMenu } from '.'
const meta = {
  title: 'Components/Side Menu',
  component: SideMenu,
  args: {
    id: 'test-menu',
    collapsable: true,
    resizeable: true,
    children: undefined,
  },
  render: ({ ...args }) => {
    const RenderComponent = () => {
      const [selectedMenu, setSelectedMenu] = React.useState<number>(0)

      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'stretch',
            alignContent: 'stretch',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            flexWrap: 'nowrap',
          }}
        >
          <Box
            sx={{
              order: 0,
              flex: '0 0 auto',
              alignSelf: 'auto',
            }}
          >
            <SideMenu {...args}>
              <List component="nav">
                <ListItemButton selected={selectedMenu === 1} onClick={() => setSelectedMenu(1)}>
                  Menu Item 1
                </ListItemButton>
                <ListItemButton selected={selectedMenu === 2} onClick={() => setSelectedMenu(2)}>
                  Menu Item 2
                </ListItemButton>
                <ListItemButton selected={selectedMenu === 3} onClick={() => setSelectedMenu(3)}>
                  Menu Item 3
                </ListItemButton>
                <ListItemButton selected={selectedMenu === 4} onClick={() => setSelectedMenu(4)}>
                  Menu Item 4
                </ListItemButton>
                <ListItemButton selected={selectedMenu === 5} onClick={() => setSelectedMenu(5)}>
                  Menu Item 5
                </ListItemButton>
                <ListItemButton selected={selectedMenu === 6} onClick={() => setSelectedMenu(6)}>
                  Menu Item 6
                </ListItemButton>
                <ListItemButton selected={selectedMenu === 7} onClick={() => setSelectedMenu(7)}>
                  Menu Item 7
                </ListItemButton>
                <ListItemButton selected={selectedMenu === 8} onClick={() => setSelectedMenu(8)}>
                  Menu Item 8
                </ListItemButton>
              </List>
            </SideMenu>
          </Box>
          <Box
            sx={{
              order: 1,
              flex: '1 1 auto',
              alignSelf: 'auto',
              padding: 2,
              paddingLeft: 0,
              marginLeft: 2,
            }}
          >
            <Paper>Main Content Here</Paper>
          </Box>
        </Box>
      )
    }
    return <RenderComponent />
  },
} satisfies Meta<typeof SideMenu>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
