import JanodeService from "../../kernel/janus";

const destroyRoom = async (req, res) => {
  if (!req.body.room) {
    return res.status(400).json({ ok: false, message: "cannot destroy room" });
  }

  const roomId = +req.body.room;
  console.log(`request to destroy room ${roomId}`);
  try {
    await JanodeService.getManagerHandler().destroy({
      room: roomId,
    });
  } catch ({ message }: any) {
    console.log(`room ${roomId} cannot be deleted`);
    return res.status(500).json({ ok: false, message: message });
  }
  console.log(`room ${roomId} has been deleted`);
  return res.status(201).json({ ok: true });
};

export default destroyRoom;
