import {connect, useDispatch} from "react-redux";
import  React, {useEffect} from "react";
import api from "src/apis";
import fullLink from "../../utils/fullLink";
import Comments from "src/components/comments/Comments";
import AddComment from "src/components/comments/AddComment";
import {Link} from "react-router-dom";
import apis from "src/apis";

import "./posts.scss"
import Post from "pages/timeline/Post";
import {RootStateType} from "src/store";


let id;
const PostList = (props) => {
  const { postState, authState } = props
  const [postDetail, setPostDetail] = React.useState<any>({})
  const [commentPagination, setCommentPagination] = React.useState({
    pageSize: 1,
    currentPage: 1
  })
  
  const [showMoreCommentOptionId, setShowMoreCommentOptionId] = React.useState("")
  const [showReplyCommentForm, setShowReplyCommentForm] = React.useState("")
  const [showAddCommentForm, setShowAddCommentForm] = React.useState(false)
  
  
  
  const dispatch = useDispatch()
  
  useEffect(()=>{
    (async function (){
      let data = await api.get("/api/posts")
      let posts = data.data.posts
      dispatch({
        type: "FETCH_POSTS",
        payload: posts
      })
    }())
  }, [])
  
  function fetchPostDetailHandler(post_id){
    
    api.get(`/api/posts/${post_id}`).then(response=>{
      if(response.status === 200) {
        console.log(response.data.post)
        setPostDetail(response.data.post)
      }
    })
  }
  
  function fetchMoreComment() {
    let {pageSize, currentPage} = commentPagination
    api.get(`api/comments?${postDetail.id}&page_size=${pageSize}&current_page=${currentPage + 1}`).then(response=>{
      if(response.status === 200){
        let updatedPostDetail = {...postDetail}
        updatedPostDetail.comments.push(...response.data.comments)
        setPostDetail(updatedPostDetail)
        setCommentPagination({
          ...commentPagination,
          currentPage: commentPagination.currentPage + 1
        })
      }
    })
  }
  
  function fetchNestedCommentHandler(comment_id, post_id){
    api.get(`/api/comments?post_id=${post_id}&parent_id=${comment_id}`).then(r=>{
      if(r.status === 200) {
        let commentIdx = postDetail.comments.findIndex(c=>c.id === comment_id);
        if(commentIdx !== -1){
          let updatedPostDetail = {...postDetail}
          updatedPostDetail.comments[commentIdx].reply  = r.data.comments
          setPostDetail(updatedPostDetail)
        }
      }
    })
  }
  
  function hideReplyCommentHandler(comment_id) {
    let commentIdx = postDetail.comments.findIndex(c=>c.id === comment_id);
    if(commentIdx !== -1){
      let updatedPostDetail = {...postDetail}
      updatedPostDetail.comments[commentIdx].reply  = []
      setPostDetail(updatedPostDetail)
    }
  }
  
  function setShowReplyCommentFormHandler(comment_id) {
    setShowReplyCommentForm(showReplyCommentForm === comment_id ? "" : comment_id)
    
  }
  
  let updatedComments: any = []
  
  
  function findAndDeleteCommentRecursive(comments, deletedId){
    
    if(Array.isArray(comments)){
      comments.map(c=>{
        if(c.reply){
          findAndDeleteCommentRecursive(c.reply, deletedId)
        }
        updatedComments.push(c)
        
        if(updatedComments) {
          let deletedCommentIdx = updatedComments.findIndex(u => u.id === deletedId)
          if (deletedCommentIdx !== -1) {
            
            updatedComments.splice(deletedCommentIdx, 1)
          } else {
            if(updatedComments.reply) {
              let deletedCommentIdx = updatedComments.reply.findIndex(u => u.id === deletedId)
              updatedComments.reply.splice(deletedCommentIdx, 1)
            }
          }
        }
        
        if(c.id !== deletedId){
          
          // updatedComments.push(c)
          
          // if(c.reply && c.reply.length > 0) {
          //   c.reply.push(newComment)
          // } else {
          //   c.reply = [newComment]
          // }
        }
      })
    }
  }
  
  
  function deleteCommentHandler(comment_id) {
    
    function recursiveDelete(comments, deletedId, itemOfPatent=null){
      if(Array.isArray(comments)){
        comments.map(c=>{
          if(c.reply && c.reply.length > 0){
            recursiveDelete(c.reply, deletedId, c)
          }
          
          if(c.id === deletedId ){
            // nested n level comment...
            if(itemOfPatent && itemOfPatent.reply) {
              let idx = itemOfPatent.reply.findIndex(d => d.id === c.id)
              itemOfPatent.reply.splice(idx, 1)
            } else {
              // root level comment...
              let idx = comments.findIndex(d => d.id === c.id)
              comments.splice(idx, 1)
            }
          }
        })
      }
    }
    // delete from database...
    api.delete(`/api/comments/${comment_id}`).then(r=>{
      if(r.status === 201){
        let updatedPostDetail: any = {...postDetail}
        recursiveDelete(updatedPostDetail.comments, comment_id, null)
        setPostDetail(updatedPostDetail)
      }
    })
  }
  
  function findAndUpdateCommentRecursive(comments, newComment){
    if(Array.isArray(comments)){
      comments.map(c=>{
        if(c.reply){
          findAndUpdateCommentRecursive(c.reply, newComment)
        }
        
        if(c.id === newComment.parent_id){
          if(c.reply && c.reply.length > 0) {
            c.reply.push(newComment)
          } else {
            c.reply = [newComment]
          }
        }
      })
    }
  }
  
  
  function handlePostComment(newComment, post_id){
    let newCommentObj = {
      ...newComment
    }
    
    function recursiveAddNew(comments, parent_id, itemOfPatent=null){
      if(Array.isArray(comments)){
        comments.map(c=>{
          if(c.reply && c.reply.length > 0){
            recursiveAddNew(c.reply,  parent_id, c)
          }
          
          if(c.id === parent_id ){
            // nested n level
            if(itemOfPatent && itemOfPatent.reply) {
              if(itemOfPatent.reply) {
                itemOfPatent.reply.push(newCommentObj)
              } else {
                itemOfPatent.reply = [newCommentObj]
              }
            } else {
              let idx = comments.findIndex(pc=>pc.id === c.id)
              if (comments[idx].reply) {
                comments[idx].reply.push(newCommentObj)
              } else {
                comments[idx].reply = [newCommentObj]
              }
            }
          }
        })
      }
    }
    let val = newComment.text.trim()
    api.post("api/add-comment", {
      parent_id: newCommentObj.parent_id, text: val,
      post_id: post_id,
      user_id: authState._id
    }).then(r => {
      
    })
    // if(val){
    //   newCommentObj.text = val
    //   api.post("api/add-comment", {
    //     parent_id: newCommentObj.parent_id, text: val,
    //     post_id: postDetail.id,
    //     user_id: authState.id
    //   }).then(r => {
    //     if(r.status === 201){
    //       newCommentObj.id = r.data.id
    //       newCommentObj.created_at = new Date()
    //       let updatedPostDetail = {...postDetail}
    //       if(r.data.parent_id){
    //         recursiveAddNew(updatedPostDetail.comments, newCommentObj.parent_id, null)
    //         setShowReplyCommentForm("")
    //       } else {
    //         updatedPostDetail.comments = [...updatedPostDetail.comments, r.data]
    //         setShowAddCommentForm(false)
    //       }
    //       setPostDetail(updatedPostDetail)
    //     }
    //   })
    // } else {
    //   alert("comment required.")
    // }
  }
  
  
  function handleAddLike(post_id, you_liked){
    if(authState.id){
      if(you_liked) {
        api.post("/api/remove-like", {post_id: post_id, user_id: authState.id}).then(r => {
          if(r.status === 201){
            let data = r.data
            dispatch({
              type: "REMOVE_LIKE",
              payload: data
            })
          }
        })
      } else {
        api.post("/api/add-like", {post_id: post_id, user_id: authState.id}).then(r => {
          if(r.status === 201){
            let data = r.data
            dispatch({
              type: "ADD_LIKE",
              payload: data
            })
          }
        })
      }
    }
  }
  
  
  
  function handleToggleMoreOption(comment_id) {
    if(showMoreCommentOptionId === comment_id){
      setShowMoreCommentOptionId("")
      return
    }
    setShowMoreCommentOptionId(comment_id)
  }
  
  
  function renderComments(post_Id, comments, total_comment) {
    return (
      <div>
        {/*<h3 onClick={()=>setShowAddCommentForm(!showAddCommentForm)} className="text-sm mt-4 mb-1 font-medium cursor-pointer">Write a Comment...</h3>*/}
        {/*{showAddCommentForm && <AddComment onSubmit={handlePostComment} />}*/}
        <div className="comment_list mt-5">
          { comments && comments.map((comment, i)=>(
            <Comments
              key={i}
              onSubmitAddComment={handlePostComment}
              onHideReply={hideReplyCommentHandler}
              onDeleteComment={deleteCommentHandler}
              showMoreCommentOptionId={showMoreCommentOptionId}
              handleToggleMoreOption={handleToggleMoreOption}
              onFetchNestedComment={fetchNestedCommentHandler}
              showReplyCommentForm={showReplyCommentForm}
              onSetShowReplyCommentForm={setShowReplyCommentFormHandler}
              comment={comment}
            />
          )) }
          { total_comment && <h5 onClick={fetchMoreComment} className="text-sm font-medium text-center text-gray-light-7 hover:text-primary cursor-pointer">+More comment</h5>}
        </div>
      </div>
    
    )
    
  }
  
  function renderPosts(){
    
    return postState.posts.map((post, i)=>(
      <div key={i} className="post  shadow-xss bg-white mb-4 px-4 py-2 rounded">
        <Post
          key={post._id}
          post={post}
          authId={authState._id}
          // postDetail={postDetail}
          // onFetchPostDetail={fetchPostDetailHandler}
          renderComments={renderComments} />
      </div>
    ))
  }
  
  function addStatusRenderForm(){
    let [postText, setPostText] = React.useState("")
    
    function publishPostHandler(){
      apis.post("/api/post", {description: postText,}).then(r => {
        console.log(r)
      })
      
    }
    
    return (
      <div className="mt-2 mb-5 bg-white rounded py-3 ">
        <h4 className="text-md font-medium mb-1">What is in your mind</h4>
        <div className="add-comment-form">
          <textarea
            onChange={(e)=>setPostText(e.target.value)}
            className="input-item"
            name="text"
            rows={4}
            placeholder="Share some what you are thinking?"
            id="text"
            defaultValue={postText}
          />
          <div className="flex mb-1">
            <li className="list-none text-gray-700  px-1 pl-0"><i className="fa fa-image" /></li>
            <li className="list-none text-gray-700 px-1"><i className="fa fa-smile" /></li>
          </div>
          <div className="flex">
            <button onClick={publishPostHandler}  className="btn btn-sm w-full">Post</button>
          </div>
        </div>
      </div>
    )
  }
  
  
  return (
    <div>
      <div className="max-w-full mx-auto">
        { addStatusRenderForm() }
        {renderPosts()}
      </div>
    </div>
  );
};


function mapStateToProps(state: RootStateType){
  return {
    postState: state.postState,
    authState: state.authState
  }
}

export default connect(mapStateToProps, {})(PostList);