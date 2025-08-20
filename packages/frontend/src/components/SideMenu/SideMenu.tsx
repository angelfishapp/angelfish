import CollapseIcon from '@mui/icons-material/ArrowBackIosNew'
import ExpandIcon from '@mui/icons-material/ArrowForwardIos'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import React from 'react'

import { useI18n } from '@/utils/i18n'
import type { SideMenuProps } from './SideMenu.interface'
import { COLLAPSED_WIDTH, MAX_WIDTH, MIN_WIDTH, SideBarWrapper } from './SideMenu.styles'

/**
 * Provides a left handed side menu which is resizable and collapsable for Page menus. Ensures all
 * page menus are consistently functional and styled.
 */

export default function SideMenu({
  children,
  collapsable = true,
  id,
  minWidth = MIN_WIDTH,
  sticky = false,
  resizeable = true,
  onResize,
}: SideMenuProps) {
  const { dir } = useI18n()
  /**
   * Handle Collapsing
   */

  // Collapsable State
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  /**
   * Handle Resizing
   */

  // Resizing State
  const last_width = localStorage.getItem(`${id}-menu-width`)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState<number>(last_width ? parseInt(last_width) : minWidth)

  /**
   * Resize handler
   */
  const resize = React.useCallback(() => {
    const onMouseMove = (mouseMoveEvent: MouseEvent) => {
      const newWidth = menuRef.current
        ? mouseMoveEvent.clientX - menuRef.current.getBoundingClientRect().left
        : 0
      if (resizeable && newWidth >= minWidth && newWidth <= MAX_WIDTH) {
        setWidth(newWidth)
        localStorage.setItem(`${id}-menu-width`, `${newWidth}`)
      }
    }

    const onMouseUp = () => {
      // Remove listeners and re-enable text selection
      document.body.style.userSelect = '' // Reset text selection
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    // Attach listeners
    document.body.style.userSelect = 'none' // Disable text selection
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [id, minWidth, resizeable])

  /**
   * Allow parent to update settings dynamically
   * and pass the new width to the parent callback
   */
  React.useEffect(() => {
    if (!resizeable) {
      // Reset width
      setWidth(minWidth)
    }
    onResize?.(width)
  }, [resizeable, width, minWidth, onResize])

  // Render
  return (
    <SideBarWrapper
      dir={dir}
      ref={menuRef}
      style={{
        width,
        marginLeft:
          dir === 'ltr' ? (isCollapsed ? (width - COLLAPSED_WIDTH) * -1 : undefined) : undefined,
        marginRight:
          dir === 'rtl' ? (isCollapsed ? (width - COLLAPSED_WIDTH) * -1 : undefined) : undefined,
        position: sticky ? 'sticky' : undefined,
        top: sticky ? 16 : undefined,
      }}
    >
      <Paper
        sx={{
          width,
          overflowX: 'hidden',
          padding: '0 !important',
          left: (theme) => theme.spacing(2),
          minHeight: 100,
        }}
      >
        <div style={{ opacity: isCollapsed ? 0 : 1, transition: 'opacity 500ms linear' }}>
          {children}
        </div>
      </Paper>
      {(resizeable || collapsable) && (
        <div
          className="resizeBar"
          draggable={false}
          onMouseDown={resizeable && !isCollapsed ? resize : undefined}
          onDoubleClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            cursor: resizeable ? 'col-resize' : 'inherit',
          }}
        >
          <div></div>
          <IconButton
            className="collapseButton"
            sx={(theme) => ({
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white,
              visibility: 'hidden',
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
              },
            })}
            size="small"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ExpandIcon /> : <CollapseIcon />}
          </IconButton>
          <div></div>
        </div>
      )}
    </SideBarWrapper>
  )
}
