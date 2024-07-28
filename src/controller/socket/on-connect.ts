import JanodeService from "../../kernel/janus";
// @ts-ignore
import AudioBridgePlugin from "janode/plugins/audiobridge";
import { emitError, emitEvent } from "../../util/socket";
import { Socket } from "socket.io";

const onConnectEstablished = async (socket: Socket, audioHandle) => {
  try {
    const janodeSession = JanodeService.getSessionHandler();
    audioHandle = await janodeSession.attach(AudioBridgePlugin);

    audioHandle.once(
      AudioBridgePlugin.EVENT.AUDIOBRIDGE_DESTROYED,
      (evtdata) => {
        audioHandle.detach().catch(() => {});
        emitEvent(socket, "destroyed", evtdata);
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
      display: socket.data.user_id,
      muted: false,
      suspended: false,
      token: null,
      rtp_participant: null,
      group: null,
      pin: socket.data.room.pin,
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
    socket.disconnect(true)
  }
};

export default onConnectEstablished;
