import { app, screen } from 'electron'
import systemInfo from 'systeminformation'

import { settings } from '../settings'
import { Environment } from './environment'

/**
 * Helper function to get system information about the current machine. Will generate a
 * unique device ID if it doesn't exist in the settings.
 *
 * @returns {object} - An object containing system information
 */
export async function getSystemInfo() {
  const osInfo = await systemInfo.osInfo()
  const os_platform = Environment.platform
  const arch = osInfo.arch
  const locale = app.getSystemLocale()
  const app_version = app.getVersion()
  const os_release =
    os_platform === 'macos'
      ? osInfo.codename
      : os_platform === 'linux'
        ? `${osInfo.distro} (${osInfo.codename})`
        : osInfo.release

  // Get the screen size
  const { width, height } = screen.getPrimaryDisplay().size

  if (!settings.get('deviceId')) {
    // Generate a unique device ID if it doesn't exist
    const deviceId = crypto.randomUUID()
    settings.set('deviceId', deviceId)
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
export async function getUserAgent(): Promise<string> {
  const { deviceId, os_platform, os_release, arch, display, locale, app_version } =
    await getSystemInfo()

  // Construct the user agent string
  return `Angelfish/${app_version} (${os_platform}; ${os_release}; ${arch}; ${display.width}x${display.height}; ${locale}; ${deviceId})`
}
