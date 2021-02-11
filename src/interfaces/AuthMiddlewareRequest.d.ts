import {Request} from 'express'
interface IAuthMiddlewareRequest extends Request{
    user:IUser
}

export default IAuthMiddlewareRequest