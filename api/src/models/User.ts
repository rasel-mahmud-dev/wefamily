import mongoose from "mongoose";


// enum Gender{
//   "male"="male",
//   "female"="female",
// }

type UserType = {
  first_name: string
  last_name: string
  username: string
  email: string
  password: string
  createdAt?: Date
  updatedAt?: Date
  birthday: Date
  gender: string
  avatar: string
  email_verification: string
}

const schema: { [key in keyof UserType  ]: any } = {
  first_name: String,
  last_name: String,
  username: String,
  email: String,
  password: String,
  birthday: Date,
  gender: String,
  avatar: String,
  email_verification: Boolean
}


export default mongoose.model("User", new mongoose.Schema(schema, { timestamps: true }))