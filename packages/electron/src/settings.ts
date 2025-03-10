import ElectronStore from 'electron-store'

import type { IUserSettings } from '@angelfish/core'
import { CommandsRegistryMain } from './commands/commands-registry-main'

/**
 * Uses electron-store to save local user settings for app to persist settings between
 * sessions: https://github.com/sindresorhus/electron-store
 */

/**
 * Define any constants for app settings here
 */

export const MIN_WINDOW_WIDTH = 1368
export const MIN_WINDOW_HEIGHT = 768

/**
 * Specify JSON Schema to validate config data using https://github.com/ajv-validator/ajv
 */

const schema: ElectronStore.Schema<IUserSettings> = {
  windowSize: {
    type: 'object',
    default: {
      width: MIN_WINDOW_WIDTH,
      height: MIN_WINDOW_HEIGHT,
    },
    properties: {
      width: {
        type: 'number',
        minimum: MIN_WINDOW_WIDTH,
      },
      height: {
        type: 'number',
        minimum: MIN_WINDOW_HEIGHT,
      },
    },
  },
  authenticatedUser: {
    type: ['object', 'null'],
    default: null,
    properties: {
      id: {
        type: 'string',
      },
      created_on: {
        type: 'string',
        format: 'date-time',
      },
      modified_on: {
        type: 'string',
        format: 'date-time',
      },
      first_name: {
        type: 'string',
      },
      last_name: {
        type: 'string',
      },
      email: {
        type: 'string',
        format: 'email',
      },
      avatar: {
        type: ['string', 'null'],
      },
      phone: {
        type: ['string', 'null'],
      },
    },
  },
  currentFilePath: {
    type: ['string', 'null'],
    default: null,
  },
  userSettings: {
    type: 'object',
    default: {
      enableBackgroundAnimations: true,
      logLevel: 'info',
    },
    properties: {
      enableBackgroundAnimations: {
        type: 'boolean',
      },
      logLevel: {
        type: 'string',
        enum: ['error', 'warn', 'info', 'verbose', 'debug', 'silly'],
      },
    },
  },
}

/**
 * Custom Electron-Store wrapper to handle Date serialization/deserialization
 */
class CustomStore extends ElectronStore<IUserSettings> {
  constructor() {
    super({
      schema,
    })
  }

  /**
   * Saves the AuthenticatedUser to the store
   */
  setAuthenticatedUser(value: IUserSettings['authenticatedUser']): void {
    if (value) {
      // Convert any date properties to ISO strings
      for (const prop in value) {
        const key: keyof IUserSettings['authenticatedUser'] =
          prop as keyof IUserSettings['authenticatedUser']
        if ((value[key] as any) instanceof Date) {
          ;(value[key] as string) = (value[key] as Date).toISOString()
        }
      }
    }
    this.set('authenticatedUser', value)
  }

  /**
   * Gets the AuthenticatedUser from store
   */
  getAuthenticatedUser(): IUserSettings['authenticatedUser'] {
    const value = this.get('authenticatedUser')
    if (value) {
      // Convert any date strings to Date objects
      for (const prop in value) {
        const key: keyof IUserSettings['authenticatedUser'] =
          prop as keyof IUserSettings['authenticatedUser']
        if (typeof value[key] === 'string' && (value[key] as string).match(/^\d{4}-\d{2}-\d{2}T/)) {
          ;(value[key] as Date) = new Date(value[key] as string)
        }
      }
    }
    return value
  }
}

/**
 * Export the wrapped Electron-Store instance
 */
export const settings = new CustomStore()
// Add an event emitter whenever userSettings change
settings.onDidChange('userSettings', (changes) => {
  if (changes) {
    CommandsRegistryMain.emitEvent('user.settings.updated', changes)
  }
})
