import {Document} from 'mongoose';
interface IUser extends Document {
    email: string;
    password:string;
    ticketId:string;
    name:string;
    address:string;
    phoneNo:string;
    createdAt:Date;
    updatedAt:Date;
    token:string;
    profile_uri:string;
}

export default IUser;