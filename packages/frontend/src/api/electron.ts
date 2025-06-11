import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * Open a file dialog to select file(s).
 *
 * @param request   The request options for the open file dialog.
 *                      - `title`: Title of the dialog.
 *                      - `defaultPath`: Absolute directory path, absolute file path, or file name to use by default.
 *                      - `buttonLabel`: Custom label for the confirmation button, when left empty the default label will be used.
 *                      - `filters`: File types that can be displayed or selected in the dialog box.
 *                      - `properties`: Contains which features the dialog should use. The following values are supported across all platforms:
 *                          - `openFile`: Opens a file dialog.
 *                          - `openDirectory`: Opens a directory dialog.
 *                          - `multiSelections`: Allows multiple selections.
 *                          - `showHiddenFiles`: Shows hidden files.
 *
 * @returns         The selected file paths or null if cancelled.
 */
export async function showOpenDialog(
  request: AppCommandRequest<AppCommandIds.SHOW_OPEN_FILE_DIALOG>,
) {
  const filePaths = await CommandsClient.executeAppCommand(
    AppCommandIds.SHOW_OPEN_FILE_DIALOG,
    request,
  )
  if (filePaths.length === 0) return null
  return filePaths
}

/**
 * Show a save dialog to select a file path to save to.
 *
 * @param request   The request options for the save dialog.
 *                      - `title`: Title of the dialog.
 *                      - `defaultPath`: Absolute directory path, absolute file path, or file name to use by default.
 *                      - `buttonLabel`: Custom label for the confirmation button, when left empty the default label will be used.
 *                      - `filters`: File types that can be displayed or selected in the dialog box.
 *                      - `properties`: Contains which features the dialog should use. The following values are supported across all platforms:
 *                          - `showHiddenFiles`: Shows hidden files.
 *
 * @returns         The selected file paths or null if cancelled.
 */
export async function showSaveDialog(
  request: AppCommandRequest<AppCommandIds.SHOW_SAVE_FILE_DIALOG>,
) {
  return await CommandsClient.executeAppCommand(AppCommandIds.SHOW_SAVE_FILE_DIALOG, request)
}

/**
 * Show a desktop notification.
 *
 * @param request   The request options for the notification.
 *                      - `title`: A title for the notification, which will be displayed at the top of the notification window when it is shown.
 *                      - `body`: The body text of the notification, which will be displayed below the title or subtitle.
 *                      - `silent`: Whether or not to suppress the OS notification noise when showing the notification.
 *                      - `icon`: An icon to use in the notification. It must be a valid path to a local icon file.
 */
export async function showNotification(
  request: AppCommandRequest<AppCommandIds.SHOW_NOTIFICATION>,
) {
  await CommandsClient.executeAppCommand(AppCommandIds.SHOW_NOTIFICATION, request)
}
