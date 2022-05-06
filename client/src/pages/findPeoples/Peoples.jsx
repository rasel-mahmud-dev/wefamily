import React from 'react';
import api from "src/apis";
import fullLink from "src/utils/fullLink";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {ActionTypes} from "store/types/ActionTypes";

import "./styles.scss"

const Peoples = (props) => {
  
  const {authState} = useSelector((state)=>state)
  
  let [users, setUsers] = React.useState([])
  let [allRequest, setAllRequest] = React.useState([])
  
  const [tab, setTab] = React.useState("Your Friends")
  const dispatch = useDispatch()
  
  React.useEffect(()=>{
    api.get("/api/peoples?type=add_friend_able").then(response=>{
      if(response.status === 200) {
        setUsers(response.data)
      }
    })
  
    api.get("/api/all-friends").then(response=>{
      if(response.status === 200) {
        if(response.data.all_friends) {
          dispatch({
            type: ActionTypes.LOGIN,
            payload: {
              ...authState,
              allFriends: response.data.all_friends
            }
          })
        }
        // setUsers(response.data)
      }
    })
    
    api.get("/api/get-requested-friends").then(response=>{
      if(response.status === 200) {
        if(response.data) {
          setAllRequest(response.data)
        }
        // setUsers(response.data)
      }
    })
    
  }, [])
  
  function cancelFriendRequest(reqID){
    api.get("/api/get-requested-friends/", reqID).then(response=>{
      if(response.status === 200) {
        if(response.data) {
          setAllRequest(response.data)
        }
        // setUsers(response.data)
      }
    })
  }
  
  function addFriendHandler(user_id) {
    api.post("/api/user/add-friend", { friend_id: user_id }).then(response=>{
      console.log(response, user_id)
    })
  }
  
  const nav = [
    {label: "Your Friends"},
    {label: "Find Peoples"},
    {label: "Send Request"}
  ]
  
  function renderAllFriends(users){
    return <ul className="flex-wrap request_friend flex flex-col md:flex-row  mt-4">
      { users && users.length > 0 ? users.map((user, i)=>(
        <li className="flex md:justify-center mr-4 mb-2 md:mb-0 ">
            <div className="flex md:flex-col  ">
              <div className="w-[35px] md:w-[50px] mx-auto">
                { user.avatar ? (
                  <img className="rounded-full w-full " src={fullLink(user.avatar)} alt=""/>
                ) : (
                  <i className="fa text-2xl fa-user-circle" />
                ) }
              </div>
              <Link to="/user/profile" className="text-sm ml-2">{user.username}</Link>
            </div>
          {/*<button className="btn" onClick={(e)=>addFriendHandler(user._id)} >Add Friend</button>*/}
        </li>
   
      )) : (
        <h4 className='text-center'>No people found to add friend</h4>
      ) }
    </ul>
  }
  
  function renderAllPeopleWithoutFriends(users){
    let a = users.filter(a=>{
      let index = allRequest.findIndex(aR=>aR.to._id === a._id)
      return index === -1
    })
    
    return (
      <div className="request_friend">
        <h1 className="text-md font-medium">Add to Friend</h1>
        <ul className="flex flex-col md:flex-row  mt-4">
          { a && a.length > 0 ? a.map((user, i)=>(
            <li  className="list-item">
              <div className="flex flex-row md:flex-col items-center">
                <div className="w-[35px] mx-auto">
                  { user.avatar ? (
                    <img className="rounded-full w-full " src={fullLink(user.avatar)} alt=""/>
                  ) : (
                    <i className="fa text-2xl fa-user-circle" />
                  ) }
                </div>
                <div className="flex flex-1 md:flex-0 md:block justify-between">
                   <h4 className="text-sm ml-2">{user.username}</h4>
                   <button className="btn" onClick={(e)=>addFriendHandler(user._id)} >Add</button>
                </div>
                </div>
              </li>
          
          )) : (
            <h4 className='text-center'>No people found to add friend</h4>
          ) }
        </ul>
      </div>
  )}
  
  
  function renderSendFriendRequest(friends){
    return (
      <div className="request_friend">
        <h1 className="text-md font-medium">Your Requested Friend</h1>
        <ul className="flex flex-wrap mt-4">
          { friends && friends.length > 0 ? friends.map((user, i)=>(
            <li className="list-item">
              <div className="flex flex-row md:flex-col">
                <div className="w-[50px] mx-auto">
                  { user.to.avatar ? (
                    <img className="rounded-full w-full " src={fullLink(user.to.avatar)} alt=""/>
                  ) : (
                    <i className="fa text-4xl fa-user-circle" />
                  ) }
                </div>
                <div className="flex flex-1 md:flex-0 md:block justify-between">
                  <h4 className="text-sm ml-2">{user.to.username}</h4>
                  <button className="btn" onClick={(e)=>cancelFriendRequest(user._id)} >Cancel</button>
                </div>
              </div>
            </li>
    
          )) : (
            <h4 className='text-center'>No people found to add friend</h4>
          ) }
        </ul>
      </div>
    )
  }
  
  
  return (
    <div className="container ">
      
      <div className="shadow-xss bg-white px-4 py-3">
        <div className="mt-2">
          <ul className="flex items-center">
            { nav.map(n=>(
              <li
                onClick={()=>setTab(n.label)}
                className={["font-medium text-sm text-gray-600 mr-3", tab === n.label
                  ? "bg-primary/60 px-2 py-1 rounded text-white"
                  : ""].join(" ")}>{n.label}</li>
            )) }
          </ul>
        </div>
        <div className="border-b-2 border-dark-100/10 mb-4 mt-2" />
  
        { tab === "Your Friends" ? (
          <div>
            <h1 className="text-md font-medium">Total {authState.friends && authState.friends.length} Friends</h1>
            {renderAllFriends(authState.allFriends)}
          </div>
        ) : tab === "Find Peoples" ? (
          renderAllPeopleWithoutFriends(users)
        ) : renderSendFriendRequest(allRequest)  }
        
      </div>
    </div>
  );
};


export default Peoples;