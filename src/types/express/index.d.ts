import { IUser } from "../../interfaces/auth.i";

declare module 'express-serve-static-core' {
    interface Request {
        user?: IUser
    }
}