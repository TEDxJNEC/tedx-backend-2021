import mongoose from "mongoose";
import IAmbassador from "../interfaces/Ambasador"
import makeId from "../utils";

const AmbassadorSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
    },
    aId:{
        type:String,
    },
    college:{
        type:String,  
    },
    branch:{
        type:String, 
    },
    year:{
        type:String
    },
    conversions:{
        type:Number,
        default:0
    },
    reach:{
        type:Number,
        default:0
    }


},{timestamps:true})

AmbassadorSchema.pre("save", async function (this:IAmbassador,next) {
    if (this.isNew) {
        const id = makeId(3,'tdx')
        this.aid=id;
        next();
      } else {
        next();
      }
});
export default mongoose.model<IAmbassador>('Ambassador',AmbassadorSchema)