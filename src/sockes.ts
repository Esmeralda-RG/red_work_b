import {Server, Socket} from "socket.io";



interface Client {
   [key: string]: {
    id: string[];
    socket?: Socket;
   };
}

interface DataRefresh {
    id: string; 
    isAvailable: boolean;
}


class SocketsClients {
    private static instance: SocketsClients;
    private clients: Client = {}
    constructor() {
        console.log('Sockets server created');
        if (SocketsClients.instance) {
            return SocketsClients.instance;
        }
        
        SocketsClients.instance = this;
    }


    static getInstance(): SocketsClients {
        if (this.instance) {
            return this.instance;
        }
        throw new Error('No instance created');
    }


    refreshResult(data: DataRefresh): void {
     

        for (const key in this.clients) {
            if (this.clients[key].id.includes(data.id) && this.clients[key].socket) {
                this.clients[key].socket.emit('refresh', data);
            }
        } 
    }

    createClient(key:string, ids:string[]): void {
        this.clients[key] = {
            id: ids
        }
    }

    setSocket(socket: Socket, id:string) {
        if (!this.clients[id]){
            console.log('No existe');
            return;
        }
        this.clients[id].socket = socket;
    }

    testClients() {
        for (const key in this.clients) {
           this.clients[key].socket?.emit('refresh', {id: '123', isAvailable: false});
        }
    }
    
}

export default SocketsClients;