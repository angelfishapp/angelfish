import { Box } from '@mui/material'

import AvatarMenu from './components/AvatarMenu'
import PrimaryMenuItems from './components/PrimaryMenuItems'
import type { PrimaryMenuProps } from './PrimaryMenu.interface'

/**
 * Main Primary Menu bar on left hand side
 */
export default function PrimaryMenu({ authenticatedUser, onLogout }: PrimaryMenuProps) {
  // Render
  return (
    <Box
      display="flex"
      flexDirection="row"
      sx={{
        width: (theme) => theme.custom.side.width,
        maxWidth: (theme) => theme.custom.side.width,
        flexShrink: 0,
        alignItems: 'center',
        backgroundColor: 'primary.main',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        zIndex: (theme) => theme.zIndex.appBar,
        position: 'fixed',
        top: 0,
      }}
    >
      <Box
        sx={{
          marginTop: 1,
          marginBottom: 4,
          width: (theme) => theme.custom.side.width - 32,
          height: (theme) => theme.custom.side.width - 32,
          backgroundImage: 'url(/assets/svg/logo_color.svg)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <PrimaryMenuItems />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="flex-end"
        flexGrow={1}
        marginBottom={2}
      >
        <AvatarMenu authenticatedUser={authenticatedUser} onLogout={onLogout} />
      </Box>
    </Box>
  )
}
