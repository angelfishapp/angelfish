let appContextRef: any = null

export const setAppContextRef = (context: any) => {
  appContextRef = context
}

export const getAppContextRef = () => {
  if (!appContextRef) {
    throw new Error('App context has not been set.')
  }
  return appContextRef
}
