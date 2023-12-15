import connectToDB from "./db"
import { config } from "dotenv"
import app from "./app"
import http from "http"
import { Server } from 'socket.io'
import { initializeSocketIo } from "./socket/index"

config({
    path: "./.env"
})

connectToDB()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})


initializeSocketIo(io)


server.listen(5000, () => {
    console.log("🖥️  Server listening at PORT 5000")
})