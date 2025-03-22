import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import React from 'react'

import { CloseButton } from '@/components/CloseButton'
import { DropdownMenuButton } from '@/components/DropdownMenuButton'
import type { DrawerProps } from './Drawer.interface'
import { StyledDrawer } from './Drawer.styles'

/**
 * Displays Right or Bottom Side Drawer that Slides out on Open.
 */
export default function Drawer({
  hideBackdrop = false,
  children,
  disableBackdropClose = false,
  disableSaveButton = false,
  menuItems,
  onClose,
  onSave,
  open = true,
  position = 'right',
  title,
}: DrawerProps) {
  return (
    <StyledDrawer
      open={open}
      anchor={position === 'right' ? 'right' : 'bottom'}
      onClose={disableBackdropClose ? undefined : (_, reason) => onClose?.(reason)}
      hideBackdrop={hideBackdrop}
    >
      <Box>
        <Box display="flex" alignItems="center" marginBottom={2} height={50}>
          <Box flexGrow={1} title={title} width="100px">
            <Typography className="drawerTitle" noWrap>
              {title}
            </Typography>
          </Box>
          <Box marginRight={1} display="flex" alignItems="center">
            {menuItems && (
              <DropdownMenuButton
                menuItems={menuItems}
                label="Actions"
                color="primary"
                size="large"
              />
            )}
            <CloseButton
              small={false}
              onClick={() => onClose?.('closeButtonClick')}
              className="drawerCloseButton"
            />
          </Box>
        </Box>

        {position === 'right' ? (
          <React.Fragment>
            <Box className="drawerContent" height={`calc(100vh - ${onSave ? 170 : 90}px)`}>
              {children}
            </Box>
            {onSave && (
              <Box className="drawerFooter">
                <Button
                  onClick={() => {
                    onSave?.()
                    onClose?.('saveButtonClick')
                  }}
                  disabled={disableSaveButton}
                  fullWidth
                >
                  Save
                </Button>
              </Box>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>{children}</React.Fragment>
        )}
      </Box>
    </StyledDrawer>
  )
}
