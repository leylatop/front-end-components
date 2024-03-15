import { createStore as reduxCreateStore, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

export const createStore = (reducers) => {
  return reduxCreateStore(
    reducers,
    composeWithDevTools(applyMiddleware(thunk))
  )
}

