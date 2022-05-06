
import Base from"./Base";
import Joi from "joi";


class Like extends Base{
	
	static tableName = "likes"
	
	databaseSaveFields = {}
	
	constructor({_id="", user_id, post_id, reaction, created_at}) {
		super("likes")
		this._id = ""
		this.user_id = user_id
		this.post_id = post_id
		this.reaction = reaction
		this.created_at = created_at
	}
	
	saveFieldDatabase(){
		this.databaseSaveFields = {
			user_id: this.user_id,
			post_id: this.post_id,
			reaction: this.reaction,
			created_at: this.created_at
		}
		return this.databaseSaveFields
	}
	
	
	validationBeforeSave() {
		let vals = this.saveFieldDatabase()
		
		return new Promise((resolve, reject)=>{
			
			let user = Joi.object({
				reaction: Joi.string().required(), // ["LIKE", "HAHA", "SAD", "LOVE"]
				user_id: Joi.object().required(),
				post_id: Joi.object().required(),
				created_at: Joi.date()
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

export default Like