import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
},
reciever: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
},
message: {
    type: String,
},
image: {
    type: String
}
},{timestamps:true})

const Message = mongoose.model("Message", messageSchema)
export default Message