import Razorpay from 'razorpay';
import express , {Request,Response} from 'express';
import * as crypto from "crypto";
import Transactions from '../models/transactions';
import ITransaction from "../interfaces/Transaction"
import makeId from "../utils";
import User from '../models/user';
import Ambassador from '../models/ambassador'; 
// import IUser from '../interfaces/User';
// import User from '../models/user';
import {CURRENCY_MINIMUM_MULTIPLE,TICKET_PRICE} from '../constants'
import IAuthMiddlewareRequest from '../interfaces/AuthMiddlewareRequest';

const router= express.Router();

var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  })

router.get('/', async(_:Request,res:Response)=>{
    try {
        const users= await Transactions.find({});
             return res.json(users)
    } catch (error) {
        console.log(error);
        return res.status(500).send({errors:["Server Error"]}); 
    }
})
// @ts-ignore
router.post('/order',auth, async(req:IAuthMiddlewareRequest,res:Response)=>{
try {
    // const email= req.user.email
    // const user= await User.findOne({email});
    const txn= new Transactions({
        email: req.user.email
    })
    const savedTxn:ITransaction=await txn.save()
      var options = {
        amount: CURRENCY_MINIMUM_MULTIPLE*TICKET_PRICE,  // amount in the smallest currency unit
        currency: "INR",
        receipt: savedTxn.reciept,
        payment_capture : 1
      };
      instance.orders.create(options, function(err:string, order:string) {
        if(err){
          return res.send(err)}
        else{
         return res.json(order)}
      });
} catch (error) {
    console.log(error);
    return res.status(500).send({errors:["Server Error"]}); 
}
});

router.post('/payment',async(req:Request,_:Response)=>{
    // @ts-ignore
    const generated_signature = crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
    generated_signature.update(req.body.razorpay_order_id+"|"+ req.body.transactionid)
    // if ( generated_signature.digest('hex') === req.body.razorpay_signature){
    //     const transaction = new Transaction({
    //         transactionid:req.body.transactionid,
    //         transactionamount:req.body.transactionamount,
    //     });
    // }


}) 
router.post('/webhook',async(req:Request,res:Response)=>{
try {
    const data=req.body;
    const ticketCost=CURRENCY_MINIMUM_MULTIPLE*TICKET_PRICE;
    const {email,amount,contact}=data.payload.payment.entity
    let user = await User.findOne({email});
    const ticketId=makeId(4,'tdx21tkt-');
    if(user){
        
        user.ticketId=ticketId;
        user.amountPaid=amount/CURRENCY_MINIMUM_MULTIPLE;
        user.ticketsBought=amount/ticketCost;
        if(user.aId){
            let amb = await Ambassador.findOne({aId:user.aId});
            amb!.conversions+=1
            await amb?.save()
        }
        await user.save()
    }
    else{
        
         user= new User({
            email,phoneNo:contact,ticketId,amountPaid:amount/CURRENCY_MINIMUM_MULTIPLE,ticketsBought:amount/ticketCost

        });
        await user.save()
    }
    return res.json({}) 
} catch (error) {
    console.log(error);
    return res.status(500).send({errors:["Server Error"]}); 
}
});
export default router;