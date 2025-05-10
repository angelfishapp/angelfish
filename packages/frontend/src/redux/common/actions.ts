/**
 * Common Reducers/Actions used by all Store Datatypes
 */

import { createAction } from '@reduxjs/toolkit'

/*
 * ACTION: Initialise Store from Database
 */
export const initStore = createAction<Record<string, unknown>>('redux/initStore')

/*
 * ACTION: Start listening for IPC Events from Main Process
 * Should only be called once after App startup to avoid multiple
 * IPC Channel listeners updating store concurrently
 */

export const startIPCChannels = createAction<Record<string, unknown>>('redux/startIPCChannels')
