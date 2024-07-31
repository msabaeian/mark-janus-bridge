import JanodeService from "../../kernel/janus";
import { generateUniqueRoomId } from "../../util/janus";
import { generateRandomString } from "../../util/random";

const createRoom = async (req, res) => {
  console.log("request to create a room");
  const roomId = await generateUniqueRoomId();
  if (!roomId) {
    return res.status(500).json({ ok: false, message: "cannot create room" });
  }
  const roomPin = generateRandomString(6);

  try {
    let createData: any = {
      room: roomId,
      pin: roomPin,
    }
    
    if (req.body.roomId) {
      createData.record = true
      createData.rec_dir = `/root/records/${req.body.roomId}/`
      

      if(req.body.gameId && req.body.roundNumber){
        createData.rec_dir = `/root/records/${req.body.roomId}/${req.body.gameId}/`
        createData.filename = `r-${req.body.roundNumber}-${new Date().toISOString()}.wav`
      }else{
        createData.filename = `${new Date().toISOString()}.wav`
      }
    }

    const response = await JanodeService.getManagerHandler().create(createData);

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
