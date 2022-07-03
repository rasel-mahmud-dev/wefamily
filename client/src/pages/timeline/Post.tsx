import {useDispatch} from "react-redux";
import React, {FC} from "react";
import apis, {api} from "src/apis";
import fullLink from "src/utils/fullLink";
import {Link} from "react-router-dom";
import AddComment from "components/comments/AddComment";

import PostReaction from "pages/timeline/PostReaction";
import {PostType, ReactionType} from "store/types";



interface PostDetail extends PostType{
    author: {avatar: string, username: string},
}


interface PostPropsType extends PostType{
  post: PostDetail,
  authId: string,
  renderComments: (_id: string, comments: any[], total_comments: number)=>any
}


function Post (props: PostPropsType) {
  let lastLikeReaction = ""
  const dispatch = useDispatch()

  let { post, authId,  renderComments} = props
  
  let [postDetail, setPostDetail] = React.useState<{
    _id?: string
    description?: string
    comments?: any[]
  }>({
    _id: "",
    description: "",
    comments: null
  })

  const [showAddCommentForm, setShowAddCommentForm] = React.useState(false)
  
  function addCommentHandler(newComment) {
    let val = newComment.text.trim()
    api().post("api/add-comment", {
      parent_id: null,
      text: val,
      post_id: post._id,
      user_id: authId
    }).then(r => {
    
    })
  }


  type ToggleLikeResponseType = {
    like?: {
      createdAt: string,
      post_id: string,
      reaction: string,
      updatedAt: string,
      user_id: string,
      user: {
        avatar: string,
        username: string
      },
      _id: string,
    },
    removeLike: boolean
  }

  function toggleReactionHandler(post_id: string, reaction: ReactionType){
    if(authId){
      api().post<ToggleLikeResponseType>("/api/toggle-like", {post_id: post_id, reaction: reaction, user_id: authId}).then(r => {
        if(r.status === 201){
          let { like,  removeLike } = r.data
          if(like){
            lastLikeReaction = reaction
            dispatch({
              type: "ADD_LIKE",
              payload: {
                user_id: authId,
                post_id: post_id,
                reaction: reaction,
                user: like.user
              }
            })
            
          } else if(removeLike) {
            dispatch({
              type: "REMOVE_LIKE",
              payload: {
                user_id: authId,
                post_id: post_id,
              }
            })
            
          }
          // else if(updateLike) {
          //   lastLikeReaction = updateLike.reaction
          //   dispatch({
          //     type: "UPDATE_LIKE",
          //     payload: {
          //       user_id: authId,
          //       post_id: post_id,
          //       reaction: updateLike.reaction
          //     }
          //   })
          // }
        }
      })
    }
  }
  
  function onFetchPostDetail(post_id) {
    console.log(post_id)
    if(postDetail && postDetail._id){
      setPostDetail({})
    } else {
      api().get(`/api/posts/${post_id}`).then(response => {
        if (response.status === 200) {
          setPostDetail(response.data.post)
          // fetchMoreCommentHandler(response.data.post._id)
        }
      })
    }
  }
  
  function fetchMoreCommentHandler(postId) {
    let {pageSize, currentPage} = { pageSize: 10, currentPage: 1 }
    api().get(`api/comments?post_id=${postId}&page_size=${pageSize}&current_page=${currentPage + 1}`).then(response=>{
      if(response.status === 200){
        let updatedPostDetail = {...postDetail}
        updatedPostDetail.comments = response.data.comments
        setPostDetail(updatedPostDetail)
        // setCommentPagination({
        //   ...commentPagination,
        //   currentPage: commentPagination.currentPage + 1
        // })
      }
    })
  }
  
  function likeDep(likes, lastLikeReaction) {
    let f = likes.findIndex(eachLike=>eachLike.reaction === lastLikeReaction)
    console.log(f)
    return f !== -1;
  }
  
  const renderPostWithMemoized = React.useMemo(()=> {
    return renderPost()
    // return  <div>
    //   <span>
    //     <h4>{Date.now().toString()}</h4>
    //     <h1 onClick={()=>setShowAddCommentForm(!showAddCommentForm)}>SADDLED</h1>
    //     <PostReaction post={post} authId={authId} toggleLikeHandler={toggleLikeHandler} />
    //   </span>
    // </div>
  }, [post._id, postDetail, post.likes.length, post.likes, likeDep(post.likes, lastLikeReaction)])
  
  function renderPost(){
    return (
      <div className="" key={post._id}>
        <div className="post_meta flex">
          <div className="flex flex-1">
            <div className="mr-1 w-10">
              <img style={{width: '100%'}} className="rounded-full" src={fullLink(post.author.avatar)} alt=""/>
            </div>
            <div className="w-full">
              <div className="flex flex-1 w-full justify-between items-center">
                <div className="flex flex-1">
                  <h4 className="text-primary font-400 mr-1">
                    <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link>
                  </h4>
                  <h4 className="mr-4 font-400">Timeline</h4>
                  {/*{Date.now().toString()}*/}
                </div>
                <i className="far fa-ellipsis-h cursor-pointer" />
              </div>
              <div className="flex items-center text-gray-light-6">
                <i className="text-xs fa fa-globe-americas mr-1" />
                <div className="text-xs font-400 ">Published:  Created on {new Date(post.createdAt).toDateString()}</div>
              </div>
            </div>
          </div>
        </div>
        
        {post.title && <h4 className="font-medium mt-1 mb-2" onClick={()=>onFetchPostDetail(post._id)}>{post.title}</h4>}

        <p className="post-content mb-0 mt-1 text-sm">
          {postDetail && postDetail._id === post._id ? postDetail.description : post.description.slice(0, 150)}
        </p>
        <a onClick={()=>onFetchPostDetail(post._id)} className="btn btn-a">{ postDetail && postDetail._id ? "Less" : "Read more"}</a>
  
        <PostReaction post={post} authId={authId} toggleReactionHandler={toggleReactionHandler} />
        
        <h3 onClick={()=>setShowAddCommentForm(!showAddCommentForm)} className="text-sm mt-4 mb-1 font-medium cursor-pointer">Write a Comment...</h3>

        {showAddCommentForm && <AddComment onSubmit={addCommentHandler} />}
        
        
        { postDetail.comments && renderComments(post._id, postDetail.comments, post.total_comments) }
      </div>
    )
  }
  
  return renderPostWithMemoized
  
}


export default Post