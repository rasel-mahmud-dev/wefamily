import React from 'react';

import { io } from  "socket.io-client"
import apis, {backend} from "src/apis";



// let socket  = io("ws://localhost:1001")

const HomePage = () => {
  
  const [message, setMessage] = React.useState("")
  
  
  React.useEffect(()=>{

    // socket.on("connect", () => {
    //   console.log("You Joined", socket.id)
    //   // either with send()
    //   socket.send("Hello!");
    //
    //   // receive event message that is emitted from server
    //   socket.on("message", data => {
    //     console.log(data);
    //   });
    //
    //   socket.on("all-message", (message)=>{
    //     console.log(message)
    //   })

    // });

  }, [])
  
  
  function sendMessageHandler(){
    
    // socket.emit("message", {
    //   type: "Send message from Client",
    //   message: message,
    //   id: socket.id,
    // })

    // handle the event sent with socket.send()
    
    
    // const socket = io("ws://localhost:1000/socket.io/");
    // console.log(socket)
    //
    // apis.get("/api/message").then(res=>{
    //   console.log(res)
    // })
  }
  
  
  return (
    <div className="container">
      <h1 className="">Send A Message via Socket.</h1>
      <input className="input-item" type="text" onChange={(e)=>setMessage(e.target.value)} />
      <button className="btn mt-2" onClick={sendMessageHandler}>Send</button>
    </div>
  );
};

export default HomePage;