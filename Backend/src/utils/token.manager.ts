import { Request, NextFunction, Response } from "express";
import jwt from "jsonwebtoken"
import { COOKIE_NAME } from "./constant.js";

const createToken = (id:string, email:string) => {
    const payload = {id, email};
    const token = jwt.sign(
        payload, 
        process.env.JWT_SECRET, 
        {
            expiresIn: process.env.JWT_VALIDITY
        }
    )
    return token;
}

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.signedCookies[`${COOKIE_NAME}`]
    // console.log(token)
    if(!token || token.trim()===""){
        return res.status(401).json({message: "Token Not Recieved"})
    }
    return new Promise<void>((resolve, reject) => {
        return jwt.verify(token, process.env.JWT_SECRET, (err, success)=>{
            if(err){
                reject(err.message)
                return res.status(401).json({message: "Token Expired"})
            } else {
                resolve();
                res.locals.jwtData = success;
                return next();
            }
        })
    })
}

export { createToken, verifyToken }