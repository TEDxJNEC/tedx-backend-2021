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
  conversions:number;
  reach:number;
}

export default IAmbassador;