import { io } from "socket.io-client";

// const SERVER_URL = "http://localhost:1337";
const socket = io("http://localhost:1337")


socket.emit("content", {message: "Hello from client"});

socket.on('content', data => {
    console.log('Recived from server', data);
});
