import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import User from '../models/user';
import Ambassador from '../models/ambassador';
import { getGToken, getGoogleUserInfo } from '../controllers/googleAPIFns';
import IGoogleUserInfo from '../interfaces/GoogleUser';
import IUser from '../interfaces/User';
import IAmbassador from '../interfaces/Ambasador';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth';
import IAuthMiddlewareRequest from '../interfaces/AuthMiddlewareRequest';
const router = express.Router();

// @route GET api/users
// @desc Gets list of all users (unsafe should be acessed by admin only)
// @acess public (TODO: admin)

router.get('/', async (_: Request, res: Response) => {
    try {
        const users = await User.find({});
        return res.json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ errors: ['Server Error'] });
    }
});
// @ts-ignore
router.post('/', async (req: Request, res: Response) => {
    //console.log(req);
    try {
        const { code, type } = req.body;
        const token = await getGToken(code);

        const UserInfo: IGoogleUserInfo = await getGoogleUserInfo(token);
        if (UserInfo) {
            if (type === 'amb') {
                let amb = await Ambassador.findOne({ email: UserInfo.email });
                if (amb) {
                    const payload = {
                        user: {
                            email: UserInfo.email,
                        },
                    };

                    jwt.sign(
                        payload, // @ts-ignore
                        process.env.COOKIE_SECRET,
                        {
                            expiresIn: '10d',
                        },
                        (err, token) => {
                            if (err) throw err;
                            return res.status(200).json({
                                token,
                                user: {
                                    email: amb!.email,
                                    name: amb!.name,
                                    aId: amb!.aId,
                                },
                            });
                        },
                    );
                } else {
                    const { email, name } = UserInfo;

                    const newUser: IAmbassador = new Ambassador({
                        email,
                        name,
                    });
                    const savedUser = await newUser.save();
                    const payload = {
                        user: {
                            email: savedUser.email,
                        },
                    };

                    jwt.sign(
                        payload, // @ts-ignore
                        process.env.COOKIE_SECRET,
                        {
                            expiresIn: '10d',
                        },
                        (err, token) => {
                            if (err) throw err;
                            return res.status(200).json({
                                token,
                                user: {
                                    email: savedUser.email,
                                    name: savedUser.name,
                                    aId: savedUser.aId,
                                },
                            });
                        },
                    );
                }
            } else {
                let user = await User.findOne({ email: UserInfo.email });
                if (user) {
                    const payload = {
                        user: {
                            email: UserInfo.email,
                        },
                    };

                    jwt.sign(
                        payload, // @ts-ignore
                        process.env.COOKIE_SECRET,
                        {
                            expiresIn: '10d',
                        },
                        (err, token) => {
                            if (err) throw err;
                            return res.status(200).json({
                                token,
                                user: {
                                    email: user?.email,
                                    name: user?.name,
                                },
                            });
                        },
                    );
                } else {
                    const { email, name, picture } = UserInfo;
                    const newUser: IUser = new User({
                        email,
                        name,
                        profile_uri: picture,
                    });
                    const savedUser = await newUser.save();
                    const payload = {
                        user: {
                            email: savedUser.email,
                        },
                    };

                    jwt.sign(
                        payload, // @ts-ignore
                        process.env.COOKIE_SECRET,
                        {
                            expiresIn: '10d',
                        },
                        (err, token) => {
                            if (err) throw err;
                            return res.status(200).json({
                                token,
                                user: {
                                    email: savedUser.email,
                                    name: savedUser.name,
                                },
                            });
                        },
                    );
                }
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ errors: ['Server Error'] });
    }
});
// @ts-ignore
router.get('/me', auth, async (req: IAuthMiddlewareRequest, res: Response) => {
    try {
        const email = req.user.email;
        const user = await User.findOne({ email });
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
// @ts-ignore
router.post(
    '/register',
    auth,
    [
        check('phoneNo', 'Phone Number is required').not().isEmpty(),
        check('address', 'Address is required').not().isEmpty(),
        check('occupation', 'Occupation is required').not().isEmpty(),
        check('occupationDescription', 'Occupation Description is required').not().isEmpty(),
        check('age', 'Age is required').not().isEmpty(),
    ],
    async (req: IAuthMiddlewareRequest, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); //Return bad request error if error occours
        }
        try {
            let user = await User.findOne({ email: req?.user!.email });
            if (!user) {
                return res.status(404).json({ errors: ['User Not Found'] });
            }
            const {
                phoneNo,
                address,
                occupation,
                occupationDescription,
                age,
                judgingParameters,
                medium,
                bestSkill,
                aId,
            } = req.body;
            user!.phoneNo = phoneNo;
            user!.address = address;
            user!.occupation = occupation;
            user!.occupationDescription = occupationDescription;
            user!.age = age;
            user.judgingParameters = judgingParameters;
            user.medium = medium;
            user.bestSkill = bestSkill;
            user.aId = aId;
            if (aId) {
                let referer = await Ambassador.findOne({ aId });
                if (referer) {
                    referer!.reach += 1;
                }
                await referer!.save();
            }
            await user!.save();
            return res.status(200).json({ message: 'User Registered Successfuly' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ errors: ['Server Error'] });
        }
    },
);

export default router;
