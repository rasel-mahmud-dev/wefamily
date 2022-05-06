
import Base from"./Base";
import errorConsole from "../logger/errorConsole";
import dbConnect from "../../database";

class Message extends Base{
  
  static collectionName = "messages"
  constructor({ _id="", text, to, from, room, created_at}) {
    super("messages")
    this._id = _id,
    this.text = text
    this.to = to
    this.from = from,
    this.room = room,
    this.created_at = created_at
  }
  
  // validationBeforeSave(callback) {
  //   let { collectionName, ...otherValue } = this
  //   let user = Joi.object({
  //     username: Joi.string().required(),
  //     first_name: Joi.string().required(),
  //     last_name: Joi.optional(),
  //     email: Joi.string().email().required(),
  //     created_at: Joi.date().required(),
  //     avatar: Joi.optional(),
  //     updated_at: Joi.date().required(),
  //     password: Joi.string().required()
  //   })
  //
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
  
  
  // ? overwrite in Base class save method...
  save() {
    const {collectionName, ...otherMsg} = this
    return new Promise(async (resolve, reject)=>{
      let client;
      try {
        let {c: MessageCol, client: cc} = await dbConnect(collectionName)
        client = cc
        
        let doc = await MessageCol.insertOne(otherMsg)
        if(doc.insertedId){
          resolve({...otherMsg, _id: doc.insertedId})
        } else {
          reject("message not saved")
        }
        
      } catch (ex){
        errorConsole(ex)
      } finally {
        client?.close()
      }
    })
  }
}

export default Message
