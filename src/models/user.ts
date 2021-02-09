import mongoose from "mongoose";
import IUser from "../interfaces/User"

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String
    },
    profile_uri:{
        type:String
    },
    phoneNo:{
        type:String,
    },
    ticketId:{
        type:String
    },
    address:{
        type:String
    },
    token:{
        type:String
    }
},{timestamps:true})

export default mongoose.model<IUser>('User',UserSchema)