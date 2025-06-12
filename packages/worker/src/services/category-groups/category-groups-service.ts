import { validate } from 'class-validator'

import type { AppCommandRequest, AppCommandResponse, ICategoryGroup } from '@angelfish/core'
import { AppCommandIds, Command, CommandsClient } from '@angelfish/core'
import { DatabaseManager } from '../../database/database-manager'
import { CategoryGroupEntity } from '../../database/entities'
import { getWorkerLogger } from '../../logger'

const logger = getWorkerLogger('CategoryGroupService')

/**
 * Manage Category Groups in the Database
 */
class CategoryGroupsServiceClass {
  /**
   * Get all Category Groups in Database
   */
  @Command(AppCommandIds.LIST_CATEGORY_GROUPS)
  public async listCategoryGroups(
    _request: AppCommandRequest<AppCommandIds.LIST_CATEGORY_GROUPS>,
  ): AppCommandResponse<AppCommandIds.LIST_CATEGORY_GROUPS> {
    const categoriesGroupRepo = DatabaseManager.getConnection().getRepository(CategoryGroupEntity)
    return await categoriesGroupRepo
      .createQueryBuilder('categoryGroup')
      .loadRelationCountAndMap('categoryGroup.total_categories', 'categoryGroup.categories')
      .orderBy('name', 'ASC')
      .getMany()
  }

  /**
   * Get an CategoryGroup by ID. Will return null if not found
   *
   * @param id    The primary key for the CategoryGroup
   */
  @Command(AppCommandIds.GET_CATEGORY_GROUP)
  public async getCategoryGroup({
    id,
  }: AppCommandRequest<AppCommandIds.GET_CATEGORY_GROUP>): AppCommandResponse<AppCommandIds.GET_CATEGORY_GROUP> {
    const categoriesGroupRepo = DatabaseManager.getConnection().getRepository(CategoryGroupEntity)
    return await categoriesGroupRepo
      .createQueryBuilder('categoryGroup')
      .leftJoinAndSelect('categoryGroup.categories', 'categories')
      .loadRelationCountAndMap('categoryGroup.total_categories', 'categoryGroup.categories')
      .where({ id })
      .getOne()
  }

  /**
   * Save or update a CategoryGroup in the database
   *
   * @param categoryGroup     The CategoryGroup to save
   */
  @Command(AppCommandIds.SAVE_CATEGORY_GROUP)
  public async saveCategoryGroup(
    request: AppCommandRequest<AppCommandIds.SAVE_CATEGORY_GROUP>,
  ): AppCommandResponse<AppCommandIds.SAVE_CATEGORY_GROUP> {
    const errors = await validate(CategoryGroupEntity.getClassInstance(request), {
      forbidUnknownValues: true,
    })
    if (errors.length > 0) {
      const errorMsg = 'Cannot save CategoryGroupEntity as it failed validation'
      logger.error(errorMsg, errors)
      throw Error(errorMsg)
    }

    const categoriesGroupRepo = DatabaseManager.getConnection().getRepository(CategoryGroupEntity)
    const savedCategoryGroup = await categoriesGroupRepo.save(request)
    logger.debug(`Saved new Category Group with ID ${savedCategoryGroup.id}`)
    return (await this.getCategoryGroup({ id: savedCategoryGroup.id })) as ICategoryGroup
  }

  /**
   * Delete a CategoryGroup from the database
   *
   * @param id    The primary key for the CategoryGroup to delete
   */
  @Command(AppCommandIds.DELETE_CATEGORY_GROUP)
  public async deleteCategoryGroup({
    id,
    reassignId,
  }: AppCommandRequest<AppCommandIds.DELETE_CATEGORY_GROUP>): AppCommandResponse<AppCommandIds.DELETE_CATEGORY_GROUP> {
    // Check if the CategoryGroup has any Categories
    const categories = await CommandsClient.executeAppCommand(AppCommandIds.LIST_ACCOUNTS, {
      category_group_id: id,
    })
    if (categories.length > 0 && !reassignId) {
      throw Error(
        `CategoryGroup with ID ${id} has associated categories. Please reassign or delete them first.`,
      )
    }

    // If there are categories, reassign them to another CategoryGroup
    if (reassignId) {
      // Check if the reassignId is valid
      const reassignGroup = await this.getCategoryGroup({ id: reassignId })
      if (!reassignGroup) {
        throw Error(`CategoryGroup with ID ${reassignId} does not exist`)
      }
      // Reassign categories to the new CategoryGroup
      logger.debug(
        `Reassigning ${categories.length} categories from CategoryGroup ID ${id} to CategoryGroup ID ${reassignId}`,
      )
      for (const category of categories) {
        category.cat_group_id = reassignId
        await CommandsClient.executeAppCommand(AppCommandIds.SAVE_ACCOUNT, category)
      }
    }

    // Finally, delete the CategoryGroup
    const categoriesGroupRepo = DatabaseManager.getConnection().getRepository(CategoryGroupEntity)
    await categoriesGroupRepo.delete(id)
  }
}

// Export instance of Class
export const CategoryGroupsService = new CategoryGroupsServiceClass()
