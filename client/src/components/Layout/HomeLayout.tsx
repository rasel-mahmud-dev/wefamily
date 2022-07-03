import React from 'react';
import PostList from "pages/timeline/PostList";
import apis from "src/apis";
import fullLink from "src/utils/fullLink";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";


import "./layout.scss"
import {RootStateType} from "src/store";
import {AuthReducerType} from "store/types/AuthReducerType";

const HomeLayout = () => {
  
  return (
   <div className="container-130000">

     <div className="flex">
  
       <div className="left-sidebar sticky mr-4">
         <div className="sidebar_content shadow-xss px-4 pt-4 ">
           
           <div className="">
             <TopTrending />
           </div>
      
         </div>
       </div>
       <div className="main-content xxl:mx-10 lg:mx-4 mx-2">
         <div className="">
           <PostList />
         </div>
       </div>
       <div className="right-sidebar sticky ml-4">
         <div className="sidebar_content shadow-xss  ">
           <div className="">
            <ActiveFriends />
           </div>
         </div>
       </div>
       
     </div>
   </div>
  );
};

function TopTrending() {
  let authState: AuthReducerType = useSelector((state: RootStateType)=>state.authState)
  
  const nav = [
    { label: authState.username, icon: "", img: authState.avatar, to: `/profile/${authState.username}`},
    { label: "Friends", icon: "fa fa-user-friends", img: null, to: "/", },
    { label: "Groups", icon: "fa fa-users", img: null, to: "/", },
    { label: "Pages", icon: "fa fa-flag", img: null, to: "/", },
    { label: "Save", icon: "fa fa-user-friends", img: null, to: "/", },
    { label: "Favorites", icon: "fa fa-bookmark", img: null, to: "/", },
    { label: "Messenger", icon: "fab fa-facebook-messenger", img: null, to: "/", }
  ]
  
  return (
    <div className="">
      
      {nav.map((n, i)=>(
        <li key={i} className=" hover:bg-gray-9 rounded py-2 pl-2">
          <Link className="flex items-center no-underline" to={n.to}>
            { n.img ? (
              <img className="w-6 radius-100" src={fullLink(n.img)} alt=""/>
            ) : (
              <i className={n.icon} />
            ) }
            <h4 className="ml-2">{n.label}</h4>
          </Link>
        </li>
      ))}
    </div>
  )
}

function ActiveFriends(props){
  
  const { appState, authState } = useSelector((state: RootStateType)=>{
    return { appState: state.appState, authState: state.authState }
  })
  
  let dispatch = useDispatch()
  const navigate =   useNavigate()
  
  const [currentUserFriends, setCurrentUserFriends] = React.useState([])
  
  React.useEffect(()=>{
    (async function (){
      let response = await apis.get("/api/user/friends")
      if(response.status === 200) {
        dispatch({type: "FETCH_FRIENDS", payload: response.data.allFriends})
        // console.log(response.data.allFriends)
        // setCurrentUserFriends(response.data.allFriends)
      }
    }())
  }, [])
  
  
  function handlePrivateChat(_friend_id, _friend_username) {
    if(authState._id){
      navigate(`/chat/${_friend_id}/${_friend_username}`)
    }
  }
  
  
  function hideMeHandler() {
    appState.socket.emit("leave", {
      room: "member",
      user_id: authState._id
    })
  }
  
  return (
    <div className="px-4 pt-4">
        <div className="flex justify-between items-center">
          <h4 onClick={()=>alert("sdfsdf")} >Active Friends</h4>
          <i onClick={hideMeHandler} className="text-gray-600 cursor-pointer text-xs fa fa-power-off" />
        </div>
        <ul className="mt-4">
          { appState && appState.friends.map((user, i)=>(
            <div key={i} className="flex px-2 justify-between cursor-pointer items-center hover:bg-gray-9 rounded py-1" onClick={()=>handlePrivateChat(user._id, user.username)}>
              <div className="flex items-start">
                <img className="w-6 radius-100% mr-2 mb-1" src={fullLink(user.avatar)} alt=""/>
                <h4 className="text-sm font-medium ">{user.first_name} {user.last_name}</h4>
              </div>
              <span className={["w-2 h-2 radius-100% ",user.user_status && user.user_status.isActive  ? "bg-primary" : "bg-gray-300"].join(" ")}/>
            </div>
          ))}
      
        </ul>
    </div>
  )
}

export default HomeLayout;