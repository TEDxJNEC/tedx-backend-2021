import {Document} from 'mongoose';
interface IAmbassador extends Document {
  name:string;
  email:string;
  aId:string;
  createdAt:Date;
  updatedAt:Date;
  college:string;
  branch:string;
  year:string;
}

export default IUser;