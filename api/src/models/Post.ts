import mongoose from "mongoose";

export interface PostType {
  _id?: string
  title: string
  author_id: string
  createdAt?: string
  updatedAt?: string
  description: string
  cover?: string
  isPublic: boolean
  path: string
  tags: string[]
  images?: string[]
  video?: string
}

const schema: { [key in keyof PostType  ]: any } = {
  title: String,
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  description: String,
  isPublic: Boolean,
  images: [String],
  video: String,
  path: String,
  tags: [String]
}


export default mongoose.model("Post", new mongoose.Schema(schema, { timestamps: true }))