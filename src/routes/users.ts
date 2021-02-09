import express , {Request,Response} from 'express';
// import {check,validationResult} from 'express-validator';
import User from '../models/user';
import {getGToken,getGoogleUserInfo} from "../controllers/googleAPIFns" 

const router= express.Router();

// @route GET api/users
// @desc Gets list of all users (unsafe should be acessed by admin only)
// @acess public (TODO: admin)

router.get('/', async(req:Request,res:Response)=>{
    console.log(req);
    try {
        const users= User.find({});
        return res.json(users)
    } catch (error) {
        console.log(error);
        return res.status(500).send({errors:["Server Error"]}); 
    }
    
})
router.post('/', async(req:Request,res:Response)=>{
    console.log(req);
    try {
        const {code}= req.body;
        const token= await getGToken(code)
        const UserInfo:any= await getGoogleUserInfo(token)
        console.log(UserInfo);
        return res.status(200).send(UserInfo)
        
        

    } catch (error) {
        console.log(error);
        return res.status(500).send({errors:["Server Error"]}); 
    }
    
})

export default router;