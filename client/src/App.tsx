import { useEffect, useRef, useState } from 'react'
import './App.css'
import io from 'socket.io-client'
const socket = io("http://localhost:5000")


const App: React.FC = () => {

    const [messages, setMessages] = useState <string[]>([])
    const [room, setRoom] = useState("")
    const inputRef: any = useRef()

    const joinRoom = () => {
        if (room !== "") {
            socket.emit("join_room", room)
        }
    }

    const sendMessage = () => {
        socket.emit("send_message", {
            message: inputRef.current.value,
            room
        })
    }

    interface receivedMessage {
        message: string
    }

    useEffect(() => {
        socket.on("received_message", (data: receivedMessage) => {
            setMessages(prev => prev.concat([data.message]))
        })
    }, [socket])

    return (
        <>
            <input onChange={(e) => { setRoom(e.target.value) }} type="text" placeholder='Enter Room number' />
            <button onClick={joinRoom}>Join</button>

            <input ref={inputRef} type="text" placeholder='Enter message...' />
            <button onClick={sendMessage}>Send</button>

            {messages.length > 0 && messages.map((msg: string) => (
                <div>{msg}</div>
            ))}
        </>
    )
}

export default App
