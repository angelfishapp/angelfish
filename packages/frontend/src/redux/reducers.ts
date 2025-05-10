import { combineReducers } from '@reduxjs/toolkit'

import accounts from './accounts/reducers'
import app from './app/reducers'
import categoryGroups from './categoryGroups/reducers'
import institutions from './institutions/reducers'
import tags from './tags/reducers'
import transactions from './transactions/reducers'
import users from './users/reducers'

// Fix for issue: https://github.com/reduxjs/redux-toolkit/issues/2068
// type Error
const rootReducer = combineReducers({
  app,
  users,
  categoryGroups,
  institutions,
  accounts,
  transactions,
  tags,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
