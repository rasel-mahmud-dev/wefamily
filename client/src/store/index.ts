import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"

import postReducer from "reducers/postReducer"
import appReducer from "reducers/appReducer"
import authReducer from "./reducers/authReducer"
import apis from "src/apis";


declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose


const reducers = combineReducers({
  postState: postReducer,
  appState: appReducer,
  authState: authReducer
})

const store =  createStore(reducers, {}, composeEnhancers(applyMiddleware(thunk.withExtraArgument(apis))))

export type RootStateType = ReturnType<typeof store.getState>
export type DispatchType = typeof store.dispatch
export default store