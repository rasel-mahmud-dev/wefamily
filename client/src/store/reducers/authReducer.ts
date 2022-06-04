
import {ActionTypes} from "store/types/ActionTypes";
import {AuthReducerAction, AuthReducerType} from "store/types/AuthReducerType";


const initialState: AuthReducerType = {
  _id: "",
  username: "",
  email: "",
  first_name: "",
  authFetched: false,
  in_visible: true
}


export default function (state= initialState, action: AuthReducerAction){
  let updatedState = {...state}
  switch (action.type){
    case ActionTypes.LOGIN:
      let {token, ...user} = action.payload
      if(token){
        window.localStorage.setItem("token", token);
      }
      return user
    
    case ActionTypes.SET_OWN_VISIBILITY:
      updatedState.in_visible = action.payload
      return  updatedState
      
      
    default:
      return updatedState
  }
}

