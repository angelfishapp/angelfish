import Store from 'electron-store'

const store = new Store({
  defaults: {
    locale: 'en',
  },
})

export const getLocale = () => store.get('locale') as string
export const setLocale = (locale: string) => store.set('locale', locale)
