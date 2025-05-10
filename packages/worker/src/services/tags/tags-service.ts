import { validate } from 'class-validator'

import type { AppCommandRequest, AppCommandResponse } from '@angelfish/core'
import { AppCommandIds, Command } from '@angelfish/core'
import { DatabaseManager } from '../../database/database-manager'
import { TagEntity } from '../../database/entities'
import { getWorkerLogger } from '../../logger'

const logger = getWorkerLogger('TagService')

/**
 * Manage Transaction Tags
 */
class TagServiceClass {
  /**
   * List all Tags in Database
   */
  @Command(AppCommandIds.LIST_TAGS)
  public async listTags(
    _r: AppCommandRequest<AppCommandIds.LIST_TAGS>,
  ): AppCommandResponse<AppCommandIds.LIST_TAGS> {
    const tagRepo = DatabaseManager.getConnection().getRepository(TagEntity)
    return await tagRepo.find({ order: { name: 'ASC' } })
  }

  /**
   * Get a Tag by ID. Will return null if not found
   *
   * @param id    The primary key for the Tag
   */
  @Command(AppCommandIds.GET_TAG)
  public async getTag({
    id,
  }: AppCommandRequest<AppCommandIds.GET_TAG>): AppCommandResponse<AppCommandIds.GET_TAG> {
    const tagRepo = DatabaseManager.getConnection().getRepository(TagEntity)
    return await tagRepo.findOne({ where: { id } })
  }

  /**
   * Save or update a Tag in the database
   *
   * @param tag     The Tag to save
   */
  @Command(AppCommandIds.SAVE_TAG)
  public async saveTag(
    request: AppCommandRequest<AppCommandIds.SAVE_TAG>,
  ): AppCommandResponse<AppCommandIds.SAVE_TAG> {
    const errors = await validate(TagEntity.getClassInstance(request), {
      forbidUnknownValues: true,
    })
    if (errors.length > 0) {
      const errorMsg = 'Cannot save TagEntity as it failed validation'
      logger.error(errorMsg, errors)
      throw Error(errorMsg)
    }

    const tagRepo = DatabaseManager.getConnection().getRepository(TagEntity)
    return await tagRepo.save(request)
  }

  /**
   * Delete a Tag from the database.
   * TODO - Ensure it deletes any LineItem links too
   *
   * @param id    The primary key for the Tag to delete
   */
  @Command(AppCommandIds.DELETE_TAG)
  public async deleteTag({
    id,
  }: AppCommandRequest<AppCommandIds.DELETE_TAG>): AppCommandResponse<AppCommandIds.DELETE_TAG> {
    const tagRepo = DatabaseManager.getConnection().getRepository(TagEntity)
    await tagRepo.delete(id)
  }
}

// Export instance of Class
export const TagService = new TagServiceClass()
