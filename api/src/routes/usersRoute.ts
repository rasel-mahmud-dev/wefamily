
import controllers from "../controllers/index"
import isAuth from "../middlewares/isAuth";
import * as friendRequestController from "../controllers/friendRequestController";


export default function usersRoute(app){
  app.get("/api/peoples", isAuth, controllers.userController.getPeoples)
  // app.post("/api/users", controllers.userController.createNewUser)
  app.post("/api/registration", controllers.userController.createNewUser)
  app.get("/api/user/profile/:username", controllers.userController.fetchProfile)
  
  app.post("/api/user/add-friend", isAuth, controllers.userController.addFriend)
  app.delete("/api/user/unfriend/:friend_id", isAuth, controllers.userController.unFriend)
  
  app.post("/api/login", controllers.userController.loginUser)
  app.get("/api/current-auth", controllers.userController.loginViaToken)
  
  
  // get all specific friend
  app.get("/api/user/friends", isAuth, controllers.userController.getFriends)
  
  // get specific friend
  app.get("/api/user/friend", isAuth, controllers.userController.getFriend)
  
  // get user timeline all posts
  app.get("/api/user/posts", isAuth, controllers.userController.getTimelinePost)
  
  
  // send a friend Request...
  app.post("/api/add-friend-request", isAuth, controllers.friendRequestController.addFriendRequest)
  app.get("/api/get-requested-friends", isAuth, controllers.friendRequestController.getRequestedFriends)
  
  // get all current auth friends
  app.get("/api/all-friends", isAuth, controllers.userController.getAllFriends)
}