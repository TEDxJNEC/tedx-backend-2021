import mongoose,{Schema} from "mongoose";
import ITransaction,{ITransactionModel} from '../interfaces/Transaction';
import { nanoid } from 'nanoid'

let Transactions = new Schema<ITransaction,ITransactionModel>({
    transactionid:{
        type:String
    },
    transactionAmount:{
        type:String
    },
    useEmail:{
        type:String
    },
    reciept:{
        type:String,
        default:()=>nanoid()
    }
});
export default mongoose.model<ITransaction,ITransactionModel>('Transaction', Transactions);