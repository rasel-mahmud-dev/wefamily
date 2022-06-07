import Base from"./Base";


class Like extends Base{
  
  static collectionName = "likes"
  
  _id?: string
  user_id: string
  post_id: string
  reaction: "LIKE" | "HAHA" | "SAD" | "LOVE"
  created_at: Date
  
  constructor({ _id="", post_id, user_id, reaction }) {
    super(Like.collectionName)
    this._id = ""
    this.user_id = user_id
    this.post_id = post_id
    this.reaction = reaction
    this.created_at = new Date
  }
  
  // validationBeforeSave() {
  //   let vals = this.saveFieldDatabase()
  //
  //   return new Promise((resolve, reject)=>{
  //
  //     let user = Joi.object({
  //       reaction: Joi.string().required(), // ["LIKE", "HAHA", "SAD", "LOVE"]
  //       user_id: Joi.object().required(),
  //       post_id: Joi.object().required(),
  //       created_at: Joi.date()
  //     })
  //
  //     let isError = user.validate(
  //       vals,
  //       {abortEarly: false}
  //     )
  //     if(isError.error){
  //       let r = {}
  //       for (const detail of isError.error.details) {
  //         r[detail.path[0]] = detail.message
  //       }
  //       reject(r)
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

export default Like