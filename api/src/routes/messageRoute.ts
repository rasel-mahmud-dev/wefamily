import controllers from "../controllers"

import isAuth from "../middlewares/isAuth";


export default function usersRoute(app){
  
  // query to = ObjectID
  app.get("/api/messages", isAuth, controllers.messageController.getMessage)
  
  
  app.post("/api/fetch-one-messages", isAuth, controllers.messageController.getOneMessage)
  
  app.delete("/api/message/:message_id", isAuth, controllers.messageController.deleteMessage)

}