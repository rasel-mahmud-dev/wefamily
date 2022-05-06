import {NavLink, useNavigate, Link } from "react-router-dom";
import "./navigation.scss"
import fullLink from "src/utils/fullLink";
import Badge from "../UI/badge/Badge";
import  React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
// import PreloadLink from "../preloadLink/PreloadLink";


const Navigation = (props) => {
  
  const {authState} = props
  
  let navigate = useNavigate();
  const dispatch = useDispatch()
  const [expandDropdown, setExpandDropdown] = useState("")
  
  
  function pushRoute(to){
    navigate(to)
    setExpandDropdown("")
  }
  
  function logoutRoutePush(){
    setExpandDropdown("")
    window.localStorage.setItem("token", "")
    dispatch({
      type: "LOGIN",
      payload: {}
    })
  }
  
  function authDropdown(isShow) {
    return isShow && (
      <div className="absolute top-7 right-0 shadow-lg card bg-white">
        <div className="min-w-200px  text-sm font-medium">
          { authState._id ? (
            <>
              <li
                className="hover:bg-primary hover:text-white cursor-pointer px-2 ">
                <NavLink to={`profile/${authState.username}`}>Profile</NavLink>
              </li>
              <li onClick={()=> logoutRoutePush("/user/profile") } className="hover:bg-primary hover:text-white cursor-pointer px-2 py-1">Logout</li>
            </>
          ) : (
            <li
            className="hover:bg-primary hover:text-white  cursor-pointer  px-2 py-1"
            onClick={()=> pushRoute("/auth/login") }
          >Login</li>
            )
          }
          <li
            onClick={()=> pushRoute("/admin/dashboard") }
            className="hover:bg-primary hover:text-white cursor-pointer px-2 py-1">Dashboard</li>
        </div>
      </div>
    )
  }
  
  
  return (
    <>
      <div className="navigation bg-white z-50 fixed w-full shadow-xss">
        
        <div className="max-w-screen-xl mx-auto px-2">
          <ul className="main-nav flex justify-between items-center">
          <div className="nav-logo flex md:flex-1">
            <div className="hidden flex-1 md:flex max-w-xl justify-between items-center input bg-dark-100 bg-opacity-25 text-white px-3.5 rounded-2xl text-sm">
              <input
                className="py-2 placeholder:text-dark-400 px-1 text-dark-400 bg-transparent bg-opacity-0 border-none outline-none w-full"
                type="text"
                placeholder="Search Users, posts"
              />
              <i className="fa fa-search text-dark-300  ml-1.5" />
            </div>
            
          </div>
          <div className="nav-center flex md:flex-1 md:justify-center ">
            <ul className="nav_items flex  md:justify-end items-center">
              <li className="nav_item ">
                <Link to="/">
                  <i className="fa fa-home-alt" />
                </Link>
              </li>
              <li className="nav_item relative">
                <Link to="/find-friends">
                  <i className="fa fa-user" />
                </Link>
                <Badge className="badge" count={100} />
              </li>
              <li className="nav_item relative">
                <Link to="/find-friends">
                  <i className="fa fa-bell" />
                </Link>
                <Badge className="badge " count={30} />
              </li>
              <li className="nav_item relative">
                <Link to="/chat">
                  <i className="fa fa-comment-dots" />
                </Link>
                <Badge className="badge"  count={2} />
              </li>
              <li className="nav_item relative">
                <i className="fa fa-globe-americas" />
                {/*<Badge className="bg-green-400 text-white absolute px-1 -top-2.5 right-1" count={12} />*/}
              </li>
              <li className="block md:hidden nav_item relative">
                <i className="far fa-search" />
              </li>
            </ul>
          </div>
          <div className="nav-auth flex md:flex-1 md:justify-end ">
            
            <ul className="nav_items flex justify-end items-center ">
              <div className="nav_item flex relative items-center"
                   onMouseLeave={()=>setExpandDropdown("")}
                   onClick={()=>setExpandDropdown(expandDropdown ? "" : "user_menu")}
                   onMouseEnter={()=>setExpandDropdown("user_menu")}
              >
                { authState._id && <h4 className="hidden md:block text-white font-medium">{authState.first_name + " " + authState.last_name}</h4>}
                <span className="nav_item avatar_logo p-0 m-0 w-7 mr-3">
                  { authState._id
                    ? <img className="rounded-full w-full flex" src={fullLink( authState.avatar ? authState.avatar : "static/avatar/Alec-Thompson-card_20200415_1603252.10e65779.jpg")} alt=""/> : (
                      <i className="fa fa-user-circle" />
                  )}
                </span>
                {authDropdown(expandDropdown === "user_menu")}
              </div>
              <li><i className="fa fa-cog" /> </li>
            </ul>
            
          </div>
        </ul>
        </div>
      </div>
      <div className="h-[85px]" />
      
    </>
  );
};


export default Navigation;