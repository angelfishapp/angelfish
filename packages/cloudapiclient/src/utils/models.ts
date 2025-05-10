/**
 * Helper methods to convert between Cloud and Local Types
 */

import moment from 'moment'

import type { IAuthenticatedUser } from '@angelfish/core'
import type { UserProfile } from '../index'

/**
 * Converts a UserProfile to an IAuthenticatedUser
 *
 * @param userProfile   The UserProfile to convert
 * @returns             The IAuthenticatedUser
 */
export function convertCloudUserProfile(userProfile: UserProfile): IAuthenticatedUser {
  return {
    id: userProfile.id,
    created_on: moment(userProfile.created_on).toDate(),
    modified_on: moment(userProfile.modified_on).toDate(),
    email: userProfile.email,
    first_name: userProfile.first_name as string,
    last_name: userProfile.last_name as string,
    avatar: userProfile.avatar,
    phone: userProfile.phone_number,
  }
}
