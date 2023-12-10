import { useEffect, useRef } from 'react'
import './App.css'
import io from 'socket.io-client'
const socket = io("http://localhost:5000")

const App: React.FC = () => {

    const inputRef: any = useRef();

    const sendMessage = () => {
        socket.emit("send_message", {
            message: inputRef.current.value
        })
    }

    interface receivedMessage {
        message: string
    }

    useEffect(()=> {
        socket.on("received_message", (data: receivedMessage) => {
            alert(data.message);
        })
    }, [socket])

    return (
        <>
            <input ref={inputRef} type="text" placeholder='Enter message...' />
            <button onClick={sendMessage}>Send</button>
        </>
    )
}

export default App
