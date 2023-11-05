import {configureStore} from '@reduxjs/toolkit'
import nodeReducer from '../features/node/nodeSlice'

export const store = configureStore({
  reducer: {
    nodes: nodeReducer,
  }
})