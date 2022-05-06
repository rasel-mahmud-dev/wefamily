import Base from"./Base";

class Status extends Base{
  static collectionName = "status"
  
  _id?: string
  user_id: string
  socket_id: string
  is_online: boolean
  last_online: Date
  
  constructor({ _id="", user_id, is_online, last_online }) {
    super(Status.collectionName)
    this.user_id = user_id;
    this.is_online = is_online;
    this.last_online = last_online
  }
}

export default Status