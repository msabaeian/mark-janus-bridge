import { Server, createServer } from "node:http";
import Env from "../util/env";

class NodeServer {
    private static instance: NodeServer;
    private server: Server;

    private constructor() {
        this.server = createServer();
    }

    public static getInstance(): NodeServer {
        if (!NodeServer.instance) {
            NodeServer.instance = new NodeServer();
        }
        return NodeServer.instance;
    }

    public static getServer(): Server {
        return NodeServer.getInstance().server;
    }

    public static startListen(): void {
        if (NodeServer.instance) {
            NodeServer.instance.server.listen(Env.SERVE_PORT, () => {
                console.info(`⚡️[server]: Server is running at http://localhost:${Env.SERVE_PORT}`);
            });
        }
    }
}

export default NodeServer;
