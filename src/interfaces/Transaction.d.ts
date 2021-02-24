import {Document,Model} from 'mongoose';
import ITicket from "./Ticket"
interface ITransaction {
    transactionid:String,
    transactionamount:String,
    useEmail:String,
    reciept:String
}
interface ITransactionBaseDocument extends ITransaction,Document{
    ticketId:ITicket['uuid']
}
export interface ITransactionModel extends Model<IUserBaseDocument>{

}

export default ITransactionBaseDocument;