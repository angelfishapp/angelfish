/**
 * Electron Forge Configuration:
 *
 * https://www.electronforge.io/configuration
 */

import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerDMG } from '@electron-forge/maker-dmg'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives'
import { FusesPlugin } from '@electron-forge/plugin-fuses'
import { WebpackPlugin } from '@electron-forge/plugin-webpack'
import type { ForgeConfig } from '@electron-forge/shared-types'
import { FuseV1Options, FuseVersion } from '@electron/fuses'
import dotenv from 'dotenv'
import path from 'path'

import { mainConfig } from './webpack/webpack.main.config'
import { rendererConfig } from './webpack/webpack.renderer.config'

// Load environment variables from root .env file if it exists
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

/**
 * Main configuration for Electron Forge
 */
const config: ForgeConfig = {
  buildIdentifier: 'angelfish',
  hooks: {
    readPackageJson: async (forgeConfig, packageJson) => {
      // Set the package.json name to the executable name as deb maker
      // uses this to determine the name of the previously built executable as its
      // input src, which isn't @angelfish/electron
      packageJson.name = forgeConfig.packagerConfig.executableName
      return packageJson
    },
  },
  packagerConfig: {
    asar: true,
    darwinDarkModeSupport: true,
    appCategoryType: 'public.app-category.finance',
    icon: './resources/icons/icon',
    name: 'Angelfish',
    executableName: 'angelfish',
    osxSign: {
      identity: process.env['OSX_SIGN_IDENTITY'] as string,
      keychain: 'build.keychain',
      optionsForFile: () => ({
        entitlements: './resources/build/macos/entitlements.plist',
        hardenedRuntime: true,
      }),
    },
    osxNotarize: {
      appleId: process.env['APPLE_ID'] as string,
      appleIdPassword: process.env['APPLE_ID_PASSWORD'] as string,
      teamId: process.env['APPLE_TEAM_ID'] as string,
    },
  },
  rebuildConfig: {},
  makers: [
    new MakerDMG({
      background: './resources/build/macos/background.png',
      format: 'ULFO',
      icon: './resources/icons/icon.icns',
      iconSize: 150,
      contents: (options) => {
        return [
          {
            x: 500,
            y: 249,
            type: 'link',
            path: '/Applications',
          },
          {
            x: 170,
            y: 249,
            type: 'file',
            path: path.resolve(process.cwd(), options.appPath),
          },
        ]
      },
    }),
    new MakerSquirrel({
      name: 'Angelfish',
      iconUrl: 'https://angelfish.app/assets/icon.ico',
      setupIcon: './resources/icons/icon.ico',
      certificateFile: process.env['WINDOWS_PFX_FILE'],
      certificatePassword: process.env['WINDOWS_PFX_PASSWORD'],
    }),
    new MakerDeb({
      options: {
        name: 'angelfish',
        productName: 'Angelfish',
        categories: ['Office'],
        maintainer: 'Angelfish Software LLC',
        homepage: 'https://angelfish.app',
        icon: path.resolve(process.cwd(), 'resources/icons/png/1024.png'),
      },
    }),
    new MakerZIP({}, ['darwin']),
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'angelfishapp',
          name: 'angelfish',
        },
        prerelease: true,
      },
    },
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      devServer: {
        liveReload: false,
        hot: true,
        client: {
          overlay: {
            runtimeErrors: (error) => {
              // Filter out this specific error as benign: https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
              if (
                error.message === 'ResizeObserver loop limit exceeded' ||
                error.message === 'ResizeObserver loop completed with undelivered notifications.'
              ) {
                return false
              }
              return true
            },
          },
        },
      },
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            name: 'app_window',
            html: './src/windows/renderer/index.html',
            js: '../frontend/src/index.tsx',
          },
          {
            name: 'client_preload',
            preload: {
              js: './src/preload/preload.ts',
            },
          },
          {
            name: 'worker_window',
            nodeIntegration: true,
            html: './src/windows/process/index.html',
            js: '../worker/src/index.ts',
          },
          {
            name: 'sync_worker',
            html: './src/windows/process/index.html',
            js: '../sync/src/index.ts',
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
}

export default config
