import express , {Request,Response} from 'express';
// import {check,validationResult} from 'express-validator';
import Ambassador from '../models/ambassador';
import {getGToken,getGoogleUserInfo} from "../controllers/googleAPIFns" 

const router= express.Router();

// @route GET api/ambassadors
// @desc Gets list of all ambassadors (unsafe should be acessed by admin only)
// @acess public (TODO: admin)

router.get('/', async(req:Request,res:Response)=>{
    console.log(req);
    try {
        const ambassadors= Ambassador.find({});
        return res.json(ambassadors)
    } catch (error) {
        console.log(error);
        return res.status(500).send({errors:["Server Error"]}); 
    }
    
})

// @route POST api/ambassadors
// @desc Interacts with Google API to get User data
// @acess public

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