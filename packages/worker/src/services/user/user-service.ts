import { validate } from 'class-validator'

import type { AppCommandRequest, AppCommandResponse } from '@angelfish/core'
import { AppCommandIds, Command, CommandsClient, Logger } from '@angelfish/core'
import { DatabaseManager } from '../../database/database-manager'
import { UserEntity } from '../../database/entities'

const logger = Logger.scope('UserService')

/**
 * Manage Users in database. Will also make request to update user details on Cloud if they
 * has an assiciated Cloud account.
 */
class UserServiceClass {
  /**
   *  List of all users in the database
   *
   * @returns        A list of all users in the database
   */
  @Command(AppCommandIds.LIST_USERS)
  public async listUsers(
    _request: AppCommandRequest<AppCommandIds.LIST_USERS>,
  ): AppCommandResponse<AppCommandIds.LIST_USERS> {
    const userRepo = DatabaseManager.getConnection().getRepository(UserEntity)
    return await userRepo.find({ order: { created_on: 'ASC' } })
  }

  /**
   *  Get a single user from the database by Id or cloud_id
   *
   * @param request   User id or cloud_id to search for in the database
   * @returns         The User found in the database or null if not found
   */
  @Command(AppCommandIds.GET_USER)
  public async getUser(
    request: AppCommandRequest<AppCommandIds.GET_USER>,
  ): AppCommandResponse<AppCommandIds.GET_USER> {
    const userRepo = DatabaseManager.getConnection().getRepository(UserEntity)
    // Ensure exactly one of `id` or `cloud_id` is provided
    if (!!request.id === !!request.cloud_id) {
      throw new Error("Either 'id' or 'cloud_id' must be provided, but not both.")
    }

    // Search by whichever parameter is provided
    return await userRepo.findOne({
      where: request.id ? { id: request.id } : { cloud_id: request.cloud_id },
    })
  }

  /**
   *  Save a new user or update an existing user in the database
   *
   * @param request     The User to save in the database
   * @returns           The updated or new User saved in the database
   */
  @Command(AppCommandIds.SAVE_USER)
  public async saveUser(
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

  /**
   *  Detele a single user from the database by Id
   *
   * @param id    The User Id of the user to delete in the database
   */
  @Command(AppCommandIds.DELETE_USER)
  public async deleteUser(
    request: AppCommandRequest<AppCommandIds.DELETE_USER>,
  ): AppCommandResponse<AppCommandIds.DELETE_USER> {
    // Get User from database and check it exists
    const dBuser = await this.getUser({ id: request.id })
    if (!dBuser) {
      throw Error(`User with ID ${request.id} does not exist`)
    }

    // Check current user isn't trying to delete themselves
    const authenticatedUser = await CommandsClient.executeAppCommand(
      AppCommandIds.GET_AUTHETICATED_USER,
    )
    if (authenticatedUser && authenticatedUser?.id === dBuser.cloud_id) {
      throw Error('Cannot delete Authenticated User')
    }

    // Delete user from database
    const userRepo = DatabaseManager.getConnection().getRepository(UserEntity)
    await userRepo.delete(request.id)
  }
}

// Export instance of Class
export const UserService = new UserServiceClass()
