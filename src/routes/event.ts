import express, { Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import event from '../middleware/event';
const router = express.Router();
 // @ts-ignore
router.post('/login', async (req: Request, res: Response) => {
    const {username,password}= req.body
    console.log(username,password);
    
    try {
        let user = await User.findOne({email:username});
    if(user){
        // @ts-ignore
        if(user.ticketId===password){
            const payload={
                user:{
                    ticketId:password
                }
            }
            jwt.sign(
                payload, // @ts-ignore
                process.env.EVENT_COOKIE_SECRET,
                {
                    expiresIn: '10d',
                },
                (err, token) => {
                    if (err) throw err;
                    return res.status(200).json({
                        token,
                        user: {
                            email:username
                        },
                    });
                },
            );  
        }
        else{
            return res.status(401).send({errors: ["Auth Error"]})
        } 
    }
    else{
        return res.status(401).send({errors: ["Auth Error"]})
    }    
    } catch (error) {
        console.log(error);
        return res.status(401).send({errors: ["Auth Error"]})
    }


});
// @ts-ignore
router.get('/me', event, async (req: IAuthMiddlewareRequest, res: Response) => {
    try {
        const ticketId = req.user.ticketId;
        const user = await User.findOne({ ticketId });
        if (user) {
            return res.status(200).send(user);
        } else {
            return res.status(404).send({ errors: ['User does not exits'] });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ errors: ['Server Error'] });
    }
});
export default router;