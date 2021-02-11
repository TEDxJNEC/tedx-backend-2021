import {Document,Model} from 'mongoose';
import ITicket from './Ticket'
export interface IUser {
    email: string;
    ticketId:string;
    name:string;
    address:string;
    phoneNo:string;
    createdAt:Date;
    updatedAt:Date;
    token:string;
    profile_uri:string; 
}

interface IUserBaseDocument extends IUser,Document{
    ticketId:ITicket['uuid']
}
export interface IUserModel extends Model<IUserBaseDocument>{

}
export default IUserBaseDocument;