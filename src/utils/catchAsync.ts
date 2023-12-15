import { NextFunction, Request, Response } from "express";

export default (asyncFn: Function) => async (req: Request, res: Response, next: NextFunction) => {
    try{
        await asyncFn(req, res, next)
    }
    catch(err){
        next(err)
    }
}