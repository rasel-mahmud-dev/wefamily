
import mongoose from "mongoose";

export interface CommentType {
  _id?: string
  post_id: string
  user_id: string
  text: string
  createdAt?: Date
  parent_id: string | null
}

const schema: { [key in keyof CommentType  ]: any } = {
  text: String,
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Comment",  index: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", index: true }
}


export default mongoose.model("Comment", new mongoose.Schema(schema, { timestamps: true }))