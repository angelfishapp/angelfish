import AccountsIcon from '@mui/icons-material/AccountBalance'
import ReportsIcon from '@mui/icons-material/BarChart'
import DashboardIcon from '@mui/icons-material/Dashboard'

import { Accounts } from '@/pages/Accounts'
import Dashboard from '@/pages/Dashboard/Dashboard'
import Reports from '@/pages/Reports/Reports'
import Settings from '@/pages/Settings/Settings'

import BookSettings from '@/pages/Settings/Book/BookSettings'
import Categories from '@/pages/Settings/Categories/CategorySettings'
import UserSettings from '@/pages/Settings/User/UserSettings'

/**
 * All top level page routes should go here. If pages contain subroutes for their
 * own screens (i.e. settings) then the page itself should have its own routes
 */

/**
 * List of routes to display in left side Primary Menu
 */
export const ListedAppRoutes = [
  {
    label: 'dashboard',
    path: '/',
    Icon: DashboardIcon,
    Component: Dashboard,
  },
  {
    label: 'accounts',
    path: '/accounts',
    Icon: AccountsIcon,
    Component: Accounts,
  },
  {
    label: 'reports',
    path: '/reports',
    Icon: ReportsIcon,
    Component: Reports,
  },
]

/**
 * List of Routes for the /settings page
 */

export const SettingsRoutes = [
  {
    label: 'user-settings',
    path: '',
    Component: UserSettings,
  },
  {
    label: 'household-settings',
    path: 'book-settings',
    Component: BookSettings,
  },
  {
    label: 'categories',
    path: 'categories',
    Component: Categories,
  },
]

/**
 * Other routes not listed in Primary Menu
 */
export const UnlistedAppRoutes = [
  {
    path: '/settings/*',
    Component: Settings,
    children: SettingsRoutes,
  },
]

/**
 * All app routes for the app
 */
export const AppRoutes = [...ListedAppRoutes, ...UnlistedAppRoutes]
