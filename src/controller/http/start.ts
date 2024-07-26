import type {Express} from 'express'
import createRoom from './create-room';
import destroyRoom from './destroy-room';

function initExpressRoutes(app: Express){
    app.get("/", (_, res) => {
        res.send("It works!!");
    });
      
    app.post("/create-room", createRoom);
    app.post("/destroy-room", destroyRoom);
}

export default initExpressRoutes
