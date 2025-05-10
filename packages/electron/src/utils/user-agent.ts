import { app, screen } from 'electron'
import os from 'os'

import { settings } from '../settings'
import { Environment } from './environment'

/**
 * Helper function to get system information about the current machine. Will generate a
 * unique device ID if it doesn't exist in the settings.
 *
 * @returns {object} - An object containing system information
 */
export function getSystemInfo() {
  const os_platform = Environment.platform
  const arch = os.arch()
  const locale = app.getSystemLocale()
  const app_version = app.getVersion()
  let os_release = os.release()

  // Get the screen size
  const { width, height } = screen.getPrimaryDisplay().size

  if (!settings.get('deviceId')) {
    // Generate a unique device ID if it doesn't exist
    const deviceId = crypto.randomUUID()
    settings.set('deviceId', deviceId)
  }

  // Get MacOS specific information
  if (Environment.isMacOS) {
    const darwinRelease = Number(os_release.split('.')[0])
    const nameMap = new Map([
      [24, ['Sequoia', '15']],
      [23, ['Sonoma', '14']],
      [22, ['Ventura', '13']],
      [21, ['Monterey', '12']],
      [20, ['Big Sur', '11']],
      [19, ['Catalina', '10.15']],
      [18, ['Mojave', '10.14']],
      [17, ['High Sierra', '10.13']],
      [16, ['Sierra', '10.12']],
      [15, ['El Capitan', '10.11']],
      [14, ['Yosemite', '10.10']],
      [13, ['Mavericks', '10.9']],
      [12, ['Mountain Lion', '10.8']],
      [11, ['Lion', '10.7']],
      [10, ['Snow Leopard', '10.6']],
      [9, ['Leopard', '10.5']],
      [8, ['Tiger', '10.4']],
      [7, ['Panther', '10.3']],
      [6, ['Jaguar', '10.2']],
      [5, ['Puma', '10.1']],
    ])
    const [name, version] = nameMap.get(darwinRelease) || ['Unknown', `${darwinRelease}`]
    os_release = `${name} (${version})`
  }

  return {
    deviceId: settings.get('deviceId') as string,
    os_platform,
    os_release,
    arch,
    display: {
      width,
      height,
    },
    locale,
    app_version,
  }
}

/**
 * Helper function to get the User-Agent header string for the current machine to identify the
 * application and its version. Uses getSystemInfo to get the system information and generate a
 * unique device ID if it doesn't exist in the settings.
 *
 * @returns {string} - The user agent string
 */
export function getUserAgent(): string {
  const { deviceId, os_platform, os_release, arch, display, locale, app_version } = getSystemInfo()

  // Construct the user agent string
  return `Angelfish/${app_version} (${os_platform}; ${os_release}; ${arch}; ${display.width}x${display.height}; ${locale}; ${deviceId})`
}
