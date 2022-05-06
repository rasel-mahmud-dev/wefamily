import React, {useMemo} from 'react';
import fullLink from "src/utils/fullLink";

import "./comments.scss"
import AddComment from "./AddComment";


const Comments = (props) => {
  const {
    comment,
    onDeleteComment,
    onFetchNestedComment,
    onHideReply,
    onSetShowReplyCommentForm,
    showReplyCommentForm,
    onSubmitAddComment,
  } = props
  
  
  const [showMoreCommentOptionId, setShowMoreCommentOptionId] = React.useState("")
  
  function handleToggleMoreOption(id) {
    if(id === showMoreCommentOptionId){
      setShowMoreCommentOptionId("")
    } else {
      setShowMoreCommentOptionId(id)
    }
  }
  
  
  // prevent re-rendering... whitelist these dep...
  // const renderCommentMemoized = renderComment(comment)
  
  
  // // prevent re-rendering... whitelist these dep...
  const renderCommentMemoized = useMemo(()=>{
    return renderComment(comment)
  }, [comment, comment.reply, showMoreCommentOptionId, showReplyCommentForm])

  
  function renderComment({_id, text, post_id, user_id, created_at, reply=false, child_comment_count, author: { username, avatar}}) {
    function formatDateTime(created) {
      let now = new Date();
      let sec = 1000;
      let min = sec * 60
      let hour = min * 60
      let day = hour * 24
      let mili = now - new Date(created)
      let r = ""
      if(Math.floor(mili / day)){
        r = Math.floor(mili / day) + " day ago"
      } else if(Math.floor(mili / hour)){
        r = Math.floor(mili / hour) + " hour ago"
      } else if(Math.floor(mili / min)){
        r = Math.floor(mili / min) + " min ago"
      } else if(Math.floor(mili / sec)){
        r = Math.floor(mili / sec) + " sec ago"
      } else {
        r = "a second ago"
      }
      return r
    }
    return (
      <div className="my-4 mt-6">
        <div className="flex">
          <div className="w-5 mr-2">
            <img className="w-full radius-100" src={fullLink(avatar)}/>
          </div>

          <div className="comment-body flex-1">
            <div className="comment-body-text px-2 py-1 bg-gray-9  text-sm rounded">
              <h1><a className="text-blue-600 text-sm" href="">{username} ID: {_id}</a></h1>
              <h4 className="text-xs">render timestamp {Date.now().toString()}</h4>
              <h1 className="text-sm">{text}</h1>
            </div>
            <div className="comment-action flex mt-1 text-xs text-gray-dark-9  items-center">
              <li className="">
                <i className="fa fa-heart hover:text-primary"/>
              </li>
              <li className="mx-3">
                <i onClick={()=>onSetShowReplyCommentForm(_id)} className="fa fa-reply mr-1"/>
              </li>
              <li>
                <i className="fa fa-clock mr-1"/>
                {formatDateTime(new Date(created_at))}
              </li>
              <li className="ml-3  relative">
                <span className="cursor-pointer hover:text-primary"
                      onClick={() => handleToggleMoreOption(_id)}>more</span>
                {showMoreCommentOptionId === _id && <div className="bg-white w-40 comment_option absolute shadow_1">
                  <ul className="">
                    <li className={"px-2 py-1 cursor-pointer hover:bg-primary_light  hover:text-primary flex"}>
                     <span className="pointer-events-none">
                      <i className="fa fa-pen mr-1 "/>  Edit comment
                     </span>
                    </li>
                    <li onClick={()=>onDeleteComment(_id)}
                        className={"px-2 py-1 cursor-pointer hover:bg-primary_light hover:text-primary flex"}>
                      <span className="pointer-events-none">
                        <i className="fa fa-trash mr-1"/> Delete comment
                      </span>
                    </li>

                  </ul>
                </div>}
              </li>
            </div>
  
            { showReplyCommentForm === _id && (
              <AddComment onSubmit={onSubmitAddComment} parent_id={_id} cancelBtn onCancel={()=>onSetShowReplyCommentForm("")} />
            ) }
            
            {child_comment_count > 0 &&
              <div onClick={() => reply && reply.length > 0 ? onHideReply(_id) : onFetchNestedComment(_id, post_id)} className="flex mt-3 items-center">
              <i className="fa text-xs text-gray-light-7 fa-reply mr-1"/>
              <h4
                className="text-gray-light-7 text-xs hover:text-primary cursor-pointer"> {  reply && reply.length > 0 ? "hide reply comments" : "show reply" } {child_comment_count}</h4>
            </div>
            }

            { reply &&  reply.map(c=> renderComment(c) ) }

          </div>
        </div>

      </div>
    );
  }
  
  
  return renderCommentMemoized
};

export default Comments;