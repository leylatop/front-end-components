import { createStore as reduxCreateStore, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'

export const createStore = (reducers) => {
    return reduxCreateStore(
      reducers,
      applyMiddleware(thunk)
    )
  }
