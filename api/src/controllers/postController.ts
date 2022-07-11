import dbConnect from "../database";
import { parseToken} from "../jwt";
import response from "../response";
import { Response, Request } from "express";

import Post from "../models/Post";
import errorConsole from "../logger/errorConsole";
import {ObjectId} from "mongodb";
import {RequestWithAuth} from "../types/index";
import fileUpload from "../utilities/fileUpload";
import { copyFile, rm } from "fs/promises"
import path from "path";
import * as os from "os";
import slugify from "../utilities/slugify";


export const getAllPost = async (req: Request, res: Response)=>{

  try {
    let posts = await Post.aggregate([
        { $lookup: {
          from: "users",
          localField: "author_id",
          foreignField: "_id",
          as: "author"
        }
      },
      { $unwind: { path: "$author" } },
      { $lookup:
          { from: "comments",
            localField: "_id",
            foreignField: "post_id", as: "comments"
          }
      },
      { $addFields: { total_comments: {$size: "$comments" }}},
      // { $lookup:
      //   { from: "likes",
      //     localField: "_id",
      //     foreignField: "post_id", as: "likes"
      //   }
      // },
      { $lookup: {
          from: "likes",
          let: { "post_post_id": "$_id", "post_user_id": "$user_id" }, /// Collection variable
          pipeline: [
            { $match: { $expr: { $eq: ["$post_id", "$$post_post_id"] }}},
              { $lookup: {
                from: "users",
                let: { "userID": "$user_id" },
                pipeline: [
                  { $match: { $expr: { $eq: [ "$_id", "$$userID"] }}} // $$ up lookup field [like.user_id] that store var]
                ],
                as: "user"
              }}
          ],
          as: "likes"
        }
      },
      { $unwind: { path: "$likes.user" , preserveNullAndEmptyArrays: true }},
      { $addFields: { total_likes: {$size: "$likes" }}},
      {
        $project: {
          author: { password: 0 },
          comments: 0
        },
      }
    ])
    res.json({posts: posts})
  } catch (ex){
    res.json({posts: []})
  } finally {
  
  }
}


export const getAllPost2 = async (req: Request, res: Response)=>{
  let client;
  try {
    let {c: PostCOll, client: cc} = await dbConnect("posts")
    client = cc
    
    let cursor = PostCOll.find()
    let a = []
    await cursor.forEach(e=>{
      a.push(e)
    })
    // let posts = await Post2.aggregate([
    //     { $lookup: {
    //       from: "users",
    //       localField: "author_id",
    //       foreignField: "_id",
    //       as: "author"
    //     }
    //   },
    //   { $unwind: { path: "$author" } },
      // { $lookup:
      //     { from: "comments",
      //       localField: "_id",
      //       foreignField: "post_id", as: "comments"
      //     }
      // },
      // { $addFields: { total_comments: {$size: "$comments" }}},
      // // { $lookup:
      // //   { from: "likes",
      // //     localField: "_id",
      // //     foreignField: "post_id", as: "likes"
      // //   }
      // // },
      // { $lookup: {
      //     from: "likes",
      //     let: { "post_post_id": "$_id", "post_user_id": "$user_id" }, /// Collection variable
      //     pipeline: [
      //       { $match: { $expr: { $eq: ["$post_id", "$$post_post_id"] }}},
      //         { $lookup: {
      //           from: "users",
      //           let: { "userID": "$user_id" },
      //           pipeline: [
      //             { $match: { $expr: { $eq: [ "$_id", "$$userID"] }}} // $$ up lookup field [like.user_id] that store var]
      //           ],
      //           as: "user"
      //         }}
      //     ],
      //     as: "likes"
      //   }
      // },
      // { $unwind: { path: "$likes.user" , preserveNullAndEmptyArrays: true }},
      // { $addFields: { total_likes: {$size: "$likes" }}},
      
      // { $project: { author: { password: 0 }, comments: 0 }}
      
    // ])
    res.json({posts: a})
  } catch (ex){
   
    res.json({posts: []})
  } finally {
  
  
  }
}

export const savePost = async (req: RequestWithAuth, res: Response)=>{
  
  if(!req.user_id) return response(res, 409, "Not permit")
  
  try {
    let data = await fileUpload(req)
    const { description, title, is_public } = data.fields as any
    
    async function result(uploadedPhotos, video){
      let newPost: any = new Post({
        title: title || "",
        description: description || "",
        author_id: new ObjectId(req.user_id),
        images: uploadedPhotos.length > 0 ? uploadedPhotos : [],
        isPublic: !!is_public,
        video: video ? video : ""
      })
      newPost = await newPost.save()
      res.status(201).json(newPost)
    }
    

    let imageDir = path.resolve("static/images")
    if(data.files.photos){
      let photos = data.files.photos
      if (Array.isArray(photos)) {
        let p = []
        await photos.forEach((file, i)=> {
          (async function () {
            let newName = imageDir + "/" + photos.originalFilename
            await copyFile(file.filepath, newName)
            p.push("static/images/" + photos.originalFilename)
            if(i+1 === photos.length){
              await result(p)
            }
          }())

        })
      } else {
        await copyFile(photos.filepath, imageDir + "/" + photos.originalFilename)
        await result(["static/images/" + photos.originalFilename])
      }
    } else if(data.files.video) {
      let video = data.files.video
      await copyFile(video.filepath, imageDir + "/"+ slugify(video.originalFilename) + ".mp4")
      await result([], "static/images/" + slugify(video.originalFilename) + ".mp4")
    }
    
  } catch (ex){
      res.status(500).json({message: ex.message})
  }
  
  
  // let newPost: any = new Post({
  //   title: req.body.title || "",
  //   description: req.body.description || "",
  //   created_at: new Date(),
  //   updated_at: new Date(),
  //   author_id: new ObjectId(req.user_id)
  // })
  // newPost = await newPost.save()
  // console.log(newPost)
}

export const getPost = async (req: Request, res: Response)=>{
  try {
    let posts = await Post.aggregate([
      {$match: {_id: new ObjectId(req.params.post_id) }},
      { $lookup: {
        from: "users",
        localField: "author_id",
        foreignField: "_id",
        as: "author"
      }
    },
      { $unwind: { path: "$author" } },
      {$lookup:
          { from: "comments",
            localField: "_id",
            foreignField: "post_id", as: "comments"
          }
      },
      { $addFields: { total_comments: {$size: "$comments" }}},
      {$project: { author: { password: 0 }, comments: 0 }}
    ])

    response(res, 200, {
      post: posts[0],
        // comments: comments
      
    })
  } catch (ex){
    errorConsole(ex)
  }
}

