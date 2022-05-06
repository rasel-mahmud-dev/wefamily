import React from 'react';
import {useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {fetchUserProfile} from "actions/authAction";
import fullLink from "src/utils/fullLink";

import "./profile.scss"
import apis from "src/apis";

const Profile = (props) => {
  
  let profile_cover = "static/images/profile-image.jpg"
  
  const [profile, setProfile] = React.useState(null)
  const [showSection, setShowSection] = React.useState({ name: "Friends", render: renderFriends})
  
  const sections = [
    { name: "Friends", render: renderFriends},
    { name: "Timeline", render: renderTimelinePost},
    { name: "Photos", render: renderFriends},
    { name: "Follower", render: renderFriends},
  ]
  
  const params = useParams()
  
  let dispatch = useDispatch()
  
  React.useEffect(()=> {
    fetchUserProfile(params.username, function (profile){
      setProfile(profile)
    })
  }, [params.username])
  
  function handleUnfriend(friend_id){
    apis.delete(`/api/user/unfriend/${friend_id}`).then(response=>{
      console.log(response)
    })
  }
  
  
  async function handleSelectSection(sec){
    if(sec.name === "Friends"){
      if(!profile.allFriends) {
        let response = await apis.get("/api/user/friends")
        if (response.status === 200) {
          setProfile({...profile, allFriends: response.data.allFriends})
        }
      }
    } else if(sec.name === "Timeline"){
      if(!profile.allPosts) {
        let response = await apis.get("/api/user/posts")
        if (response.status === 200) {
          setProfile({...profile, allPosts: response.data.allPosts})
        }
      }
    }
    
    setShowSection(sec)
  }

  function renderFriends(){
    return (
      <div >
        <div className="flex">
          { profile && profile.allFriends && profile.allFriends.map(fri=>(
            <div className="px-2">
              <div>
                <img className="w-10 rounded-full mx-auto" src={fullLink(fri.avatar)} alt=""/>
              </div>
              <h4 className="text-sm text-center">{fri.first_name}</h4>
              <button onClick={()=>handleUnfriend(fri._id)} className="btn">Unfriend</button>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  function renderTimelinePost(){
    return (
      <div>
        { profile && profile.allPosts && profile.allPosts.map(post=>(
          <h4>{post.title}</h4>
        ))}
      </div>
    )
  }
  
  return (
    <div className="sad">
      
      { profile && (
        <div>
          <div className="cover_photo_bg mt-4 mx-auto">
            <img src={fullLink(profile_cover)} alt="" className="rounded"/>
            <div className="avatar_photo">
              <img src={fullLink(profile.avatar)} alt=""/>
            </div>
          </div>
          <div className="container-1366">
            <div className="mt-28 mx-auto block text-center">
              <h4>{profile.first_name}</h4>
              <h4>{profile.last_name}</h4>
            </div>
  
            <div className="profile_items flex mt-2">
              {sections.map(s=>(
                <li onClick={()=>handleSelectSection(s)} className={["li_item", showSection.name === s.name ? "active" : ""].join(" ")}>{s.name}</li>
              ))}
            </div>
            
            <div className="mt-4">
              { showSection && showSection.render() }
            </div>
            
          </div>
          
        </div>
      ) }
      
    </div>
  );
};


export default Profile;