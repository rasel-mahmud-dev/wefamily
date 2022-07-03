import {NavLink, useNavigate, Link } from "react-router-dom";
import "./navigation.scss"
import fullLink from "src/utils/fullLink";
import Badge from "../UI/badge/Badge";
import  React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import slugify from "src/utils/slugify";
// import PreloadLink from "../preloadLink/PreloadLink";

import logo from  "src/asserts/images/logo.svg"
import {
  faCog,
  faCommentAltDots,
  faGlobeAmericas,
  faHomeAlt,
  faSearch,
  faUser, faUserCircle,
  faUsers
} from "@fortawesome/pro-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"



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
        <div className="absolute top-10 right-0 shadow-lg card bg-white">
          <div className="min-w-200px  text-sm font-medium">
            { authState._id ? (
                <>
                  <li
                      className="hover:bg-primary hover:text-white cursor-pointer px-2 ">
                    <NavLink to={`profile/${slugify(authState.username)}/${authState._id}`}>Profile</NavLink>
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
        <div className="navigation bg-primary z-50 fixed w-full shadow-xss">

          <div className="max-w-screen-xl w-full mx-auto px-2">
            <ul className="main-nav flex justify-between items-center">
              <div className="nav-logo mr-8 flex md:flex-5">
                <NavLink to="/" className="cursor-pointer"> <img src={logo} alt="logo"/></NavLink>
              </div>
              <div className="nav-center flex md:flex-1 md:justify-center ">
                <ul className="nav_items w-full flex  md:justify-end items-center">
                  <div
                      className="hidden
              flex-1 md:flex max-w-xl
               justify-between
                items-center
                 input
                 bg-white
                 bg-opacity-20
                  text-white
                   px-3.5
                  rounded-2xl
                   text-sm">
                    <input
                        className="py-2
                placeholder:text-light-900
                px-1
                text-light-850
                 bg-transparent
                 bg-opacity-0
                  border-none
                 outline-none
                  w-full"
                        type="text"
                        placeholder="Search Users, posts"
                    />
                    <FontAwesomeIcon className="text-light-850  ml-1.5" icon={faSearch} />
                  </div>

                  <li className="nav_item ">
                    <Link className="flex items-center" to="/">

                        <FontAwesomeIcon className="text-light-850  ml-1.5" icon={faHomeAlt} />
                        <label  className="text-white ml-2" htmlFor="">Home</label>


                    </Link>

                  </li>
                  <li className="nav_item relative">
                    <Link className="flex" to="/find-friends">
                      <div className="">
                        <FontAwesomeIcon className="text-light-850  ml-1.5" icon={faUsers} />
                        <Badge className="badge" count={100} />
                      </div>
                      <label className="text-white ml-2" htmlFor="">Friends</label>
                    </Link>
                  </li>

                  {/*<li className="nav_item relative">*/}
                  {/*  <Link to="/find-friends">*/}
                  {/*    <i className="fa fa-bell" />*/}
                  {/*    <label htmlFor="">Home</label>*/}
                  {/*  </Link>*/}
                  {/*  <Badge className="badge " count={30} />*/}
                  {/*</li>*/}


                  <li className="nav_item relative">
                    <Link className="flex" to="/chat">
                      <div>
                        <FontAwesomeIcon className="text-light-850  ml-1.5" icon={faCommentAltDots} />
                        <Badge className="badge"  count={2} />
                      </div>
                      <label  className="text-white ml-2" htmlFor="">Chat</label>
                    </Link>
                  </li>

                  <li className="nav_item relative">
                    <FontAwesomeIcon className="text-light-850  ml-1.5" icon={faGlobeAmericas} />
                    {/*<Badge className="bg-green-400 text-white absolute px-1 -top-2.5 right-1" count={12} />*/}
                  </li>
                  <li className="block md:hidden nav_item relative">
                    <FontAwesomeIcon className="text-light-850  ml-1.5" icon={faSearch} />
                  </li>
                </ul>
              </div>
              <div className="nav-auth flex md:flex-5 md:justify-end ">

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
                          <FontAwesomeIcon className="text-light-850  ml-1.5" icon={faUserCircle} />
                      )}
                </span>
                    {authDropdown(expandDropdown === "user_menu")}
                  </div>
                  <li>
                    <FontAwesomeIcon className="text-light-850  ml-1.5" icon={faCog} />
                  </li>
                </ul>

              </div>
            </ul>
          </div>
        </div>
        <div className="h-[55px]" />

      </>
  );
};
export default Navigation;