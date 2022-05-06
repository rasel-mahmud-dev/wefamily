
import Base from"./Base";
import Joi from "joi";

class User extends Base{
  
  static tableName = "users"
  constructor({ _id = "", first_name, last_name, username, email, password, created_at, updated_at, avatar }) {
    super("users")
    this._id = _id,
    this.first_name = first_name
    this.last_name = last_name
    this.username = username
    this.email = email
    this.password = password
    this.created_at = created_at
    this.updated_at = updated_at
    this.avatar = avatar
  }
  
  validationBeforeSave(callback) {
    let { tableName, ...otherValue } = this
    let user = Joi.object({
      username: Joi.string().required(),
      first_name: Joi.string().required(),
      last_name: Joi.optional(),
      email: Joi.string().email().required(),
      created_at: Joi.date().required(),
      avatar: Joi.optional(),
      updated_at: Joi.date().required(),
      password: Joi.string().required()
    })
    
    let isError = user.validate(
      otherValue,
      {abortEarly: false}
    )
    if(isError.error){
      let r = {}
      for (const detail of isError.error.details) {
        r[detail.path[0]] = detail.message
      }
      callback(r)
    } else {
      callback(null)
    }
  }
  
  
  //? overwrite in Base class save method...
  // save() {
  //   console.log("hello")
  // }
}

export default User