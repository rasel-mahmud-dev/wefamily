import React from 'react';
import apis from "src/apis";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "src/store";
import fullLink from "src/utils/fullLink";
import {useNavigate} from "react-router-dom";

import "./chating.scss"

const Chat = () => {
  const {appState, authState} = useSelector((state: RootStateType)=>state)
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  
  const [lastMessages, setLastMessages] = React.useState({})
  
  React.useEffect(()=>{
    if(appState.friends.length === 0){
      (async function (){
        let response = await apis.get("/api/user/friends")
        if(response.status === 200) {
          dispatch({type: "FETCH_FRIENDS", payload: response.data.allFriends})
          fetchLatestMsg(response.data.allFriends)
        }
      }())
    }
  }, [])
  
  
  function fetchLatestMsg(allFriends){
    let privateRooms = []
    allFriends.forEach(friend=>{
      privateRooms.push(getRoom(friend._id))
    })
    
    apis.post("/api/fetch-one-messages", {privateRooms}).then(doc=>{
      setLastMessages(doc.data.messages)
    }).catch(ex=>{
      console.log(ex)
    })
  }
  
  function getRoom(friendId){
    let d = friendId + authState._id
    let s = d.split("")
    s.sort()
    return s.join("")
  }
  
  
  function handlePrivateChat(_friend_id, _friend_username) {
    if(authState._id){
      navigate(`/chat/${_friend_id}/${_friend_username}`)
    }
  }
  
  
  function hideMeHandler(show) {
    if(authState._id) {
      if(show) {
        appState.socket.emit("visibility", {user_id: authState._id, in_visible: true})
      } else {
        appState.socket.emit("visibility", {user_id: authState._id, in_visible: false})
      }
    }
  }
  
  
  return (
    <div className="container-1300 px-3 bg-white">
      <div className="flex justify-between items-center">
        <h4 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Messages</h4>
        {/*<button onClick={()=>authState.in_visible ? hideMeHandler(false) : hideMeHandler(true)} > {authState.in_visible ? "hidden" : " Visible "}  Me*/}
        {/*  <i className="text-gray-600 cursor-pointer text-xs fa fa-power-off" />*/}
        {/*</button>*/}
      </div>
      
      <ul className="flex list-none">
        { appState && appState.friends.map((user, i)=>(
          <div key={i} className="flex px-2 justify-between cursor-pointer items-center hover:bg-gray-9 rounded py-1" onClick={()=>handlePrivateChat(user._id, user.username)}>
            <div className="flex items-center flex-col">
              <div className="relative">
                <img className="w-[50px] rounded-full mr-2 mb-1" src={fullLink(user.avatar)} alt=""/>
                <div className="active_bullet  "/>
              </div>
              <h4 className="text-[13px] font-normal text-gray-600">{user.first_name} {user.last_name}</h4>
            </div>
            {/*<span className={["w-2 h-2 rounded-full",user.user_status && user.user_status.in_visible  ? "bg-primary" : "bg-gray-300"].join(" ")}/>*/}
          </div>
        ))}
      </ul>
      
      <div className="border-b-2 border-gray-600/10 mt-4 mb-4"/>
      
      <ul className="list-none">
        { appState && appState.friends.map((user, i)=>(
          <div key={i} className="flex px-2 justify-between cursor-pointer items-center hover:bg-gray-9 rounded py-1.5" onClick={()=>handlePrivateChat(user._id, user.username)}>
            <div className="flex flex-1">
              <div className="relative">
                <img className="w-[40px] h-[40px] rounded-full mr-2 mb-1" src={fullLink(user.avatar)} alt=""/>
                <div className="active_bullet"/>
              </div>
              <div className="flex w-full justify-between flex-1 ">
               <div className="">
           
                 <h4 className="text-[16px] font-medium text-gray-700">{ user.first_name} {user.last_name}</h4>
                 <p  className="text-[14px] font-normal text-gray-400 mt-0">
                   {lastMessages[getRoom(user._id)]
                   && lastMessages[getRoom(user._id)].text}
                 </p>
               </div>
                <h4 className="font-normal text-xs text-gray-500">12:00 PM</h4>
              </div>
              
            </div>
            {/*<span className={["w-2 h-2 rounded-full",user.user_status && user.user_status.in_visible  ? "bg-primary" : "bg-gray-300"].join(" ")}/>*/}
          </div>
        ))}
      </ul>
      
      
      
      {/*<ul className="mt-4">*/}
      {/*  { appState && appState.friends.map((user, i)=>(*/}
      {/*    <div key={i} className="flex px-2 justify-between cursor-pointer items-center hover:bg-gray-9 rounded py-1" onClick={()=>handlePrivateChat(user._id, user.username)}>*/}
      {/*      <div className="flex items-start">*/}
      {/*        <img className="w-6 rounded-full mr-2 mb-1" src={fullLink(user.avatar)} alt=""/>*/}
      {/*        <h4 className="text-sm font-medium ">{user.first_name} {user.last_name}</h4>*/}
      {/*      </div>*/}
      {/*      <span className={["w-2 h-2 rounded-full",user.user_status && user.user_status.in_visible  ? "bg-primary" : "bg-gray-300"].join(" ")}/>*/}
      {/*    </div>*/}
      {/*  ))}*/}
      {/*</ul>*/}
      
    </div>
  );
};

export default Chat;