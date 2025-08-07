// menu/index.
import { Menu } from 'electron'
import { Environment } from '../utils/environment'
import { AppMenu } from './app-menu'
import { DeveloperMenu } from './developer-menu'
import { EditMenu } from './edit-menu'
import { FileMenu } from './file-menu'
import { HelpMenu } from './help-menu'
import { LanguageMenu } from './language-menu'
import { ViewMenu } from './view-menu'
import { WindowMenu } from './window-menu'

export const buildMenu = () => {
  const menuItems = [FileMenu(), EditMenu(), ViewMenu(), WindowMenu(), HelpMenu(), LanguageMenu()]

  if (Environment.isMacOS) {
    menuItems.unshift(AppMenu())
  }

  if (Environment.nodeEnvironment === Environment.DEVELOPMENT) {
    menuItems.push(DeveloperMenu())
  }

  const menu = Menu.buildFromTemplate(menuItems)
  Menu.setApplicationMenu(menu)
}
