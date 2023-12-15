import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import chatRoutes from "./routes/chat.routes"
import userRoutes from "./routes/user.routes"
import errorHandlerMiddleware from "./middleware/error.middleware"


const app = express()

// middleware
app.use(cors({
    origin: ""
}))
app.use(cookieParser())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({
    extended: true,
    limit: '10mb',
    parameterLimit: 50000
}))
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "PUT"]
}))


app.use("/api/v1/users", userRoutes)
app.use("/api/v1/chat", chatRoutes)


// Error Handling
app.use(errorHandlerMiddleware)


export default app