import express from "express"
import cors from "cors"

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
}))

app.get("/", (req, res, next) => {
    return res.send("yeah")
})


export default app