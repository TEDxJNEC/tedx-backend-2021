import express , {Request,Response} from 'express';
// import {check,validationResult} from 'express-validator';
import auth from "../middleware/auth";
import Ambassador from '../models/ambassador'; 
import IAuthMiddlewareRequest from '../interfaces/AuthMiddlewareRequest'

const router= express.Router();

// @route GET api/ambassadors
// @desc Gets list of all ambassadors (unsafe should be acessed by admin only)
// @acess public (TODO: admin)

router.get('/', async(req:Request,res:Response)=>{
    console.log(req);
    try {
        const ambassadors= await Ambassador.find({});
        return res.json(ambassadors)
    } catch (error) {
        console.log(error);
        return res.status(500).send({errors:["Server Error"]}); 
    }
    
})


// @route GET api/ambassadors/me
// @desc Gets ambassador info
// @acess auth

// @ts-ignore
router.get('/me',auth, async(req:IAuthMiddlewareRequest,res:Response)=>{
    
    try {
        const email = req.user.email
        const ambassador= await Ambassador.findOne({email});
        if (ambassador) {
            return res.json(ambassador) 
        } else {
            return res.status(404).send({errors:["Ambasador does not exits"]})
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({errors:["Server Error"]}); 
    }
    
})

export default router;