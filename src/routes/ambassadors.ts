import express , {Request,Response} from 'express';

import {check,validationResult} from 'express-validator';
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
// @ts-ignore
router.post('/register',auth,[check("phoneNo", "Phone Number is required").not().isEmpty(),check("college", "College is required").not().isEmpty(),check("branch", "Branch is required").not().isEmpty(),check("year", "Year is required").not().isEmpty(),],async(req:IAuthMiddlewareRequest,res:Response)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //Return bad request error if error occours
    }
    try {
        const {college,branch,year,phoneNo}=req.body
        const email = req.user.email
        let ambassador= await Ambassador.findOne({email});
        ambassador!.college=college;
        ambassador!.branch=branch;
        ambassador!.year=year;
        ambassador!.phoneNo=phoneNo;
        await ambassador?.save();
    } catch (error) {
        console.log(error);
        return res.status(500).send({errors:["Server Error"]}); 
    }
})

export default router;