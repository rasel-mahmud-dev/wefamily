import {ActionTypes} from "store/types/ActionTypes";


export interface AuthReducerType{
  _id: string
  username: string,
  email: string,
  first_name: string,
  authFetched: boolean,
  in_visible: boolean
  avatar?: string
}


export interface LoginAction {
  type: ActionTypes.LOGIN,
  payload: {
    token: string,
    _id: string,
    username: string,
    email: string,
    first_name: string,
    authFetched: boolean,
    in_visible: boolean
  }
}

interface SetOwnVisibility {
  type: ActionTypes.SET_OWN_VISIBILITY,
  payload: boolean
}

export type AuthReducerAction = LoginAction | SetOwnVisibility