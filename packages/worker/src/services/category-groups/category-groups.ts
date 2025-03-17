import { validate } from 'class-validator'

import type { AppCommandRequest, AppCommandResponse, ICategoryGroup } from '@angelfish/core'
import { AppCommandIds, Command, Logger } from '@angelfish/core'
import { DatabaseManager } from '../../database/database-manager'
import { CategoryGroupEntity } from '../../database/entities'

const logger = Logger.scope('BookService')

/**
 * Manage Category Groups in the Database
 */
class CategoryGroupsServiceClass {
  /**
   * Get all Category Groups in Database
   */
  @Command(AppCommandIds.LIST_CATEGORY_GROUPS)
  public async list(
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
  public async getCategoryGroup(
    id: AppCommandRequest<AppCommandIds.GET_CATEGORY_GROUP>,
  ): AppCommandResponse<AppCommandIds.GET_CATEGORY_GROUP> {
    const categoriesGroupRepo = DatabaseManager.getConnection().getRepository(CategoryGroupEntity)
    return await categoriesGroupRepo
      .createQueryBuilder('categoryGroup')
      .where({ id })
      .loadRelationCountAndMap('categoryGroup.total_categories', 'categoryGroup.categories')
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
    return (await this.getCategoryGroup({ id: savedCategoryGroup.id })) as ICategoryGroup
  }

  /**
   * Delete a CategoryGroup from the database
   *
   * @param id    The primary key for the CategoryGroup to delete
   */
  public async deleteCategoryGroup(id: number) {
    const categoriesGroupRepo = DatabaseManager.getConnection().getRepository(CategoryGroupEntity)
    await categoriesGroupRepo.delete(id)
  }
}

// Export instance of Class
export const CatoryGroupService = new CategoryGroupsServiceClass()
