import React from "react";
// import api from "./apis";
import {useDispatch, useSelector} from "react-redux"
// import ProgressBar from "src/compoenents/UI/topProgressBar/TopProgressBar"
import Navigation from "components/navigation/Navigation";
import "./App.scss"

import {fetchCurrentAuth} from "store/actions/authAction"
import {io} from "socket.io-client";
import apis, {backend} from "src/apis";
import {RootStateType} from "src/store";
import MyRoutes from "src/MyRoutes";
import Footer from "components/footer/Footer";
import {ActionTypes} from "store/types/ActionTypes";


function App(props) {

  let dispatch = useDispatch()
  
  let {authState, appState} = useSelector((todos: RootStateType)=> { return { authState: todos.authState, appState: todos.appState}})
  

  
  React.useEffect(()=>{
    let loader = document.querySelector(".loader")
    loader && loader.parentElement && loader.parentElement.removeChild(loader)
  
    dispatch(fetchCurrentAuth())
  }, [])
  
  React.useEffect(()=>{
    if(authState._id) {
      let socket = io(backend.replace("http", "ws"))
      dispatch({
        type: "STORE_SOCKET",
        payload: socket
      })
    }
    
    // USER IS OFFLINE
    // let socket = io(backend.replace("http", "ws"))
    // socket.on("offline", (userId) => {
    //   console.log(userId, "Is Offline!"); // update offline status
    // });

    return ()=>{
      // alert("jo")
      // apis.get("/api/hhhhhhhh").then(r=>{
      //
      // })
    }
    
  }, [authState && authState._id])
  
  React.useEffect(()=>{
    if(appState.socket) {
      addOnline(appState.socket)
    }
    return ()=>{
      // appState.socket.emit("user-leave", {user_id: authState._id})
    }
  }, [appState.socket])
  
  
  // React.useEffect(() => {
  //   const unloadCallback = (event) => {
  //     alert("hjghj")
  //     event.preventDefault();
  //     event.returnValue = "";
  //     return "";
  //   };
  //
  //   window.addEventListener("beforeunload", unloadCallback);
  //   return () => window.removeEventListener("beforeunload", unloadCallback);
  // })
  
  const handleTabClosing = () => {
    // removePlayerFromGame()
  alert("close")
  }
  
  const alertUser = (event:any) => {
    event.preventDefault()
    event.returnValue = ''
  }
  
  function addOnline(socket){
    
    socket.on("connect", ()=>{
      
      socket.on("status-msg", (user_id)=>{
        if(user_id) {
          console.log(user_id, " join ")
          dispatch({
            type: ActionTypes.SET_ACTIVE_STATUS,
            payload: user_id
          })
        }
      })
      
      socket.emit("join-member-room",  {
        room: "member",
        user_id: authState._id
      })
  
      socket.on("leave-msg", (user_id: string)=>{
        
        console.log(user_id, " has left")
  
        // change client other client for disconnect ...
        
        dispatch({
          type: ActionTypes.SET_INACTIVE_STATUS,
          payload: user_id
        })
  
        // apis.post("/api/leave-online", {
        //   user_id: d.member_id
        // }).then(res=>{
        //   console.log(res)
        // }).catch(ex=>{
        //   console.log(ex.message)
        // })
        
      })
      
      socket.on("visibility", (data: {user_id: string, in_visible: boolean})=>{
        
        console.log(data.user_id, " turn off him")
  
        
        // change client other client for disconnect ...
        if(data.in_visible) {
          if(authState._id === data.user_id) {
            dispatch({
              type: ActionTypes.SET_OWN_VISIBILITY,
              payload: true
            })
          }
          dispatch({
            type: ActionTypes.SET_INVISIBLE,
            payload: data.user_id
          })
        } else {
          if(authState._id === data.user_id) {
            dispatch({
              type: ActionTypes.SET_OWN_VISIBILITY,
              payload: false
            })
          }
          dispatch({
            type: ActionTypes.SET_VISIBLE,
            payload: data.user_id
          })
        }
  
        // apis.post("/api/leave-online", {
        //   user_id: d.member_id
        // }).then(res=>{
        //   console.log(res)
        // }).catch(ex=>{
        //   console.log(ex.message)
        // })
        
      })
    })
  }
  
  
  return (
    <div className="">
      <div className="top-96"/>
      <Navigation authState={authState} />
        <MyRoutes authState={authState}  />
      {/*<Footer />*/}
    </div>
  )
}


export default App