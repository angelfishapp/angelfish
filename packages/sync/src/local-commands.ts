/**
 * Local Commands for Sync Process
 */
export enum LocalCommands {
  /**
   * Initialise the API Client with the given refresh token
   */
  INIT_API_CLIENT = '_api.init.client',
  /**
   * Call Cloud API to send an Out-Of-Band (OOB) Code to the given email
   */
  CLOUD_API_SEND_OOB_CODE = '_api.send.oob.code',
  /**
   * Call Cloud API to authenticate a user with the given OOB Code
   */
  CLOUD_API_AUTHENTICATE = '_api.authenticate',
  /**
   * Cloud Cloud API to logout user
   */
  CLOUD_API_LOGOUT = '_api.logout',
  /**
   * Call Cloud API to get the authenticated user's profile
   */
  CLOUD_API_GET_USER_PROFILE = '_api.get.user.profile',
  /**
   * Call Cloud API to update the authenticated user's profile
   */
  CLOUD_API_UPDATE_USER_PROFILE = '_api.update.user.profile',
}
