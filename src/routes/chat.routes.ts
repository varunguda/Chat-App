import { NextFunction, Request, Response, Router } from "express"


const router = Router()

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    return res.json({
        success: true,
        message: "You are trying to access Chat Route"
    })
})


export default router