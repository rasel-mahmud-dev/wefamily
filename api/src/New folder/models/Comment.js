
import Base from"./Base";
import Joi from "joi";


class Comment extends Base{
  
  static tableName = "comments"
  
  databaseSaveFields = {}
  
  constructor({_id="", text, user_id, post_id, created_at, parent_id }) {
    super("comments")
    this._id = ""
    this.text = text
    this.user_id = user_id
    this.post_id = post_id
    this.created_at = created_at
    this.parent_id = parent_id
  }
  
  saveFieldDatabase(){
    this.databaseSaveFields = {
      text: this.text,
      user_id: this.user_id,
      post_id: this.post_id,
      created_at: this.created_at,
      parent_id: this.parent_id
    }
    return this.databaseSaveFields
  }

  
  validationBeforeSave() {
    let vals = this.saveFieldDatabase()
    
    return new Promise((resolve, reject)=>{

    let user = Joi.object({
      text: Joi.string().required().max(500),
      user_id: Joi.string().required(),
      post_id: Joi.string().required(),
      created_at: Joi.date(),
      parent_id: Joi.any()
    })

    let isError = user.validate(
      vals,
      {abortEarly: false}
    )
    if(isError.error){
      let r = {}
      for (const detail of isError.error.details) {
        r[detail.path[0]] = detail.message
      }
      reject(r)
    } else {
      resolve(null)
    }
    })
  }
  
  //? overwrite in Base class save method...
  // save() {
  //   console.log("hello")
  // }
}

export default Comment