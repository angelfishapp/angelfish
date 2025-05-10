/**
 * Public Actions that can be used by UI to interact with Store
 */

import { createAction } from '@reduxjs/toolkit'

import type { IInstitutionUpdate } from '@angelfish/core'

// Save Institution Action
export type SaveInstitutionPayload = {
  institution: IInstitutionUpdate
}
export const saveInstitution = createAction<SaveInstitutionPayload>('institutions/saveInstitution')

// Delete Institution Action
export type DeleteInstitutionPayload = {
  id: number
}
export const deleteInstitution = createAction<DeleteInstitutionPayload>(
  'institutions/deleteInstitution',
)
