import { Server } from "socket.io";
import { App } from "uWebSockets.js"
import JanodeService from "./kernel/janus";

const app = App();
const io = new Server();
io.attachApp(app);
JanodeService.getInstance();

io.on("connection", (socket) => {
  console.log("a user connected");
});

app.get("/", (res, req) => {
  res.end("It works!")
})

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, (token) => {
  console.log(`Listening on port: ${PORT}`)
  if (!token) {
    console.warn("port already in use");
  }
});

