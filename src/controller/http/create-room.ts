import JanodeService from "../../kernel/janus";
import { generateUniqueRoomId } from "../../util/janus";
import { generateRandomString } from "../../util/random";

const createRoom = async (_, res) => {
  console.log("request to create a room");
  const roomId = await generateUniqueRoomId();
  if (!roomId) {
    return res.status(500).json({ ok: false, message: "cannot create room" });
  }
  const roomPin = generateRandomString(6);

  try {
    const response = await JanodeService.getManagerHandler().create({
      room: roomId,
      pin: roomPin,
    });

    if (response && !response.room) {
      console.log(`cannot create room`);
      return res.status(500).json({ ok: false, message: "cannot create room" });
    }
  } catch ({ message }: any) {
    console.log(`cannot create room`);
    return res.status(500).json({ ok: false, message: message });
  }
  console.log(`room ${roomId} has been created`);
  return res.status(201).json({ ok: true, room: roomId, pin: roomPin });
};

export default createRoom;
