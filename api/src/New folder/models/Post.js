import dbConnect from "../database";



import Base from"./Base";
import Joi from "joi";


class Post extends Base{
  
  static tableName = "posts"
  constructor({ title, author_id, description, created_at, updated_at }) {
    super("posts")
    this._id = ""
    this.title = title
    this.author_id = author_id
    this.description = description
    this.created_at = created_at
    this.updated_at = updated_at
  }
  //
  // validationBeforeSave(callback) {
  //   let { tableName, ...otherValue } = this
  //   let user = Joi.object({
  //     title: Joi.string().required(),
  //     author_id: Joi.string().required(),
  //     description: Joi.string().required(),
  //     email: Joi.string().email().required(),
  //     updated_at: Joi.date().required(),
  //     password: Joi.string().required()
  //   })
  //   let isError = user.validate(
  //     otherValue,
  //     {abortEarly: false}
  //   )
  //   if(isError.error){
  //     let r = {}
  //     for (const detail of isError.error.details) {
  //       r[detail.path[0]] = detail.message
  //     }
  //     callback(r)
  //   } else {
  //     callback(null)
  //   }
  // }
  
  //? overwrite in Base class save method...
  // save() {
  //   console.log("hello")
  // }
}

export default Post