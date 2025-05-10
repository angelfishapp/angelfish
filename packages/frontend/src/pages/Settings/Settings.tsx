import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import { Link, Route, Routes, useLocation } from 'react-router-dom'

import { SideMenu } from '@/components/SideMenu'
import { SettingsRoutes } from '../../app/Routes'

/**
 * Main Component - Settings Page Container providing left hand menu and router to switch
 * between settings screens
 */

export default function Settings() {
  const location = useLocation()
  const currentPage = location.pathname.split('/')[2] ? location.pathname.split('/')[2] : '/'

  // Render
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
          padding: '24px 16px',
        }}
      >
        <SideMenu id="settings-menu" resizeable={false} collapsable={false} minWidth={250}>
          <List
            component="nav"
            sx={{
              '& .Mui-selected': {
                backgroundColor: (theme) => `${theme.palette.primary.main} !important`,
                color: (theme) => `${theme.palette.common.white} !important`,
                boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
              },
            }}
          >
            {SettingsRoutes.map(({ label, path }) => (
              <ListItemButton
                selected={(path ? path : '/') == currentPage}
                key={path ? path : '/'}
                sx={{ whiteSpace: 'nowrap' }}
                component={Link}
                to={path}
              >
                {label}
              </ListItemButton>
            ))}
          </List>
        </SideMenu>
      </Box>
      {/* Settings Page Container */}
      <Box
        display="flex"
        flexGrow={1}
        flexDirection="column"
        sx={{
          padding: '24px 16px',
          height: '100vh',
        }}
      >
        <Routes>
          {/* Need to slice (copy) then reverse as / path should be last or switching doesn't work */}
          {SettingsRoutes.slice()
            .reverse()
            .map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
        </Routes>
      </Box>
    </Box>
  )
}
