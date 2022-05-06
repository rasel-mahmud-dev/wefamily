

```jsx

// our base class
const dbConnect = require("../database/dbConnect")

const logger = require("../logger");

class Base {
    tableName = "";
    constructor(tableName) {
        // when call with new keyword extend classes...
        this.tableName = tableName
    }
    
    save(){
        return new Promise(async (resolve, reject)=>{
          try{
            let { tableName, ...otherValue } = this
            this.validationBeforeSave( async (err)=>{
              if(err){
                return reject({type: "VALIDATION_ERROR", errors: err})
              }
              let values = '';
              let fields = ''
              
              for (const otherValueKey in otherValue) {
                if(otherValueKey) {
                  fields += otherValueKey + ", "
                  values += `'${otherValue[otherValueKey]}'` + ","
                }
              }
              
              let trimLastComma = (value, negationIndex)=>
                value.slice(0, value.length - negationIndex)
              
              try {
                let db = await dbConnect()
                
                let sql = `
                    INSERT INTO ${tableName} (${trimLastComma(fields, 2)})
                    VALUES (${trimLastComma(values, 1)})
                `
                let [r, _] = await db.execute(sql)
                if(r.affectedRows > 0){
                  resolve({
                    ...otherValue,
                    id: r.insertId
                  })
                }
              } catch (ex) {
                if(ex.code === "ER_DUP_ENTRY"){
                  reject({
                    type: "ER_DUP_ENTRY",
                    message: ex.sqlMessage
                  })
                  logger.error(ex.message)
                }
              }
            })
          
          } catch (ex){
            reject(ex)
          }
        })
    }
      
    static deleteById(id){
    
    }
    static findOne(attr){
    
    }
    
    static findOne(valuesObj) {
        return new Promise(async (resolve, reject) => {
          let db
          try{
            db = await dbConnect()
            let tableName = this.tableName
            
            let fieldName = ""
            let value = ""
            for(let key in valuesObj){
              fieldName = key
              value = valuesObj[key]
            }
            
            let sql  = `SELECT * from ${tableName} where ${fieldName} = "${value}"  `
            
            let [r, _] = await db.execute(sql)
            if(r.length > 0){
              resolve(r[0])
            } else {
              resolve(null)
            }
          } catch (ex){
            reject(ex)
            console.log(ex)
          } finally {
            db?.end()
          }
        })
    }
}


// User model class that create read update delete user.

const dbConnect = require("../database/dbConnect");

const Base = require("./Base");
const Joi = require("joi");

class User extends Base{
  
  static tableName = "users"
  constructor({ first_name, last_name, username, email, password, created_at, updated_at, avatar }) {
    super("users")
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

// use cases

exports.createNewUser = async (req, res, next)=>{
  try {
    let date = SQL_Date()
    let {first_name, last_name, email, password } = req.body
    let user = await User.findOne({email})
    if(user) return res.send("user already registered")
    
    let salt = await bcryptjs.genSalt(10);
    let hashedPass = await bcryptjs.hash(password, salt)
    user = new User({
      first_name,
      last_name,
      email,
      password: hashedPass,
      avatar: "",
      username: first_name + " " + last_name,
      created_at: date,
      updated_at: date
    })
    user = await user.save()
    if(user){
      let token = await createToken(user.id, user.email)
      res.json({
        token: token,
        ...user
      })
    }
  
  } catch (ex){
    errorConsole(ex)
    if(ex.type === "VALIDATION_ERROR"){
      response(res, 422, ex.errors)
    } else if(ex.type === "ER_DUP_ENTRY"){
      response(res, 409, "user already exists")
    } else {
      next(ex)
    }
  }
}

````

