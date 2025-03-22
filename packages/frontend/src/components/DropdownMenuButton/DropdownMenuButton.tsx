import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoreHoriz from '@mui/icons-material/MoreHoriz'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'

import { getPalletColor } from '@/utils/palette.utils'
import type { DropdownMenuButtonProps } from './DropdownMenuButton.interfaces'

/**
 * Component that allows the user to choose one value from a predefined list.
 */
export default function DropdownMenuButton({
  menuItems,
  label,
  Icon,
  fullWidth,
  menuWidth,
  position,
  open = false,
  onClick,
  variant = 'icon',
  ...buttonProps
}: DropdownMenuButtonProps) {
  // Component State
  const [anchor, setAnchorEl] = React.useState<null | Element>(null)

  const hasIcons = menuItems.some((item) => item.icon)

  // Render
  return (
    <React.Fragment>
      {variant === 'icon' ? (
        <IconButton
          {...buttonProps}
          title={label}
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            setAnchorEl(e.currentTarget)
            onClick?.(e)
          }}
        >
          {Icon ? <Icon /> : <MoreHoriz />}
        </IconButton>
      ) : (
        <Button
          {...buttonProps}
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            setAnchorEl(e.currentTarget)
            onClick?.(e)
          }}
          fullWidth={fullWidth}
          endIcon={Icon ? <Icon /> : <ExpandMoreIcon fontSize="large" />}
          variant={variant}
        >
          {label}
        </Button>
      )}

      <Menu
        anchorEl={anchor}
        open={open || !!anchor}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={position}
        slotProps={{ paper: { style: { width: menuWidth } } }}
      >
        {menuItems.map((item, index) => {
          if (item.onClick !== undefined) {
            return (
              <MenuItem
                key={index}
                className={item.className}
                disabled={item.disabled}
                divider={item.divider}
                selected={item.selected}
                onClick={() => {
                  setAnchorEl(null)
                  item.onClick?.()
                }}
                sx={item.color ? { color: getPalletColor(item.color) } : undefined}
              >
                {item.icon ? (
                  <React.Fragment>
                    <ListItemIcon>
                      <item.icon
                        sx={item.color ? { fill: getPalletColor(item.color) } : undefined}
                      />
                    </ListItemIcon>
                    <ListItemText>{item.label}</ListItemText>
                  </React.Fragment>
                ) : (
                  <ListItemText inset={hasIcons}>{item.label}</ListItemText>
                )}
              </MenuItem>
            )
          }
          // Return submenu header
          return (
            <MenuItem key={index} sx={{ fontWeight: 700, opacity: '1 !important' }} disabled>
              {item.label}
            </MenuItem>
          )
        })}
      </Menu>
    </React.Fragment>
  )
}
