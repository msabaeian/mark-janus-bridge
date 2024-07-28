import { Server as SocketServer } from "socket.io";
import { Server } from "node:http";

class SocketIO {
    private static instance: SocketIO;
    private io: SocketServer;

    private constructor(httpServer: Server) {
        this.io = new SocketServer(httpServer, {
            serveClient: false,
        });
    }

    public static boot(httpServer: Server): void {
        if (!SocketIO.instance) {
            SocketIO.instance = new SocketIO(httpServer);
        } else {
            console.warn(`SocketIO has been booted already, you cannot boot it again.`);
        }
    }

    public static getInstance(): SocketIO {
        if (!SocketIO.instance) {
            throw new Error("No instance found, you have to call boot first time before accessing instance");
        }
        return SocketIO.instance;
    }

    public static getIO(): SocketServer {
        return SocketIO.getInstance().io;
    }
}

export default SocketIO;
