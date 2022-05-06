function errorConsole(ex){
  if(process.env.NODE_ENV === "development"){
    console.error(ex)
  }
}


export default errorConsole