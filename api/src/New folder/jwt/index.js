import jwt from 'jsonwebtoken'

export const createToken = (data)=> {
  return jwt.sign(data, process.env.SECRET, {expiresIn: '5h'})
}


export const parseToken = (token)=> {
   return new Promise(async (resolve, reject)=>{
     try {
       if(token) {
         let d = await jwt.verify(token, process.env.SECRET)
         resolve(d)
       } else {
        reject(new Error("token not found"))
       }
     } catch (ex){
       reject(ex)
     }
   })
         
}

export const getToken = (req)=> {
  return req.headers["authorization"]
}


