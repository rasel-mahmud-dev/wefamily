import React, {FC, Suspense} from "react";
import {Outlet, useRoutes} from "react-router-dom";
import ReactLazyPreload from "src/utils/ReactLazyPreload";

import ProgressBar from "src/components/UI/topProgressBar/TopProgressBar";
import Chat from "pages/chating/Chat";
import {AuthReducerType} from "store/types/AuthReducerType";

const HomePage = ReactLazyPreload(()=>import("./pages/homePage/HomePage"));
const Peoples = ReactLazyPreload(()=>import("pages/findPeoples/Peoples"));
const Login = ReactLazyPreload(()=>import("pages/auth/Login"));
const Registration = ReactLazyPreload(()=>import("pages/auth/Registration"));
const Chating = ReactLazyPreload(()=>import("pages/chating/Chating"));
const Index = ReactLazyPreload(()=>import("pages/admin/dashboard/Index"));
const DashboardHome = ReactLazyPreload(()=>import("pages/admin/dashboard/DashboardHome"));
const Profile = ReactLazyPreload(()=>import("pages/auth/Profile"));
const PostList = ReactLazyPreload(()=>import("pages/timeline/PostList"));
const HomeLayout = ReactLazyPreload(()=>import("components/Layout/HomeLayout"));
const LoginHomePage = ReactLazyPreload(()=>import("pages/loginHomePage/LoginHomePage"));



type Props = {
  authState: AuthReducerType
}

const MyRoutes: FC<Props> = (props)=>{
  let {authState} = props
  
  let routes: any = [
    !authState._id ? {path: "*", element: <LoginHomePage />} : '' // if not logged then all path to redirect LoginHome page component...
  ]
  
  
  if(authState.authFetched) {
  
    if(!authState._id){
      routes = [
        ...routes,
        {path: "/auth/login", exact: true, element: <Login afterRedirect={"/"}/>},
        {path: "/auth/registration", exact: true, element: <Registration/>},
        {path: "/",  element: <LoginHomePage />},
      ]
    } else {
      routes = [
        {path: "/", element: <HomeLayout/>},
        {path: "/home", element: <HomePage/>},
        {path: "/find-friends", exact: true, element: <Peoples/>},
        {path: "/posts", exact: true, element: <PostList/>},
        {path: "/chat", exact: true, element: <Chat/>},
        {path: "/chat/:_friend_id/:friend_username", exact: true, element: <Chating/>},
        {path: "/profile/:username/:authId", index: true, exact: true, element: <Profile/>},
        {
          path: "/admin/dashboard", element: <><Outlet/> <Index/></>,
          children: [
            {path: "home", element: <DashboardHome/>}
          ]
        },
      ]
    }
  } else {
    routes = [
      ...routes,
      {path: "/auth/login", exact: true, element: <Login afterRedirect={"/"}/>},
      {path: "/auth/registration", exact: true, element: <Registration/>},
      {path: "/",  element: <LoginHomePage />},
    ]
  }
  
  return (
    <Suspense fallback={<ProgressBar />}>
      {useRoutes(routes)}
    </Suspense>
  )
}

export default MyRoutes









