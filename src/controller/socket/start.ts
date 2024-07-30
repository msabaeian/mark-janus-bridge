import SocketIO from "../../kernel/socket";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../../util/jwt";
import { emitError, emitEvent } from "../../util/socket";
import JanodeService from "../../kernel/janus";
// @ts-ignore
import AudioBridgePlugin from "janode/plugins/audiobridge";

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
      await audioHandle.detach().catch(() => {});
    }

    try {
      const janodeSession = JanodeService.getSessionHandler();
      audioHandle = await janodeSession.attach(AudioBridgePlugin);

      audioHandle.once(
        AudioBridgePlugin.EVENT.AUDIOBRIDGE_DESTROYED,
        (evtdata) => {
          audioHandle.detach().catch(() => {});
          emitEvent(socket, "destroyed", evtdata);
          socket.disconnect(true);
        }
      );

      audioHandle.on(
        AudioBridgePlugin.EVENT.AUDIOBRIDGE_CONFIGURED,
        (evtdata) => {
          emitEvent(socket, "configured", evtdata);
        }
      );

      const joindata = {
        room: socket.data.room,
        display: "test",
        muted: false,
        suspended: false,
        token: null,
        rtp_participant: null,
        group: null,
        pin: socket.data.pin,
      };

      const response = await audioHandle.join(joindata);

      emitEvent(socket, "joined", response);
    } catch ({ message }: any) {
      if (audioHandle) audioHandle.detach().catch(() => {});
      if (message && message === "483 Missing mandatory element (pin)") {
        emitEvent(socket, "join-denied");
      } else {
        emitError(socket, message);
      }
      socket.disconnect(true);
    }

    socket.on("configure", async (evtdata) => {
      const { data } = evtdata;

      if (!data || !data.jsep) {
        emitError(socket, "no offer detected");
        return;
      }

      try {
        const response = await audioHandle.configure(data);
        emitEvent(socket, "configured", response);
      } catch ({ message }: any) {
        emitError(socket, message);
      }
    });

    socket.on("disconnect", () => {
      if (audioHandle) {
        audioHandle.detach().catch(() => {});
      }
    });
  });
}

export default initSocketEvents;
