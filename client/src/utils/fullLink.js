import {backend} from "../apis";

export default function (link){
  if(link && link.startsWith("static")){
    return backend + "/" + link
  } else {
    return link
  }
}