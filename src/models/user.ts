import mongoose,{Schema} from "mongoose";
import IUserDocument,{IUserModel} from "../interfaces/User"

const UserSchema = new Schema<IUserDocument,IUserModel>({
    name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
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
    occupation:{
        type:String
    },
    occupationDescription:{
        type:String
    },
    token:{
        type:String
    },
    age:{
        type:Number
    },
    judgingParameters:{
        type:String
    },
    medium:{
        type:String
    },
    bestSkill:{
        type:String 
    },
    aId:{
        type:String
    },
    ticketsBought:{
        type:Number
    },
    amountPaid:{
        type:Number
    }
},{timestamps:true})

export default mongoose.model<IUserDocument,IUserModel>('User',UserSchema)