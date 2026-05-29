const { log } = require('console');
const app = require('./src/app')
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });


io.on("connection", (socket) => {
    // ! IN-BUILT EVENT ONE 
    console.log("User is connected");
    // ! IN-BUILT EVENT TWO 
    socket.on("disconnect",()=>{
        console.log("User is disconnected");
    })
    // ! CUSTOM EVENT
    socket.on("message",()=>{
        console.log("Message event fired");
    })
    //  ! Another custom event
     socket.on("chacha",(data)=>{
        console.log(data);
        
        console.log("chacha event fired and hit chachi");
    })
});
httpServer.listen(3000,()=>{
    console.log("Server is running on port 3000");
})