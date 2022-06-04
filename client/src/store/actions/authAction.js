import api from "src/apis";
import axios from "axios";
import {ActionTypes} from "store/types/ActionTypes";


export const fetchCurrentAuth= (_) => async (dispatch)=> {
  api.get("/api/current-auth").then(response => {
    if (response.status === 200) {
      let {user_status, ...o} = response.data
      dispatch({
        type: ActionTypes.LOGIN,
        payload: {
          authFetched: true,
          ...o,
          in_visible: user_status?.in_visible,
          is_online: user_status?.is_online
        }
      })
    }
  
  }).catch(ex=>{
    dispatch({
      type: ActionTypes.LOGIN,
      payload: {authFetched: true}
    })
  })
}

export const fetchUserProfile = async (authId, callback)=>{
  api.post(`/api/user/profile`, {_id: authId }).then(response=>{
    if(response.status === 200) {
      callback(response.data.profile)
    }
  })
}