
import axios from "axios"



export let backend = "";

if(import.meta.env.DEV){
  backend = "http://192.168.43.170:1001"
  // backend = "http://localhost:1001"
} else{
  backend = "https://rsl-socket-app.herokuapp.com"
}



const token = window.localStorage.getItem("token")
const apis = axios.create({
  baseURL: backend,
  headers: {
    authorization: token,
  }
})

export default apis