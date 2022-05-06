import Base from"./Base";

class FriendRequest extends Base{
  
  static collectionName = "friend_request"
  
  _id?: string;
  to: string;
  from: string;
  created_at: Date;
  
  constructor({ _id = "", to, from }) {
    super("users")
    this._id = _id,
    this.created_at = new Date()
    this.to = to
    this.from = from
  }
  
}

export default FriendRequest