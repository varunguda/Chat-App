import { Router } from "express"
import { logoutUser, registerUser } from "../controllers/user.controllers"
import { verifyJWT } from "../middleware/auth.middleware"


const router = Router()

router.post("/register", registerUser)
router.delete("/logout", verifyJWT,logoutUser)


export default router