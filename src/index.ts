import { Server } from "socket.io";
import JanodeService from "./kernel/janus";
import express from "express";
import { createServer } from "http";
import initExpressRoutes from "./controller/http/start";

const app = express();
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("a user connected");
});

initExpressRoutes(app)

const PORT = Number(process.env.PORT) || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  JanodeService.getInstance();
});
