import mongoose from "mongoose";

export interface PostType {
  _id?: string
  title: string
  author_id: string
  summary: string
  createdAt?: string
  updatedAt?: string
  slug: string
  cover?: string
  path: string
  tags: string[]
}

const schema: { [key in keyof PostType  ]: any } = {
  title: String,
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  summary: String,
  slug: String,
  cover: String,
  path: String,
  tags: [String]
}


export default mongoose.model("Post", new mongoose.Schema(schema, { timestamps: true }))