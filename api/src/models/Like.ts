
import mongoose from "mongoose";

export interface LikeType {
  _id?: string
  user_id: string
  post_id: string
  reaction: 'LIKE' | 'LOVE'  | 'HAHA'  | 'WOW'  | 'SAD'  | 'ANGRY',
  createdAt?: Date
}

const schema: { [key in keyof LikeType  ]: any } = {
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", index: true },
  reaction: {
    type: String,
    enum: [
      'LIKE',
      'LOVE',
      'HAHA',
      'WOW',
      'SAD',
      'ANGRY',
    ],
    message: '{VALUE} is not supported',
    
  }
}

export default mongoose.model("Like", new mongoose.Schema(schema, { timestamps: true }))