import express , {Request,Response} from 'express';
// import {check,validationResult} from 'express-validator';
import User from '../models/user';
import {getGToken,getGoogleUserInfo} from "../controllers/googleAPIFns" 
import IGoogleUserInfo from '../interfaces/GoogleUser'
import IUser from 'src/interfaces/User';
import jwt from "jsonwebtoken";
import auth from "../middleware/auth";
import IAuthMiddlewareRequest from '../interfaces/AuthMiddlewareRequest'
const router= express.Router();

// @route GET api/users
// @desc Gets list of all users (unsafe should be acessed by admin only)
// @acess public (TODO: admin)

router.get('/', async(_:Request,res:Response)=>{
    try {
        const users= await User.find({});
             return res.json(users)
    } catch (error) {
        console.log(error);
        return res.status(500).send({errors:["Server Error"]}); 
    }
    
})
// @ts-ignore
router.post('/', async(req:Request,res:Response)=>{
    //console.log(req);
    try {     
        const {code}= req.body;
        const token= await getGToken(code)
        
        const UserInfo:IGoogleUserInfo= await getGoogleUserInfo(token)
        if (UserInfo){
        let user = await User.findOne({email:UserInfo.email});
        if(user){
            const payload = {
                user: {
                  email: UserInfo.email,
                },
              };
              
              jwt.sign(
                payload,// @ts-ignore
                process.env.COOKIE_SECRET,
                {
                  expiresIn: "10d",
                },
                (err, token) => {
                  if (err) throw err;
                  return res.status(200).json({
                    token,
                    user
                  });
                }
              );
        }
        else{
            const {email,name,picture,} = UserInfo
            const newUser:IUser = new User({
                email,
                name,
                profile_uri:picture,
            })
           const savedUser= await newUser.save();
            const payload = {
                user: {
                  email: savedUser.email,
                },
              };
              
              jwt.sign(
                payload,// @ts-ignore
                process.env.COOKIE_SECRET,
                {
                  expiresIn: "10d",
                },
                (err, token) => {
                  if (err) throw err;
                  return res.status(200).json({
                    token,
                    user:savedUser
                  });
                }
              );
        }

        
        }
        /*
        Sample O/P
    email: "pruthvishetty5656@gmail.com"
    family_name: "Shetty"
    given_name: "Pruthvi"
    id: "108183775883380169456"
    locale: "en"
    name: "Pruthvi Shetty"
    picture: "https://lh3.googleusercontent.com/a-/AOh14Gj4eBGzWWT31nuKUtqq9aySyzbRMctJSrbfHXZgwg=s96-c"
    verified_email: true
        */
        
        

    } catch (error) {
        console.log(error);
        return res.status(500).send({errors:["Server Error"]}); 
    }
    
})
// @ts-ignore
router.get('/me',auth, async(req:IAuthMiddlewareRequest,res:Response)=>{
    try {
        const email= req.user.email
        const user= await User.findOne({email});
        if(user){
            return res.status(200).send(user)
        }
        else{
            return res.status(401).send({errors:["User does not exits"]})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({errors:["Server Error"]}); 
    }
    
})

export default router;