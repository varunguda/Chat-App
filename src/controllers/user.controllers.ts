import { NextFunction, Request, Response } from "express"
import catchAsync from "../utils/catchAsync"
import { User } from "../models/user.model"
import { ErrorHandler } from "../utils/errorHandler"
import { sendMail } from "../utils/sendMail"
import crypto from "crypto"


export const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, username } = req.body
    const user = await User.create({ email, password, username })
    if (!user) {
        return next(new Error("Bad Request!!"))
    }
    const token = user.generateJWTAccessToken();
    return res
        .status(201)
        .cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === "DEVELOPMENT" ? "lax" : "none",
            secure: process.env.NODE_ENV === "DEVELOPMENT" ? false : true
        })
        .json({
            success: true,
            message: "Your account has been registered successfully!"
        })
})



export const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as { email: string; password: string }
    const user = await User.findOne({ email })
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password!", 400))
    }
    if (!(await user.comparePassword(password))) {
        return next(new ErrorHandler("Invalid Email or Password!", 400))
    }
    const token = user.generateJWTAccessToken()
    return res
        .cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === "DEVELOPMENT" ? "lax" : "none",
            secure: process.env.NODE_ENV === "DEVELOPMENT" ? false : true
        })
        .json({
            success: true,
            message: `${user.username} has been successfully logged in!`
        })
})



export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return next(new ErrorHandler("Invalid Email address! A user with this email address doesn't exist!", 404))
    }
    const { unHashToken, hashedToken, tokenExpiry } = user.generateRandomToken()

    user.recoverPasswordToken = hashedToken
    user.recoverPasswordTokenExpiry = tokenExpiry
    await user.save({ validateBeforeSave: false })

    const url: string = `${req.get("Referer")}reset/${unHashToken}`
    const text: string = `Reset your password here : ${url}. Please note that this link will be expired in 15 mins.`
    sendMail({
        email: user.email,
        text,
        subject: "Reset password request!!🗝️"
    })
    return res.json({
        success: true,
        message: `A link to reset your password has been sent to ${user.email}`
    })
})



export const recoverPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { unHashToken } = req.params as { unHashToken: string }
    const { password, confirmPassword }: { password: string, confirmPassword: string } = req.body
    if (password !== confirmPassword) {
        return next(new ErrorHandler("The Confirm password doesnt match to the actual password entered!", 400))
    }
    const hashedToken: string = crypto.createHash(unHashToken).update("sha256").digest("hex")
    const user = await User.findOne({ recoverPasswordToken: hashedToken, recoverPasswordTokenExpiry: { $gt: Date.now() } })
    if (!user) {
        return next(new ErrorHandler("Reset password link is either invalid or has been expired!", 400))
    }
    user.password = password
    user.recoverPasswordToken = undefined
    user.recoverPasswordTokenExpiry = undefined
    await user.save({ validateBeforeSave: false })

    return res.json({
        success: true,
        message: "Your password has been successfully changed! Please login to continue."
    })
})



export const logoutUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?._id) {
        return next(new ErrorHandler("You have already been logged out!", 400))
    }
    return res
        .cookie("token", "", {
            httpOnly: true,
            maxAge: 0,
            sameSite: process.env.NODE_ENV === "DEVELOPMENT" ? "lax" : "none",
            secure: process.env.NODE_ENV === "DEVELOPMENT" ? false : true
        })
        .json({
            success: true,
            message: `${req.user?.username} have been logged out successfully!`
        })
})