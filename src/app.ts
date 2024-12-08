import express  from "express";
import router from "./routers/router";
import {Server} from "socket.io";
import http from "http";
import cors from "cors";
import SocketsClients from "./sockes";


const app = express();
const server = http.createServer(app);
const socketsClients = new SocketsClients();
const io = new Server(server);     


const PORT = process.env.PORT || 3000;

app.use(express.json({limit: '50mb'}));
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use('/api', router);
io.on('connection', (socket) => {

    const id = socket.handshake.query.id?.toString();
    if(id){
       socketsClients.setSocket(socket, id);
    }

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});