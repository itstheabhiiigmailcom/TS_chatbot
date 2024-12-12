import { Request, Response, NextFunction } from "express";
import User from "../models/User.js"
import { hash, compare } from "bcrypt"
import { createToken } from "../utils/token.manager.js";
import { COOKIE_NAME } from "../utils/constant.js";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    // get all users from db
    try{
        const users = await User.find();
        return res
        .status(200).json({message: "Ook", users})
    } catch (err) {
        console.log(err)
        res.status(404).json({message: "Error in User Controller", cause: err.message})
    }
}

const userSignup = async (req: Request, res: Response, next: NextFunction) => {
    // get all users from db
    try{
        const { name, email, password } = req.body
        // check if user already exist
        const existingUser = await User.findOne({email:email});
        if(existingUser) return res.status(401).send("User already exist")

        // if not then hash pass and store
        const hashedPassword = await hash(password, 10)
        const user = new User({ name, email, password: hashedPassword })
        await user.save()

        // create token and store it into cookie
        res.cookie(COOKIE_NAME,{
            httpOnly: true,
            signed: true,
            path: "/"
        })// first clear the previous cookie
        const token = createToken(user._id.toString(), user.email)
        const expires = new Date();
        expires.setDate(expires.getDate()+7);
        res.cookie(COOKIE_NAME, token, {
            path:"/",
            expires:expires,
            httpOnly: true,
            signed: true
        })

        return res.status(201).json({ message: "Ook", name: user.name, email: user.email })
    } catch (err) {
        console.log(err)
        res.status(404).json({message: "Error in User Controller", cause: err.message})
    }
}

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    // get all users from db
    try{
        // user login
        const { email, password } = req.body
        const user = await User.findOne({email: email})
        if(!user){
            return res.status(401).send("user not registered")
        }
        // if user exists then verify their pass using compare func of bcrypt
        const isPasswordCorrect = await compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(403).send("Incorrect Password")
        }
        // now pass is also correct then create token and send response
        res.cookie(COOKIE_NAME,{
            httpOnly: true,
            signed: true,
            path: "/"
        })// first clear the previous cookie
        const token = createToken(user._id.toString(), user.email)
        // now send this token into cookie of frontend 
        const expires = new Date();
        expires.setDate(expires.getDate()+7);
        res.cookie(COOKIE_NAME, token, {
            path:"/",
            expires:expires,
            httpOnly: true,
            signed: true
        })
        return res.status(200).json({message: "Ook", name: user.name, email: user.email});
       
    } catch (err) {
        console.log(err)
        res.status(404).json({message: "Error in User Controller", cause: err.message})
    }
}


const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    // user token check
    try{
        // user login
        const user = await User.findById(res.locals.jwtData.id)
        if(!user){
            return res.status(401).send("user not registered OR token malfunctioned")
        }
        if(user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match")
        } 
        
        return res.status(200).json({message: "Ook", name: user.name, email: user.email});
       
    } catch (err) {
        console.log(err)
        res.status(404).json({message: "Error in User Controller", cause: err.message})
    }
}

const userLogout = async (req: Request, res: Response, next: NextFunction) => {
    // user token check
    try{
        // user login
        const user = await User.findById(res.locals.jwtData.id)
        if(!user){
            return res.status(401).send("user not registered OR token malfunctioned")
        }
        if(user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match")
        } 
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/"
        });
        
        return res.status(200).json({message: "Ook", name: user.name, email: user.email});
       
    } catch (err) {
        console.log(err)
        res.status(404).json({message: "Error in User Controller", cause: err.message})
    }
}

export {getAllUsers,
    userSignup,
    userLogin,
    verifyUser,
    userLogout
}