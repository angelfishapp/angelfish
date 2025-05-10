import ClickAwayListener from '@mui/material/ClickAwayListener'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import clsx from 'clsx'
import React from 'react'

import { getPalletColor } from '@/utils/palette.utils'
import type { ContextMenuItem, ContextMenuProps } from './ContextMenu.interface'
import { StyledContextMenu } from './ContextMenu.styles'

/**
 * Render an individual MenuItem
 *
 * @param item      The MenuItem to render
 * @param index     The index of the MenuItem
 * @param hasIcons  If any of the MenuItems have icons to adjust layout
 * @param onClose   Callback function to close the menu
 * @returns     JSX li element
 */
const renderMenuItem = (
  item: ContextMenuItem,
  index: number,
  hasIcons: boolean,
  onClose: () => void,
) => {
  // Default disabled value is false
  const disabled = item.disabled ? item.disabled : false
  // Only add onClick if the item is not disabled and doesn't have a subMenu
  const onClick = !disabled && !item.subMenu && item.onClick ? item.onClick : undefined
  // Default submenu is open is false
  const subMenuOpen = item.subMenuIsOpen ? item.subMenuIsOpen : false

  // Don't render disabled items if not string label
  if (typeof item.item !== 'string' && disabled) {
    return null
  }

  // Render Menu Header Title
  if (typeof item.item === 'string' && item.onClick === undefined && item.subMenu === undefined) {
    return (
      <MenuItem key={index} sx={{ fontWeight: 700, opacity: '1 !important' }} disabled>
        {item.item}
      </MenuItem>
    )
  }

  // Render String Label Item
  if (typeof item.item === 'string') {
    return (
      <MenuItem
        key={index}
        className={clsx(subMenuOpen ? 'isOpen' : undefined, item.className)}
        disabled={disabled}
        disableRipple={true}
        divider={item.divider}
        selected={item.selected}
        onClick={
          onClick
            ? () => {
                onClick()
                onClose()
              }
            : undefined
        }
        onMouseOver={() => item.onHover?.(disabled)}
        sx={item.color ? { color: getPalletColor(item.color) } : undefined}
      >
        {item.icon ? (
          <React.Fragment>
            <ListItemIcon>
              <item.icon sx={item.color ? { fill: getPalletColor(item.color) } : undefined} />
            </ListItemIcon>
            <ListItemText>{item.item}</ListItemText>
          </React.Fragment>
        ) : (
          <ListItemText inset={hasIcons}>{item.item}</ListItemText>
        )}
        {item.subMenu && (
          <ul className={item.subMenuClassName}>{renderMenu(item.subMenu, onClose)}</ul>
        )}
      </MenuItem>
    )
  }
  // Render Component Item
  return (
    <li
      key={index}
      className={clsx(disabled ? 'disabled' : undefined, item.className)}
      onClick={
        onClick
          ? () => {
              onClick()
              onClose()
            }
          : undefined
      }
      onMouseOver={() => item.onHover?.(disabled)}
    >
      {item.item}
    </li>
  )
}

/**
 * Render the Context Menu
 *
 * @param menu      The Menu to render
 * @param onClose   Callback function to close the menu
 * @returns     Array of JSX elements for menu
 */
const renderMenu = (menu: ContextMenuItem[], onClose: () => void) => {
  const hasIcons = menu.some((item) => item.icon)
  return (
    <React.Fragment>
      {menu.map((menuItem, index) => renderMenuItem(menuItem, index, hasIcons, onClose))}
    </React.Fragment>
  )
}

/**
 * Provides ContextMenu component that is rendered when a user right clicks on a component
 */

export default function ContextMenu({
  items,
  anchorPosition,
  open,
  onClose,
  unMountOnExit = false,
  windowMarginX = 200,
  windowMarginY = 200,
}: ContextMenuProps) {
  // Component State
  const menuElement = React.useRef<HTMLUListElement>(null)
  // Should submenus flow up or down depending on position in window
  const [flowUp, setFlowUp] = React.useState<boolean>(false)
  // Show submenus flow right or left depending on position in window
  const [flowRight, setFlowRight] = React.useState<boolean>(false)

  // Position context menu based on anchorPosition
  // relative to the window
  React.useEffect(() => {
    if (!menuElement.current) {
      return
    }
    const menuWidth = menuElement.current.offsetWidth
    const menuHeight = menuElement.current.offsetHeight
    let top = anchorPosition.top
    let left = anchorPosition.left

    // Check if menu will go out of the right edge of window
    if (left + menuWidth + windowMarginX > window.innerWidth) {
      left = left - menuWidth
      setFlowRight(true)
    } else {
      setFlowRight(false)
    }

    // Check if menu will go out of the bottom edge of window
    if (top + menuHeight + windowMarginY > window.innerHeight) {
      top = top - menuHeight
      setFlowUp(true)
    } else {
      setFlowUp(false)
    }

    // Set main menu position
    menuElement.current.style.top = `${top}px`
    menuElement.current.style.left = `${left}px`
  }, [anchorPosition, windowMarginX, windowMarginY])

  // Unmount Context Menu if not open
  if (unMountOnExit && !open) {
    return null
  }

  // Render Context Menu
  return (
    <ClickAwayListener onClickAway={onClose}>
      <StyledContextMenu
        className={clsx(flowUp ? 'flowUp' : undefined, flowRight ? 'flowRight' : undefined)}
        style={{
          opacity: open ? 1 : 0,
          visibility: open ? 'visible' : 'hidden',
        }}
        tabIndex={-1}
        role="menu"
        ref={menuElement}
      >
        {renderMenu(items, onClose)}
      </StyledContextMenu>
    </ClickAwayListener>
  )
}
