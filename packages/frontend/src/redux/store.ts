import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './reducers'
import sagas from './sagas'

const sagaMiddleware = createSagaMiddleware()

// Optional logger to debug dispatches to store
// const logger: Middleware<{}> = store => next => action => {
//   console.group(action.type)
//   console.info('dispatching', action)
//   let result = next(action)
//   console.log('next state', store.getState())
//   console.groupEnd()
//   return result
// }

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({ serializableCheck: false }),
    sagaMiddleware,
  ],
  preloadedState: undefined,
})

sagaMiddleware.run(sagas)

export default store
