

import Base from"./Base";
import Joi from "joi";


export interface PostType {
  _id: string
  title: string
  author_id: string
  summary: string
  created_at: string
  updated_at: string
  slug: string
  cover?: string
  path: string
  tags: string[]
}

export interface PostWithAuthorType extends PostType{
  author: {
    _id: string,
    first_name: string,
    last_name: string,
    email: string,
    avatar: string,
    role: string,
    cover: string,
    username: string,
  }
}


class Post extends Base{
  
  static collectionName = "posts"
  _id: string
  title: string
  author_id: string
  description: string
  created_at: string
  updated_at: string
  
  constructor({ title, author_id, description, created_at, updated_at }) {
    super("posts")
    this._id = ""
    this.title = title
    this.author_id = author_id
    this.description = description
    this.created_at = created_at
    this.updated_at = updated_at
  }
  
  // @ts-ignore
  // validationBeforeSave() {
  //   let { collectionName, ...otherValue } = this
  //   return new Promise((resolve, reject)=>{
  //     let user = Joi.object({
  //       _id: Joi.optional(),
  //       title: Joi.string().required(),
  //       slug: Joi.string().required(),
  //       path: Joi.string().required(),
  //       author_id: Joi.any().required(),
  //       summary: Joi.string().required(),
  //       cover: Joi.optional(),
  //       tags: Joi.array().required(),
  //       updated_at: Joi.date().required(),
  //       created_at: Joi.date().required()
  //     })
  //     let isError = user.validate(
  //       otherValue,
  //       {abortEarly: false}
  //     )
  //     if(isError.error){
  //       let r = {}
  //       for (const detail of isError.error.details) {
  //         r[detail.path[0]] = detail.message
  //       }
  //       resolve(r)
  //     } else {
  //       resolve(null)
  //     }
  //   })
  // }
  
  //? overwrite in Base class save method...
  // save() {
  //   console.log("hello")
  // }
}

export default Post