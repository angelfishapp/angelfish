import { Menu } from 'electron'

import { Environment } from '../utils/environment'
import { AppMenu } from './app-menu'
import { DeveloperMenu } from './developer-menu'
import { EditMenu } from './edit-menu'
import { FileMenu } from './file-menu'
import { HelpMenu } from './help-menu'
import { ViewMenu } from './view-menu'
import { WindowMenu } from './window-menu'

const menuItems = [FileMenu, EditMenu, ViewMenu, WindowMenu, HelpMenu]

// Add MacOS Specific Menu Items
if (Environment.isMacOS) {
  menuItems.unshift(AppMenu)
}

// Add Development Menu Items
if (Environment.nodeEnvironment === Environment.DEVELOPMENT) {
  menuItems.push(DeveloperMenu)
}

export const menu = Menu.buildFromTemplate(menuItems)
