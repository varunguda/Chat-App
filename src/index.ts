import app from "./app"
import http from "http"
import { Server } from "socket.io"


const server = http.createServer(app)

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
    hello: () => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    name: string;
    age: number;
}

interface ReceivedData {
    message: string;
    room: string;
}


const io = new Server<ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData>(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket: any) => {
    console.log(`✅ User connected: ${socket.id}`)

    socket.on("join_room", (data: string) => {
        socket.join(data)
    })

    socket.on("send_message", (data: ReceivedData) => {
        socket.to(data.room).emit("received_message", data)
    })
})

server.listen(5000, () => {
    console.log("🖥️ Server listening at PORT 5000")
})