import app from "./app"
import http from "http"
import { Server } from "socket.io"


const server = http.createServer(app)

const io = new Server(server, {
    cors:{
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`)

    socket.on("send_message", (data) => {
        socket.broadcast.emit("received_message", data)
    })
})

server.listen(5000, () => {
    console.log("🖥️ Server listening at PORT 5000")
})