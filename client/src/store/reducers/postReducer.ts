import {singleQuote} from "tailwindcss/prettier.config";


const initialState = {
  posts: [],
  likes: []
}



export default function (state=initialState, action){
  let updatedState = {...state}
  let post_id;
  let index;
  switch (action.type){
    case "FETCH_POSTS":
      updatedState.posts = action.payload
      return updatedState
    
    case "FETCH_LIKES":
      updatedState.likes = action.payload
      return updatedState
    
     case "ADD_LIKE":
       post_id = action.payload.post_id
       console.log(updatedState.posts)
       index = updatedState.posts.findIndex(p=>p._id === post_id)
       if(index !== -1){
        updatedState.posts[index].likes.push({
          ...action.payload
        })
       }
      return updatedState
  
    case "UPDATE_LIKE":
      index = updatedState.posts.findIndex(p=>p._id === action.payload.post_id)
      if(index !== -1){
        if(updatedState.posts[index].likes) {
          let likeIndex = updatedState.posts[index].likes.findIndex(l => l.user_id === action.payload.user_id)
          if (likeIndex !== -1) {
            updatedState.posts[index].likes[likeIndex].reaction = action.payload.reaction
          }
        }
      }
      return updatedState
  
    case "REMOVE_LIKE":
       index = updatedState.posts.findIndex(p=>p._id === action.payload.post_id)
       if(index !== -1) {
         let post = updatedState.posts[index]
         if (post) {
           let filteredLikes = post.likes.filter(l => l.user_id !== action.payload.user_id)
           updatedState.posts[index] = {
             ...updatedState.posts[index],
             likes: filteredLikes,
           }
         }
       }
      return updatedState
    
    default:
      return state
  }
}

