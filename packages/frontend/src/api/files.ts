import { AppCommandIds, type AppCommandRequest, CommandsClient } from '@angelfish/core'

/**
 * Opens a native "Save File" dialog allowing the user to choose a file path
 * for saving an Angelfish file (e.g. `.afish`).
 *
 * This function executes the `SHOW_SAVE_FILE_DIALOG` command with optional parameters
 * like dialog title, default path, and file type filters.
 *
 * @param params - An object containing dialog options.
 * @param params.title - Optional title for the dialog window.
 * @param params.defaultPath - Optional default file path or suggested file name.
 * @param params.filters - Optional array of file type filters (e.g., `{ name: 'Angelfish', extensions: ['afish'] }`).
 *
 * @returns A promise that resolves to the selected file path as a string,
 *          or `undefined` if the user cancels the dialog.
 */

export async function getFilePath({
  title,
  defaultPath,
  filters,
}: AppCommandRequest<AppCommandIds.SHOW_SAVE_FILE_DIALOG>) {
  const filePath = await CommandsClient.executeAppCommand(AppCommandIds.SHOW_SAVE_FILE_DIALOG, {
    title,
    defaultPath,
    filters,
  })
  return filePath
}
