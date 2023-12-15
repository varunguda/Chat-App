import { NextFunction, Request, Response } from "express"
import catchAsync from "../utils/catchAsync"
import jwt from "jsonwebtoken"
import { ErrorHandler } from "../utils/errorHandler"
import { IUser } from "../interfaces/auth.i"

export const verifyJWT = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies as { token: string }
    if(!token){
        return next(new ErrorHandler("Please login before accessing this URL!"))
    }
    const userPayload = jwt.verify(token, process.env.JWT_SECRET as string) as IUser
    const { _id, username, email, password } = userPayload
    if(!_id || !username || !email || !password){
        return next(new ErrorHandler("Something went wrong! Please try logging in again!"))
    }
    req.user = { ...userPayload }
    next()
})