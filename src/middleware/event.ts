import {Response,NextFunction} from 'express';
const jwt = require("jsonwebtoken");
import IAuthMiddlewareRequest from '../interfaces/AuthMiddlewareRequest'

// @ts-ignore
const AuthMiddleware:any = (req:IAuthMiddlewareRequest, res:Response, next:NextFunction)=> {
  const token = req.header("token");
  if (!token) return res.status(401).json({ message: "Auth Error" });

  try {
    const decoded = jwt.verify(token, process.env.EVENT_COOKIE_SECRET);
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    return res.status(500).send({ message: "Invalid Token" });
  }
}
export default AuthMiddleware;