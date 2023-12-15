import { NextFunction, Request, Response } from "express";
import { ErrorHandler, IErrorHandler } from "../utils/errorHandler";

const errorHandlerMiddleware = (err: IErrorHandler, req: Request, res: Response, next: NextFunction) => {

    if(err.name === "CastError") err = new ErrorHandler(`Resource not found! Invalid: ${err.path}`, 404)

    if(err.code === 11000){
        err = new ErrorHandler(`${err.keyValue ? Object.keys(err.keyValue).map(val => val.charAt(0).toLocaleUpperCase() + val.slice(1)).join(",") : "Values"} entered already exists!`)
    }

    if (err.name === "JsonWebTokenError") err = new ErrorHandler("Token invalid, Please try after logging in again!", 400)

    if (err.name === "TokenExpiredError") err = new ErrorHandler("Token expired, Please try after logging in again!", 400)
    

    return res
            .status(err.status)
            .json({
                success: false,
                message: err.message
            })
}

export default errorHandlerMiddleware