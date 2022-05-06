
import User from "../models/User";
import {createToken, parseToken} from "../jwt";
const bcryptjs = require("bcryptjs")
import response from "../response";
import errorConsole from "../logger/errorConsole";
import {ObjectId} from "mongodb";
import dbConnect from "../database";

import { Request, Response }  from "express"
import saveLog from "../logger/saveLog";

/**
  query params need pass => for [ "add_friend_able" ]
 */

export const getPeoples = async (req: Request, res: Response)=>{
  
  let _id = req.user_id
  let { type } = req.query
  
  try {
    let users: any;
    let auth: any = await User.findOne({_id: new ObjectId(_id)})
    let skip = []
    
    if(auth.friends) {
      skip.push(...auth.friends)
    }
    skip.push(auth._id)
    
    
    if(type === "add_friend_able") {
      users = await User.aggregate([
        {
          $match: {
             _id:{ $nin: [...skip] }
          }
        },
      ])
    } else {
      users = await User.find({_id: {$not: {$eq: new ObjectId(_id)}}})
    }
    
    res.send(users)
    
  } catch (ex){
    errorConsole(ex)
  }
}

export const createNewUser = async (req, res, next)=>{
  try {
    let date = new Date()
    let {first_name, last_name, email, password } = req.body
    let user: any = await User.findOne({email})
    
    if(user) {
      saveLog("user already registered", req.url, req.method)
      return response(res, 409, "user already registered")
    }

    let salt = await bcryptjs.genSalt(10);
    let hashedPass = await bcryptjs.hash(password, salt)
    user = new User({
      first_name,
      last_name,
      email,
      password: hashedPass,
      avatar: "",
      username: first_name + " " + last_name
    })
    user = await user.save()
    if(user){
      let token = await createToken(user._id, user.email)
      res.json({
        token: token,
        ...user
      })
    }

  } catch (ex){
    saveLog(ex?.message, req.url, req.method)
    
    if(ex.type === "VALIDATION_ERROR"){
      response(res, 422, ex.errors)
    } else if(ex.type === "ER_DUP_ENTRY"){
      response(res, 409, "user already exists")
    } else {
      // next(ex)
    }
  }
}

export const loginUser = async (req: Request, res: Response)=>{
  try {
    const { email, password } = req.body
    let user: any = await User.findOne({email})
 
    if(user){
      let match = await bcryptjs.compare(password, user.password)
      if(!match)  return res.json({message: "Password not match"})

      let token: any = await createToken(user._id,  user.email)
      let {password : s, ...other} = user
      res.json({token: token, ...other})
    } else {
      saveLog("user not register yet", req.url, req.method)
      response(res, 404, "your are not registered")
    }

  } catch (ex){
    saveLog(ex?.message, req.url, req.method)
  }
}


export const loginViaToken = async (req: Request, res: Response)=>{
  
  try {
    let token = req.headers["authorization"]
    
    if(!token) return response(res, 409, "token not found")
    
    let {id, email} =  await parseToken(token)

    let user : any = await User.aggregate([
      { $match: {_id: new ObjectId(id)}},
      { $lookup: {
        from: "status",
        localField: "_id",
        foreignField: "user_id",
        as: "user_status"
      }},
      { $unwind: { path: "$user_status", preserveNullAndEmptyArrays: true } }
    ])
    
    if(user && user[0]) {
      let {password, ...other} = user[0]
      response(res, 200, other)
    }
  } catch (ex){
    errorConsole(ex)
    return response(res, 500, ex.message)
  }
}

export const fetchProfile = async (req: Request, res: Response)=>{
  let {username} = req.params
  try{
    let user: any = await User.findOne({username})
    if(user){
      let {password, ...other} = user
      res.json({profile: other})
    }
    
  } catch (ex){
    errorConsole(ex)
  }
}


export const addFriend = async (req: Request, res: Response)=>{
  let {  friend_id } = req.body
  let _id = req.user_id
  let client;
  try{
    let user: any = await User.findOne({_id: new ObjectId(_id)})
    let { c: Collection, client: cc } = await User.getCollection()
    client = cc
    let d = await Collection.updateOne(
      {_id: new ObjectId(user._id) },
      {
        $addToSet: {
          friends: new ObjectId(friend_id)
        }
      }
    )
    let dd = await Collection.updateOne(
      {_id: new ObjectId(friend_id) },
      {
        $addToSet: {
          friends: new ObjectId(_id)
        }
      }
    )
    
    if(d.modifiedCount && dd.modifiedCount){
      let u = await User.aggregate([
        {$match: { _id: new ObjectId(friend_id)} },
        {
          $lookup: {
            from: "users",
            localField: "friends",
            foreignField: "_id",
            as: "f"
          }
        }
      ])
      console.log(u)
      res.status(201).json({newFriend: u })
    } else {
      response(res, 304, "Add Friend Fail")
    }
    
  } catch (ex){
    errorConsole(ex)
  } finally {
    client?.close()
  }
}



export const unFriend = async (req: Request, res: Response)=>{
  let { friend_id } = req.params
  let _id = req.user_id
  

  let client, session
  try{
    
    let { c: userCol, client: cc}  = await dbConnect("users")
    client = cc
    
      // Important:: You must pass the session to the operations
      await userCol.updateOne(
        {_id: new ObjectId(_id)},
        {$pull: { friends: new ObjectId(friend_id)  }}
      )

      // await userCol.update(
      //   {_id: new ObjectId(friend_id)},
      //   {$pull: { friends: new ObjectId(_id)  }}
      // )
    
    response(res, 201, { friend_id })
    
  } catch (ex){
    
    errorConsole(ex)
  } finally {

    await client?.close()
  }
}




export const getFriend = async (req: Request, res: Response)=>{
  
  let _id = req.user_id
  let client;
  
  let { friend_id } = req.query
  
  try{
    
    let u = await User.aggregate([
      {$match: { _id: new ObjectId(friend_id)} },
      {
        $lookup: {
          from: "status",
          localField: "_id",
          foreignField: "user_id",
          as: "user_status"
        }
      },
      { $unwind: { path: "$user_status", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "friends",
          foreignField: "_id",
          as: "allFriends"
        }
      }
    ])
    
    res.status(200).json({friend: u[0]})
    
  
  } catch (ex){
    errorConsole(ex)
  } finally {
    // client?.close()
  }
}




export const getAllFriends = async (req: Request, res: Response)=>{
  
  let _id = req.user_id
  let client;
  
  try {
    let u = await User.aggregate([
      { $match: { _id: new ObjectId(_id) } },
      {
        $lookup: {
          from: "users",
          localField: "friends",
          foreignField: "_id",
          as: "all_friends"
        }
      }
    ])
    res.send(u[0])
  } catch (ex){
  
  }
}



export const getFriends = async (req: Request, res: Response)=>{
  
  let _id = req.user_id
  let client;
  
  try{
   
   let u = await User.aggregate([
 
     {
       $lookup: {
         from: "status",
         localField: "_id",
         foreignField: "user_id",
         as: "user_status"
       }
     },
     { $unwind: { path: "$user_status", preserveNullAndEmptyArrays: true } },
      {$match: {  friends: { $in: [ new ObjectId(_id) ]} }  },
     
     // {
     //   $lookup: {
     //     from: "users",
     //     localField: "friends",
     //     foreignField: "_id",
     //     as: "allFriends"
     //   }
     // },
     // {
     //   $project: {
     //     allFriends: {
     //       s: 1,
     //       _id: 1,
     //       avatar: 1,
     //       first_name: 1,
     //       last_name: 1,
     //       username: 1,
     //       isOnline: 1
     //     }
     //   }
     // }
    ])

   res.json({allFriends: u})
   
  } catch (ex){
    errorConsole(ex)
  } finally {
    client?.close()
  }
}

export const getTimelinePost = async (req: Request, res: Response)=>{
  
  let _id = req.user_id
  let client;
  
  try{
   
   let u = await User.aggregate([
      {$match: { _id: new ObjectId(_id)} },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "author_id",
          as: "allPosts"
        }
      },
     {
       $project: {
         allPosts: {
           title: 1
         }
       }
     }
    ])
    
    res.status(200).json({allPosts: u[0].allPosts })
    
  } catch (ex){
    errorConsole(ex)
  } finally {
    client?.close()
  }
}
