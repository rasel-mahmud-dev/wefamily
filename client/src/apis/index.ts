
import axios from "axios"



export let backend = "";

if(import.meta.env.DEV){
  // backend = "http://192.168.122.224:1001"
  // backend = "https://rsl-socket-app.herokuapp.com"
  backend = "http://localhost:1001"
} else{
  backend = "https://wefamily-server.herokuapp.com"
}



const token = window.localStorage.getItem("token")
const apis = axios.create({
  baseURL: backend,
  headers: {
    authorization: token,
  }
})


export function api() {
  return axios.create({
    baseURL: backend,
    headers: {
      authorization: token,
    }
  })
}


export default apis