import Base from"./Base";

class Comment extends Base{
  
  static collectionName = "comments"
  
  _id?: string
  post_id: string
  user_id: string
  text: string
  created_at: Date
  parent_id: string | null
  
  constructor({_id="", text, user_id, post_id, parent_id }) {
    super(Comment.collectionName)
    this._id = ""
    this.text = text
    this.user_id = user_id
    this.post_id = post_id
    this.created_at = new Date()
    this.parent_id = parent_id
  }
}

export default Comment