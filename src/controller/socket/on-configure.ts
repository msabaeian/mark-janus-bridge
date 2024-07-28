import { Socket } from "socket.io";
import { emitError, emitEvent } from "../../util/socket";

const onConfigure = (audioHandle) => async (socket: Socket, evtdata: any) => {
  const { data } = evtdata;

  if (!data || !data.jsep) {
    return;
  }

  try {
    const response = await audioHandle.configure(data);
    emitEvent(socket, "configured", response);
  } catch ({ message }: any) {
    emitError(socket, message);
  }
};

export default onConfigure;
