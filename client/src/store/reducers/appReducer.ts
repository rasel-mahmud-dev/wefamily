import {ActionTypes} from "store/types/ActionTypes";


const initialState = {
  friends: [],
  allPeoples: [],   // that are add friend able...
  primateMessage: {},  // {[roomKey]: []}
  socket: null,
  backdrop: {
    message: "",
    isOpen: false,
    where: "content"
  }
}



export default function (state=initialState, action: any){
  let updatedState = {...state}
  let index = -1
  let updatedStateFriends;
  switch (action.type){
    
    case "FETCH_PEOPLES":
      updatedState.allPeoples = action.payload
      return updatedState
  
    case "STORE_SOCKET":
      updatedState.socket = action.payload
      return updatedState
  
  
    case "FETCH_FRIENDS":
      updatedState.friends = action.payload
      return updatedState
    
    case "FETCH_PRIVATE_MSG":
      updatedState.primateMessage[action.payload.room] = action.payload.messages
      return updatedState
    
    case "PUSH_PRIVATE_MSG":
      let m = updatedState.primateMessage[action.payload.room]
      if(m){
        m =  [...m, action.payload.message]
      }
      updatedState.primateMessage[action.payload.room] = m
      return updatedState
    
     case "DELETE_MESSAGE":
      let findRoomMessages = updatedState.primateMessage[action.payload.room]
      let filteredMessage = [];
      if(findRoomMessages){
        filteredMessage = findRoomMessages.filter(fm=>fm._id !== action.payload._id)
      }
      updatedState.primateMessage[action.payload.room] = filteredMessage
      return updatedState
      
    
    
    case ActionTypes.SET_ACTIVE_STATUS:
      updatedStateFriends = [...updatedState.friends]
      index = updatedStateFriends.findIndex(aa=> aa._id === action.payload)
      if(index !== -1){
        if(updatedStateFriends[index].user_status) {
          updatedStateFriends[index].user_status.is_online = true
        } else {
          updatedStateFriends[index].user_status = {
            visible: true,
            is_online: true,
          }
        }
      }
      updatedState.friends = updatedStateFriends
      return updatedState
    case  ActionTypes.SET_INACTIVE_STATUS:
      updatedStateFriends = [...updatedState.friends]
      index = updatedStateFriends.findIndex(aa=> aa._id === action.payload)
      if(index !== -1){
        if(updatedStateFriends[index].user_status) {
          updatedStateFriends[index].user_status.is_online = false
        } else {
          updatedStateFriends[index].user_status = {
            is_online: false,
          }
        }
      }
      updatedState.friends = updatedStateFriends
      return updatedState
    
    
    case ActionTypes.SET_INVISIBLE:
      updatedStateFriends = [...updatedState.friends]
      index = updatedStateFriends.findIndex(aa=> aa._id === action.payload)
      if(index !== -1){
        if(updatedStateFriends[index].user_status) {
          updatedStateFriends[index].user_status.in_visible = false
        } else {
          updatedStateFriends[index].user_status = {
            in_visible: false,
    
          }
        }
      }
      updatedState.friends = updatedStateFriends
      return updatedState
    case ActionTypes.SET_VISIBLE:
      updatedStateFriends = [...updatedState.friends]
      index = updatedStateFriends.findIndex(aa=> aa._id === action.payload)
      if(index !== -1){
        if(updatedStateFriends[index].user_status) {
          updatedStateFriends[index].user_status.in_visible = true
        } else {
          updatedStateFriends[index].user_status = {
            in_visible: true,
          }
        }
      }
      updatedState.friends = updatedStateFriends
      return updatedState
  
    case ActionTypes.TOGGLE_BACKDROP:
      if(action.payload){
        updatedState.backdrop = action.payload
      } else {
        updatedState.backdrop.isOpen = !updatedState.backdrop.isOpen
      }
      // state.backdrop.where = "app"
      return updatedState
  
    default:
      return state
  }
}

