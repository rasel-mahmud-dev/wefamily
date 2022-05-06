import usersRoute  from "./usersRoute"
import postsRoute  from "./postsRoute"
import messageRoute  from "./messageRoute"
import statusRouter  from "./statusRouter"

export default function (app){
  usersRoute(app)
  postsRoute(app)
  statusRouter(app)
  messageRoute(app)
  
  app.get("/", (req, res)=>{
    console.log("dsf")
    res.send("hi")
  })
  
}