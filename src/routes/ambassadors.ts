import express , {Request,Response} from 'express';
// import {check,validationResult} from 'express-validator';
import Ambassador from '../models/ambassador'; 

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

export default router;