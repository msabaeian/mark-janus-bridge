import ExpressApp from "./expressApp";
import JanodeService from "./janus";
import NodeServer from "./nodeServer";
import SocketIO from "./socket";

async function boot(config: object = {}) {

    NodeServer.getServer().on("request", ExpressApp.getApp());

    SocketIO.boot(NodeServer.getServer());

    NodeServer.startListen();

    JanodeService.getInstance();

    return {
        shutdown: async () => {
            SocketIO.getIO().close();
            NodeServer.getServer().close();
            if(JanodeService.getSessionHandler()){
                await JanodeService.getSessionHandler().destroy()
            }
        },
    };
}

export default boot;
