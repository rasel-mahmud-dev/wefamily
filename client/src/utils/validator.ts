
// @ts-ignore
export function validate(name?: string, value: string | number | object, schema: object, earlyAbort: boolean = true){
  let result: any = {}
  
  if(earlyAbort) {
    for (let schemaKey in schema) {
      if (schemaKey === name) {
        let schemas = schema[schemaKey]
        for (let schemasKey in schemas) {
          let fn = schemas[schemasKey]
          if (fn) {
          
            let errorMsg = fn(name, value)
            if (errorMsg) {
              result = errorMsg
            }
          }
        }
      }
    }
  } else {
  
    for (let schemaKey in schema) {
      let schemas = schema[schemaKey]
      for (let schemasKey in schemas) {
        let fn = schemas[schemasKey]

        if (fn) {
          let errorMsg = fn([schemaKey], value[schemaKey])
          if (errorMsg) {
            result[schemaKey] = errorMsg[schemaKey]
          } else {
            // delete all object that is already valid..
            delete result[schemaKey]
          }
        }
      }
    }
  }
  
  return Object.keys(result).length > 0 ? result : null
}

export function required(){
  return function (name: string, value: string | number){
    if(!value){
      return {[name]: name + " is required" }
    } else {
      return null
    }
  }
}

export function min(limit: number) {
  return function (name: string, value: string | number){
    let message = ""
    if(typeof value === "string"){
      message = value.length <  limit ? name + " should be greater than  " + limit +  " character " : ""
    } else {
      message = value < limit ? name + " should be greater than  " + limit : ""
    }
    return message ? {[name]: message} : null
  }
}

export function max(limit: number) {
  return function (name: string, value: string | number){
    let message = ""
    if(typeof value === "string"){
      message = value.length >  limit ? name + " should be less than " + limit + " character " : ""
    } else {
      message = value > limit ? name + " should be less than " + limit : ""
    }
    return message ? {[name]: message} : null
  }
}

export function email(){
  return function (name: string, value: string){
    let isMail = String(value)
      .toLowerCase()
      .match(
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/
      );
    return !isMail ? {[name]: "Bad email format"} : null
  }
}

export function text(){
  return function (name: string, value: string) {
    let res = !isNaN(Number(value)) ? {[name]: name +" should be text"} : null
    return res
  }
}

