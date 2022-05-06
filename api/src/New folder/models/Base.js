import errorConsole from "../logger/errorConsole";
import dbConnect from "../database";


class Base {
  tableName = "";
  constructor(tableName) {
    // when call with new keyword extend classes...
    this.tableName = tableName
  }
  
  save(){
    return new Promise(async (resolve, reject)=>{
      let client;
  
      try{
        let { tableName, databaseSaveFields, _id, ...other} = this
        let { c: Collection,  client:cc} = await dbConnect(tableName)
        client = cc
        if(this.validationBeforeSave){
          let err = await this.validationBeforeSave()
          if (err){
            return reject({type: "VALIDATION_ERROR", errors: err})
          }
          
          let newInserted = await Collection.insertOne(other)
          other._id = newInserted.insertedId
          resolve(other)
          
          
        } else {
  
          let newInserted = await Collection.insertOne(other)
          other._id = newInserted.insertedId
          resolve(other)
        }
      } catch (ex) {
        errorConsole(ex)
      } finally {
      
      }
    })
  }
  
  
  static getCollection(){
    return new Promise(async (resolve, reject)=>{
      try{
        let tableName = this.tableName
        let {c, client } = await dbConnect(tableName)
        resolve({Collection: c, client})
        
      } catch (ex){
        reject(ex)
        errorConsole(ex)
      }
    })
  }
  
  // static getCollection(collectionName){
  //   return new Promise(async (resolve, reject)=>{
  //   try {
  //
  //     // let {c, client} = await dbConnect(collectionName ? collectionName : Base.collectionName)
  //     // resolve({collection: c, client: client})
  //
  //     } catch (ex){
  //       reject({collection: undefined, client: undefined})
  //     }
  //   })
  // }

  // static async dbConnect(collectionName){
//   return new Promise(async (resolve, reject)=>{
//     try {
//       let { c, client} = await dbConnect(collectionName)
//       resolve({collection: c, client: client})
//     } catch (ex){
//       reject(ex)
//     }
//   })
// }
  
//   static insertInto(values){
//   return new Promise<mongoDB.InsertOneResult>(async (resolve, reject)=>{
//     let client;
//     try {
//
//       let {collection, client: cc} = await this.dbConnect(this.collectionName)
//       client = cc
//       if(values) {
//         let {_id, ...other} = values
//         let cursor = await collection?.insertOne({
//           ...other,
//           created_at: new Date(),
//           updated_at: new Date()
//         })
//
//         resolve(cursor)
//       }
//       // console.log(cursor, other)
//       client?.close()
//
//     } catch (ex){
//       client?.close()
//       reject(new Error(ex.message))
//     } finally {
//       client?.close()
//     }
//   })
// }

static update(find, query){
  return new Promise(async (resolve, reject)=> {
    let client;
    try {
      let tableName = this.tableName
      let {c: collection, client: cc } = await dbConnect(tableName)
      client = cc
   
      let cursor = await collection?.updateOne(find, query)
      if(cursor.modifiedCount > 0){
        resolve(true)
      } else {
        resolve(false)
      }
    } catch (ex){
      resolve(false)
    } finally {
      client?.close()
    }
  })
}

// static deleteById(id: string){
//
//   return new Promise<mongoDB.DeleteResult>(async (resolve, reject)=> {
//     if(id){
//       let client;
//       try {
//         let {collection, client: cc} = await Base.dbConnect(this.collectionName)
//         client = cc
//         let doc = await collection.deleteOne({_id: new ObjectId(id)})
//         resolve(doc)
//       } catch (ex) {
//         reject(new Error(ex.message))
//       } finally {
//         client?.close()
//       }
//     } else {
//       reject(new Error("please provide id"))
//     }
//   })
//
// }
  
  static findOne(match={}, selectFields) {
    return new Promise(async (resolve, reject) => {
      let client
      try{
        let tableName = this.tableName
        let {c: collection, client: cc } = await dbConnect(tableName)
        client = cc;
        let user = await collection.findOne(match)
        if(user){
          resolve(user)
        } else {
          resolve(null)
        }
      } catch (ex){
        reject(ex)
        errorConsole(ex)
      } finally {
        client?.close()
      }
    })
  }

  static removeOne(match={}){
    return new Promise(async (resolve, reject) => {
      let client;
      try{
        let {c: Collection, client: cc} = await dbConnect(this.tableName)
        client = cc
        
        let doc = await Collection.deleteOne(match)
        if(doc.deletedCount){
          resolve(true)
        }else {
          resolve(false)
        }
        
      } catch (ex){
        errorConsole(ex)
        reject(ex)
      } finally {
        client?.close()
      }
    })
  }
  
  static async find(match={}){
    
    return new Promise(async (resolve, reject)=>{
      let client;
      try {
        let { c: User, client: cc } = await dbConnect(this.tableName)
        client = cc;
        let cursor = User.find(match)
        
        let users = []
        await cursor.forEach(usr=>{
          users.push(usr)
        })
        resolve(users)
      } catch (ex){
        errorConsole(ex)
        reject(ex)
      }
      finally{
        client?.close()
      }
    })
  }

  static aggregate(pipeline){
    return new Promise(async (resolve, reject)=>{
      let client;
      try {
        let { c: collection, client: cc } = await dbConnect(this.tableName)
        client = cc
        let cursor = collection?.aggregate(pipeline)
        
        let products = []
        await cursor.forEach(p=>{
          products.push(p)
        })
        resolve(products)
        client?.close()
  
      } catch (ex){
        reject(new Error(ex))
      }
      finally {
        client?.close()
      }
    })
  }

}

export default  Base