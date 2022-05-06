import React from 'react';
import fullLink from "src/utils/fullLink";




const Messages = (props) => {
  let { _id, appState, primateMessage, onDeleteMessage, room, textMsg } = props
  
  
  let renderMemoized = React.useMemo(()=>{
    return renderMessages()
  }, [_id, appState, room])
  
  
  function renderMessages(){
    return (
      <div>
        <div className="recent-chat-message mt-2 overflow-y-auto">
          {primateMessage && primateMessage.map((msg, i)=>(
            <div key={i} className={["msg flex items-start mt-1.5", msg.from._id === _id ? "own-msg": ""].join(" ")}>
              <img className="w-5 md:w-8 radius-100% mr-2" src={fullLink(msg.from.avatar)} alt=""/>
              <div className="msg-text">
                <div className="rounded min-w-100px px-2 py-1 bg-primary bg-opacity-10">
                  <p>{msg.text}</p>
                </div>
                <span className="text-xs">
                  { msg.from._id === _id && (<div>
                      <i onClick={()=>onDeleteMessage(msg._id)} className="cursor-pointer far fa-trash" />
                    </div>
                  )}
                {/*{Date.now().toString().slice(8)}*/}
              </span>
                {/*<span className="text-xs font-medium mt-0.5">{new Date(msg.created_at).toDateString()}</span>*/}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return renderMemoized
  
};

export default Messages;