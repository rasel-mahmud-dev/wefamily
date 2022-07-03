import React from "react";
import fullLink from "src/utils/fullLink";
import {ReactionType} from "store/types";
import {type} from "os";

export let reactions = [
  {type: ReactionType.LIKE, icon: "static/icon/facebook-reaction-like.svg"},
  {type: ReactionType.LOVE, icon: "static/icon/facebook-reaction-love.svg"},
  {type: ReactionType.HAHA, icon: "static/icon/facebook-reaction-haha.svg"},
  {type: ReactionType.WOW, icon: "static/icon/facebook-reaction-wow.svg"},
  {type: ReactionType.SAD, icon: "static/icon/facebook-reaction-sad.svg"},
  {type: ReactionType.ANGRY, icon: "static/icon/facebook-angry.svg"},
]

let id;
let isDoneAddReaction = false

interface PropsType {
  post: any,
  authId: string,
  toggleReactionHandler: (post_id: string, reaction: ReactionType)=> void
}

function PostReaction(props: PropsType){
  
  const {post, authId, toggleReactionHandler } = props

  const [isShowReaction, setShowReaction] = React.useState(false)

  function renderReaction() {

    function handleToggle(reactionType: ReactionType){
      toggleReactionHandler(post._id, reactionType)
      setShowReaction(false)
      isDoneAddReaction = true

    }
    return (
      <div onMouseLeave={()=>setShowReaction(false)} className="shadow-a rounded">
        <ul className="flex bg-gray-9  px-2 py-2 rounded">
          { reactions.map((re, i)=>(
            <li className="mr-1 transition ease-in-out delay-150  cursor-pointer w-6 hover:w-10 flex items-center" key={i}>
              <img
                className="w-full flex px-1"
                onClick={()=>handleToggle(re.type)}
                src={fullLink(re.icon)} alt="reaction-logo"/>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  
  function handleEnter(e) {
    id = setInterval(() => {
      setShowReaction(true)
    }, 0)
  }
  
  function handleMouseLeave(e) {
    clearInterval(id)
    setShowReaction(false)
  }
  
  
  let uniqReaction = []
  post.likes.forEach(l=>{
    if(uniqReaction.findIndex(ur=> ur.reaction === l.reaction ) === -1){
      uniqReaction.push(l)
    }
  })

  let uniqAvatar = new Set()
  post.likes.forEach(l=>{
    if(l.user) {
      uniqAvatar.add(l.user[0].avatar)
    }
  })
  
  // console.log(uniqReaction)
  
  function renderUniqReaction(){
    return (
      <div className="flex">
        <ul className="flex relative reaction_emoji">
          { uniqReaction.map((like, i)=>(
            <li className="w-[18px]" key={i}>
              <img className="w-full" src={fullLink(reactions.find(r=>r.type === like.reaction).icon) } alt=""/>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  function renderUniqAvatar(){
    let j = []
    uniqAvatar.forEach(item=>{
      j.push(<div className="w-6">
        <img className="w-full rounded-full" src={fullLink(item)} />
      </div>)
    })
    return  j
  }

  return (
    <div className="mt-4">
      <ul className="text-sm justify-between items-start" >
        
        <div className="mx-1 flex items-center justify-between">
          <li  onClick={handleEnter} className="flex py-1">
            { isShowReaction ? renderReaction() :
             uniqReaction.length > 0 ?
              (
                <div  className="flex">
                  {renderUniqReaction()}
                  <div className={["flex ml"+uniqReaction.length].join(" ")}>
                    <span className="text-sm font-medium">{uniqReaction.find(ur=>ur.user && ur.user[0]._id === authId) ? "You " : " "}</span>
                    { uniqReaction.slice(uniqReaction.length - 3).map(ur=>(
                      <span className="text-sm font-medium">  {ur.user && ur.user[0]._id !== authId && ` And ${ur.user[0].username} `}  </span>
                    )) }
                    <li className="number_count">+{post.likes.length}</li>

                    {renderUniqAvatar()}
                  </div>
                </div>
              ) : (
                <>
                  <img
                    className="w-5 cursor-pointer hover:text-pink-700"
                    onClick={(e)=>toggleReactionHandler(post._id, ReactionType.LIKE)}
                    src={fullLink("static/icon/facebook-reaction-like.svg")}
                    alt=""
                  />
                  <span className="font-normal ml-1">{post.likes.length > 0 ? post.likes.length : '0' }</span>
                </>
              )
              
            }
          </li>
          <li className="ml-5 flex items-center">
            <i className="far fa-comment-alt-dots" />
            <span className="font-normal ml-2" >{post.total_comments > 0 ? post.total_comments : ''}</span>
          </li>
        </div>

        <div className="flex items-center justify-around border-b border-t border-gray-9 border-opacity-75 py-1 ">
          <li
            // onMouseLeave={handleMouseLeave}
            // onClick={handleEnter}
            // onMouseEnter={handleEnter}
            >

          </li>
          <li>
            {/*<i className="far fa-comment-alt-dots mr-1" />*/}
            {/*<span>Comment</span>*/}
          </li>
        </div>
      
      </ul>
    </div>
  )
}

export default PostReaction