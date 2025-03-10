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
import path from 'path'

import { mainConfig } from './webpack/webpack.main.config'
import { rendererConfig } from './webpack/webpack.renderer.config'

const config: ForgeConfig = {
  buildIdentifier: 'angelfish',
  packagerConfig: {
    asar: true,
    darwinDarkModeSupport: true,
    icon: './resources/icons/icon',
    name: 'Angelfish',
    osxSign: {
      identity: 'Developer ID Application: David Gildeh (R9LJ95VR58)',
      optionsForFile: (_filePath) => ({
        entitlements: './resources/build/macos/entitlements.plist',
        hardenedRuntime: true,
      }),
    },
    osxNotarize: {
      appleId: process.env['APPLE_ID'] as string,
      appleIdPassword: process.env['APPLE_ID_PASSWORD'] as string,
      teamId: process.env['APPLE_TEAM_ID'] as string,
    },
    executableName: 'angelfish',
  },
  rebuildConfig: {},
  makers: [
    new MakerDMG({
      background: './resources/build/macos/background.png',
      format: 'ULFO',
      icon: './resources/icons/icon.icns',
      iconSize: 150,
      contents: [
        {
          x: 500,
          y: 249,
          type: 'link',
          path: '/Applications',
          name: 'Applications',
        },
        {
          x: 170,
          y: 249,
          type: 'file',
          path: path.resolve(process.cwd(), 'out/angelfish/Angelfish-darwin-x64/Angelfish.app'),
          name: 'Angelfish',
        },
        {
          x: 170,
          y: 600,
          type: 'position',
          path: '.background',
          name: 'Background',
        },
        {
          x: 500,
          y: 600,
          type: 'position',
          path: '.VolumeIcon.icns',
          name: 'Volume Icon',
        },
      ],
      additionalDMGOptions: {
        'background-color': '#2FAFC8',
        window: {
          size: {
            width: 658,
            height: 498,
          },
        },
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
        productName: 'Angelfish',
        categories: ['Office'],
        maintainer: 'Angelfish Software LLC',
        homepage: 'https://angelfish.app',
        icon: path.resolve(process.cwd(), 'resources/icons/png/1024.png'),
      },
    }),
    new MakerZIP({}, ['darwin']),
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
