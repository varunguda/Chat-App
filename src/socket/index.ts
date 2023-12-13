import { Server, Socket } from "socket.io"

interface ReceivedData {
    message: string;
    room: string;
}

const joinChatEvent = (socket: Socket) => {
    socket.on("join_chat", (chatId: string) => {
        console.log(`User joined a Chat - ${chatId}`)
        socket.join(chatId)
    })
}

const typingInChatEvent = (socket: Socket) => {
    socket.on("typing", (chatId: string) => {
        socket.in(chatId).emit("typing", chatId)
    })
}

const stoppedTypingEvent = (socket: Socket) => {
    socket.on("stopped_typing", (chatId: string) => {
        socket.in(chatId).emit("stopped_typing", chatId)
    })
}

const userDisconnected = (socket: Socket) => {
    socket.on("disconnect", () => {
        console.log(`🚫 User diconnected ${socket.id}`)
    })
}


const initializeSocketIo = (io: Server) => {
    return io.on("connection", async (socket: Socket) => {
        try {
            console.log(`✅ User connected: ${socket.id}`)

            socket.on("join_room", (data: string) => {
                socket.join(data)
            })

            socket.on("send_message", (data: ReceivedData) => {
                socket.to(data.room).emit("received_message", data)
            })
            
            joinChatEvent(socket)
            typingInChatEvent(socket)
            stoppedTypingEvent(socket)
            
            userDisconnected(socket)

        } catch (error: any) {
            socket.emit("socket_error", error?.message || "Socket connection failed!!")
        }
    })
}


export { initializeSocketIo }