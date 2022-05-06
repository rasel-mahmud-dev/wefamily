import { parseToken} from "../jwt";
import response from "../response";

function isAuth(req, res, next){
  let token = req.headers["token"]
  if(!token){
    req.user_id = null
    return response(res, 404, "please login first")
  }
  parseToken(token).then(u=>{
    req.user_id = u.id
    req.user_email = u.email
    next()
  }).catch(err=>{
    req.user_id = null
    response(res, 404, "please login first")
  })
}

export default isAuth