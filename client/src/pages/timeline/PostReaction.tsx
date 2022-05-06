import React from "react";
import fullLink from "src/utils/fullLink";

export let reactions = [
  {type: "LIKE", icon: "static/icon/facebook-reaction-like.svg"},
  {type: "LOVE", icon: "static/icon/facebook-reaction-love.svg"},
  {type: "HAHA", icon: "static/icon/facebook-reaction-haha.svg"},
  {type: "WOW", icon: "static/icon/facebook-reaction-wow.svg"},
  {type: "SAD", icon: "static/icon/facebook-reaction-sad.svg"},
  {type: "ANGRY", icon: "static/icon/facebook-angry.svg"},
]

let id;



function PostReaction(props){
  
  const {post, authId, toggleLikeHandler } = props
  
  const [isShowReaction, setShowReaction] = React.useState(false)
  
  function renderReaction() {
    return (
      <div>
        <ul className="flex bg-gray-9  px-2 py-2 rounded">
          { reactions.map((re, i)=>(
            <li className="mr-1 cursor-pointer" key={i}>
              <img
                className="w-6 flex px-1"
                onClick={(e)=>toggleLikeHandler(post._id, re.type)}
                src={fullLink(re.icon)} alt="reaction-logo"/>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  
  function handleEnter(e) {
    id = setInterval(()=>{
      setShowReaction(true)
    }, 500)
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
  
  // console.log(uniqReaction)
  
  function renderUniqReaction(){
    return (
      <div className="flex">
        <ul className="flex relative reaction_emoji">
          { uniqReaction.map((like, i)=>(
            <li className="w-5" key={i}>
              <img className="w-full" src={fullLink(reactions.find(r=>r.type === like.reaction).icon) } alt=""/>
            </li>
          ))}
          <li className="number_count">+{post.likes.length}</li>
        </ul>
      </div>
    )
  }
  
  return (
    <div className="mt-4">
      <ul className="text-sm justify-between items-start" >
        
        <div className="mx-1 flex items-center justify-between">
          <li className="flex py-1">
            { uniqReaction.length > 0 ?
              (
                <div className="flex">
                  {renderUniqReaction()}
                  <div className="flex">
                    <span className="text-sm font-medium">{uniqReaction.find(ur=>ur.user && ur.user[0]._id === authId) ? "You " : " "}</span>
                    { uniqReaction.slice(uniqReaction.length - 3).map(ur=>(
                      <span className="text-sm font-medium">  {ur.user && ur.user[0]._id !== authId && ` And ${ur.user[0].username} `}  </span>
                    )) }
                  </div>
                </div>
              ) : (
                <>
                  <img
                    className="w-5 cursor-pointer hover:text-pink-700"
                    onClick={(e)=>toggleLikeHandler(post._id, "LIKE")}
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
        
        
        <div
          
          className="flex items-center justify-around border-b border-t border-gray-9 border-opacity-75 py-1 ">
          <li
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleEnter}
            >
            {  isShowReaction ? renderReaction() : (
              <span>
                  <i className="fa fa-thumbs-up mr-1" />
                  <span>Like</span>
                </span>
            )}
          </li>
          <li>
            <i className="far fa-comment-alt-dots mr-1" />
            <span>Comment</span>
          </li>
        </div>
      
      </ul>
    </div>
  )
}

export default PostReaction