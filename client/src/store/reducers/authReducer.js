
import {ActionTypes} from "store/types/ActionTypes";


const initialState = {
  username: "",
  email: "",
  first_name: "",
  authFetched: false,
  in_visible: true
}


export default function (state=initialState, action){
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

