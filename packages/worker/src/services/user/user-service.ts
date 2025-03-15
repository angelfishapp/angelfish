import { validate } from 'class-validator'

import type { AppCommandRequest, AppCommandResponse } from '@angelfish/core'
import { AppCommandIds, Command, Logger } from '@angelfish/core'
import { DatabaseManager } from '../../database/database-manager'
import { UserEntity } from '../../database/entities'

const logger = Logger.scope('UserService')

/**
 * Manage Users in database. Will also make request to update user details on Cloud if they
 * has an assiciated Cloud account.
 */
class UserServiceClass {
  /**
   *  Save a new user or update an existing user in the database
   *
   * @param request    The User to save in the database
   */
  @Command(AppCommandIds.SAVE_USER)
  public async updateBook(
    request: AppCommandRequest<AppCommandIds.SAVE_USER>,
  ): AppCommandResponse<AppCommandIds.SAVE_USER> {
    // Validate User
    const errors = await validate(UserEntity.getClassInstance(request), {
      forbidUnknownValues: true,
    })
    if (errors.length > 0) {
      const errorMsg = 'Cannot save UserEntity as it failed validation'
      logger.error(errorMsg, errors)
      throw Error(errorMsg)
    }

    const userRepo = DatabaseManager.getConnection().getRepository(UserEntity)
    const updatedUser = await userRepo.save(request)
    return updatedUser
  }
}

// Export instance of Class
export const UserService = new UserServiceClass()
