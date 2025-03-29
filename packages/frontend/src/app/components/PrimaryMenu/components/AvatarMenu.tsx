import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import SettingsIcon from '@mui/icons-material/Settings'
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

import { Avatar } from '@/components/Avatar'
import type { IAuthenticatedUser } from '@angelfish/core'

/**
 * Component Properties
 */

type AvatarMenuProps = {
  /**
   * Current User logged into app
   */
  authenticatedUser?: IAuthenticatedUser
  /**
   * Callback to handle logging out user
   */
  onLogout: () => void
}

/**
 * Main Component - Shows current user's Avatar and Settings Menu at bottom
 * of PrimaryMenu
 */

export default function AvatarMenu({ authenticatedUser, onLogout }: AvatarMenuProps) {
  // Component State
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  // Render
  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        size="large"
        sx={{ width: 64, height: 64 }}
      >
        <Avatar
          avatar={authenticatedUser?.avatar}
          firstName={authenticatedUser?.first_name}
          lastName={authenticatedUser?.last_name}
        />
      </IconButton>

      <Menu
        disablePortal
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        role={undefined}
        sx={{ marginLeft: (theme) => `${theme.custom.side.width - 17}px` }}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem component={Link} to="/settings/" onClick={() => setAnchorEl(null)}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>
        <MenuItem onClick={onLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </>
  )
}
