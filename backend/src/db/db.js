import mongoose from "mongoose";

export const connectDb = ()=>{
  mongoose.connect(process.env.DB_URI).then(()=>{
      console.log("connected successfully 👍")
  }).catch((err)=>{
    console.log(err)
  })
}