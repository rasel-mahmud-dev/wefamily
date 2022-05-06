import React from 'react';
import {useParams} from "react-router-dom";

import "./chating.scss"
import fullLink from "src/utils/fullLink";

import { io }  from "socket.io-client"
import apis, {backend} from "src/apis";
import {useDispatch, useSelector} from "react-redux";
import Messages from "pages/chating/Messages";
import {RootStateType} from "src/store";


let socket  = io("ws://localhost:1001")

interface FriendsType {
    _id: string
    first_name: string
    last_name: string
    username: string
    email: string
    password: string
    created_at: string
    updated_at: string
    avatar: string
    friends: string[]
    "user_status": {
      _id: string
      user_id: string
      isActive: boolean
      last_active_date: Date
      socket_id: string
      updated_at: Date
    },
    "allFriends":{
      _id: string
      first_name: string
      last_name: string
      username: string
      email: string
      password: string
      created_at: string
      updated_at: string
      avatar: string
      friends: string[]
    }[]
}

const Chating = (props) => {
  
  const {appState, authState} = useSelector((state: RootStateType)=>{ return {appState: state.appState, authState: state.authState} })
  const [friend, setFriend] = React.useState<FriendsType>(null)
  
  const [room, setRoom] = React.useState("")
  
  
  const [textMsg, setTextMsg] = React.useState("")
  
  
  
  const params = useParams()
  const dispatch = useDispatch()
  
  
  function joinPrivateRoom(room) {
    // connect private room...
    // socket.on("connect", ()=>{
    //   console.log("You Added in private room ", room)
    //
    //   // either with send()
    //   socket.emit("join-room", room)
    //
    //   socket.on("msg", (msg)=>{
    //     dispatch({
    //       type: "PUSH_PRIVATE_MSG",
    //       payload: {room, message: msg}
    //     })
    //     console.log(msg)
    //     // setMessage([...message, msg])
    //   })
    //
    // })
  }
  
  React.useEffect(()=> {
  
    (async function (){
  
      let {friend_username, _friend_id} = params
  
      if(authState._id) {
    
        let d = _friend_id + authState._id
        let s = d.split("")
        s.sort()
    
        let privateRoom = s.join("")
        setRoom(privateRoom)
    
        if (appState.friends.length === 0) {
          apis.get(`/api/user/friend?friend_id=${_friend_id}`).then(response => {
            if (response.status === 200) {
              setFriend(response.data.friend)
            }
          })
        }
    
        joinPrivateRoom(privateRoom)
    
    
        // fetch old all messages....
        let response = await apis.get(`/api/messages?room=${privateRoom}`)
        if (response.status === 200) {
          dispatch({
            type: "FETCH_PRIVATE_MSG",
            payload: {
              room: privateRoom,
              messages: response.data.messages
            }
          })
        }
    
      }
    }())

    
    return ()=>{
      // socket.emit("leave", "")
    }
    
  }, [])
  
  function leaveRoom() {
    // socket.emit("leave", params.room)
  }
  

  React.useEffect(()=>{

    socket.on("connect", () => {

      // either with send()
      socket.send("Hello!");

      // receive event message that is emitted from server
      socket.on("message", data => {
        console.log(data);
      });

      socket.on("all-message", (message)=>{
        console.log(message)
      })

    });

  }, [])
  
  
  function sendMessageHandler(){
    
    socket.emit("message", {
      text: textMsg,
      to: friend._id,
      from: authState._id,
      room: room
    })
    
  }
  
  function handleDeleteMessage(msg_id){
    apis.delete(`/api/message/${msg_id}`).then(response=>{
      if(response.status === 201){
        dispatch({
          type: "DELETE_MESSAGE",
          payload: { room: room, _id: response.data._id}
        })
      }
    })
  }
  
  
  
  return (
    <div className="container-1366 px-3">
      {/*<h1 className="">Send A Message via Socket.</h1>*/}
      {/*<button className="btn" onClick={leaveRoom}>Leave</button>*/}
      
      { friend && (
        <div className="chat-friend-header bg-warmGray-500 bg-opacity-5 flex justify-between items-center">
          <div className="flex items-center">
            <img className="w-5 radius-100%" src={fullLink(friend.avatar)} alt=""/>
            <h4 className="ml-2">{friend.username}</h4>
            <span className={["ml-2 w-2 h-2 radius-100% ", friend.user_status && friend.user_status.isActive  ? "bg-primary":"bg-gray-300"].join(" ")}/>
            {/*<span>{friend.user_status && friend.user_status.isActive ? "Online": "Offline"}</span>*/}
            
          </div>
          <div>
            <i className="fa fa-ellipsis-h text-gray-500"  />
          </div>
        </div>
      ) }
  
      { appState.primateMessage && appState.primateMessage[room] && (
      <Messages
        onDeleteMessage={handleDeleteMessage}
        appState={appState}
        _id={authState._id}
        primateMessage={appState.primateMessage[room]}
        room={room}
        textMsg={textMsg}
      />

      ) }
      
      <div className="relative chat-message-form w-full box-border px-5">
        <textarea className="text-gray-400 text-sm font-medium input-item w-full" placeholder="Write your message" defaultValue={textMsg}  onChange={(e)=>setTextMsg(e.target.value)} />
        <button className="btn mt-2" onClick={sendMessageHandler}>Send Message</button>
      </div>
    </div>
  );
};

export default Chating;