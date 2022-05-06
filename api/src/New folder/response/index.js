

function response(res, status=200, message){
  let resp = {}
  if(typeof message === "string"){
    resp = { message: message }
  } else {
    resp = message
  }
  res.status(status).json(resp)
}

export default  response