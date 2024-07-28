import SocketIO from "../../kernel/socket";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../../util/jwt";
import onConnectEstablished from "./on-connect";
import onConfigure from "./on-configure";

function initSocketEvents() {
  const io = SocketIO.getIO();

  // a client must have room in the body to be able to connect
  io.use(async (socket, next) => {
    const token =
      socket.handshake.auth?.token || socket.handshake.headers?.token;
    if (!token) {
      return next(new Error(`${StatusCodes.UNAUTHORIZED} - Auth`));
    }

    const verifyUser = verifyToken(token);
    if (!verifyUser) {
      return next(new Error(`${StatusCodes.UNAUTHORIZED} - Auth`));
    }

    const room = socket.handshake.auth?.room || socket.handshake.headers?.room;
    const pin = socket.handshake.auth?.pin || socket.handshake.headers?.pin;
    if (!room || !pin) {
      return next(new Error(String(StatusCodes.BAD_REQUEST)));
    }

    socket.data.room = room;
    socket.data.pin = pin;
    socket.data.user_id = verifyUser.user_id;

    return next();
  });

  io.on("connection", async (socket) => {
    let audioHandle;

    if (audioHandle) {
      await audioHandle.detach().catch(() => { });
    }

    // join a room
    onConnectEstablished(socket, audioHandle)

    socket.on("configure", onConfigure(audioHandle))
    
    socket.on('disconnect', () => {  
      if (audioHandle) {
        audioHandle.detach().catch(() => { });
      }
    });
  });
}

export default initSocketEvents;
