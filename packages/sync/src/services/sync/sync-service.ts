import type { AppCommandRequest, AppCommandResponse } from '@angelfish/core'
import { AppCommandIds, Command, Logger } from '@angelfish/core'

const logger = Logger.scope('SyncService')

/**
 * Service to syncronize book and other data with the Cloud APIs.
 */
class SyncServiceClass {
  /**
   * Sync Command to start the sync process with the Cloud APIs. If request has no properties
   * set it will run full sync, otherwise it will selectively sync data based on the properties
   * allowing for partial syncs.
   *
   * @param user        If true, will sync the user's profile data
   * @param currencies  If true, will sync any currency data for currencies the user has accounts for
   * @returns           ISyncSummary object with the results of the sync
   */
  @Command(AppCommandIds.START_SYNC)
  public async sync(
    request: AppCommandRequest<AppCommandIds.START_SYNC>,
  ): AppCommandResponse<AppCommandIds.START_SYNC> {
    const { user, currencies } = request ?? {}
    // If no properties are set, execute everything
    const runAll = !user && !currencies

    logger.info('🔄 Starting sync process...', runAll)
    return {
      completed: true,
    }
  }
}

// Export instance of Class
export const SyncService = new SyncServiceClass()
