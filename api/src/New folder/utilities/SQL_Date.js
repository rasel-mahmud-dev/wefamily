function SQL_Date(){
  let now = new Date()
  let d = now.toISOString()
  let date = d.slice(0, 10)
  let time = now.toTimeString().slice(0, 8)
  return date + " " + time
}

export default SQL_Date