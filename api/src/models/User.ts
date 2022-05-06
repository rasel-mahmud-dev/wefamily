
import Base from"./Base";
import Joi from "joi";

interface a{
  name: string
}




class User extends Base{
  
  static collectionName = "users"
  
  _id?: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  avatar: string;
  
  constructor({ _id = "", first_name, last_name, username, email, password, avatar }) {
    super("users")
    this._id = _id,
      this.first_name = first_name
    this.last_name = last_name
    this.username = username
    this.email = email
    this.password = password
    this.created_at = new Date()
    this.updated_at = new Date()
    this.avatar = avatar
  }
  
  
  // // @ts-ignore
  // validationBeforeSave() {
  //   return new Promise<any>(async (resolve, reject)=>{
  //     let { collectionName, _id,  ...otherValue } = this
  //     let user = Joi.object({
  //       first_name: Joi.string().required(),
  //       username: Joi.string().required(),
  //       last_name: Joi.optional(),
  //       facebookId: Joi.optional(),
  //       googleId: Joi.optional(),
  //       email: Joi.string().email().required(),
  //       created_at: Joi.date().required(),
  //       avatar: Joi.optional(),
  //       role: Joi.string().required(),
  //       updated_at: Joi.date().required(),
  //       password: Joi.string().required()
  //     })
  //
  //     let isError = user.validate(otherValue,{abortEarly: false})
  //
  //     if(isError.error){
  //       let r = {}
  //       for (const detail of isError.error.details) {
  //         r[detail.path[0]] = detail.message
  //       }
  //       resolve(r)
  //     } else {
  //       resolve(false)
  //     }
  //   })
  // }
  //
  
  //? overwrite in Base class save method...
  // save() {
  //   console.log("hello")
  // }
}

export default User