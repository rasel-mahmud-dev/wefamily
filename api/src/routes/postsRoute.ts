import controllers from "../controllers"

import getAuthID from "../middlewares/getAuthID"
import isAuth from "../middlewares/isAuth";
import {toggleLike} from "../controllers/likeController";

export default function routes(app){
  app.get("/api/posts/:post_id", isAuth, controllers.postController.getPost)
  
  app.get("/api/posts",  controllers.postController.getAllPost)
  app.get("/api/posts2",  controllers.postController.getAllPost2)
  
  app.post("/api/post", isAuth, controllers.postController.savePost)

  app.post("/api/toggle-like", isAuth, controllers.likeController.toggleLike)
  // app.post("/api/remove-like", isAuth, controllers.likeController.removeLike)
  //
  //
  app.post("/api/add-comment", isAuth, controllers.commentController.addComment)
  // app.get("/api/comment-count", isAuth, controllers.commentController.countComment)
  //
  //
  // // need params post_id or parent_id of comment
  app.get("/api/comments", isAuth, controllers.commentController.getComments)
  // app.delete("/api/comments/:comment_id", isAuth, controllers.commentController.removeComment)
}
