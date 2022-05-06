
import Base from"./Base";
import Joi from "joi";

class Status extends Base{
	
	static tableName = "status"
	constructor({ _id="", socket_id, user_id, last_active_date, isActive, updated_at }) {
		super("status")
		this._id = _id
		this.user_id = user_id
		this.socket_id = socket_id
		this.isActive = isActive
		this.last_active_date = last_active_date
		this.updated_at = updated_at
	}
	
	// validationBeforeSave(callback) {
	// 	let { tableName, ...otherValue } = this
	// 	let user = Joi.object({
	// 		username: Joi.string().required(),
	// 		first_name: Joi.string().required(),
	// 		last_name: Joi.optional(),
	// 		email: Joi.string().email().required(),
	// 		created_at: Joi.date().required(),
	// 		avatar: Joi.optional(),
	// 		updated_at: Joi.date().required(),
	// 		password: Joi.string().required()
	// 	})
		
		// let isError = user.validate(
		// 	otherValue,
		// 	{abortEarly: false}
		// )
		// if(isError.error){
		// 	let r = {}
		// 	for (const detail of isError.error.details) {
		// 		r[detail.path[0]] = detail.message
		// 	}
		// 	callback(r)
		// } else {
		// 	callback(null)
		// }
	// }
	
	
	
	//? overwrite in Base class save method...
	// save() {
	//   console.log("hello")
	// }
}

export default Status