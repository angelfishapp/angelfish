import { validate } from 'class-validator'

import type { AppCommandRequest, AppCommandResponse } from '@angelfish/core'
import { AppCommandIds, Command } from '@angelfish/core'
import { DatabaseManager } from '../../database/database-manager'
import { InstitutionEntity } from '../../database/entities'
import { getWorkerLogger } from '../../logger'

const logger = getWorkerLogger('InstitutionService')

/**
 * Manage Institutions in database and Cloud Sync. Will add/remove bank links
 * for syncing as institutions are added/removed.
 */
class InstitutionServiceClass {
  /**
   * Get all Institutions in Database
   */
  @Command(AppCommandIds.LIST_INSTITUTIONS)
  public async listInstitutions(
    _r: AppCommandRequest<AppCommandIds.LIST_INSTITUTIONS>,
  ): AppCommandResponse<AppCommandIds.LIST_INSTITUTIONS> {
    const institutionRepo = DatabaseManager.getConnection().getRepository(InstitutionEntity)
    return await institutionRepo.find({ order: { name: 'ASC' } })
  }

  /**
   * Get an Institution by ID. Will return null if not found
   *
   * @param id    The primary key for the CategoryGroup
   */
  @Command(AppCommandIds.GET_INSTITUTION)
  public async getInstitution({
    id,
  }: AppCommandRequest<AppCommandIds.GET_INSTITUTION>): AppCommandResponse<AppCommandIds.GET_INSTITUTION> {
    const institutionRepo = DatabaseManager.getConnection().getRepository(InstitutionEntity)
    return await institutionRepo.findOne({
      where: { id },
    })
  }

  /**
   * Save or update an Institution in the database
   *
   * @param institution     The Institution to save
   */
  @Command(AppCommandIds.SAVE_INSTITUTION)
  public async saveInstitution(
    request: AppCommandRequest<AppCommandIds.SAVE_INSTITUTION>,
  ): AppCommandResponse<AppCommandIds.SAVE_INSTITUTION> {
    const errors = await validate(InstitutionEntity.getClassInstance(request), {
      forbidUnknownValues: true,
    })
    if (errors.length > 0) {
      const errorMsg = 'Cannot save InstitutionEntity as it failed validation'
      logger.error(errorMsg, errors)
      throw Error(errorMsg)
    }

    const institutionRepo = DatabaseManager.getConnection().getRepository(InstitutionEntity)
    return await institutionRepo.save(request)
  }

  /**
   * Delete an Institution from the database. Will automatically unlink bank if it is
   * synced and delete all accounts & transactions associated with the Institution
   *
   * @param id    The primary key for the Institution to delete
   */
  @Command(AppCommandIds.DELETE_INSTITUTION)
  public async deleteInstitution({
    id,
  }: AppCommandRequest<AppCommandIds.DELETE_INSTITUTION>): AppCommandResponse<AppCommandIds.DELETE_INSTITUTION> {
    const institutionRepo = DatabaseManager.getConnection().getRepository(InstitutionEntity)
    await institutionRepo.delete(id)
  }
}

// Export instance of Class
export const InstitutionService = new InstitutionServiceClass()
