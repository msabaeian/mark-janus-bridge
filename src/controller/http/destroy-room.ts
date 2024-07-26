import JanodeService from "../../kernel/janus";

const destroyRoom = async (req, res) => {
  if(!req.body.room){
    return res.status(400).json({ ok: false, message: "cannot destroy room" });
  }

  const roomId = +req.body.room;

  try {
    await JanodeService.getManagerHandler().destroy({
      room: roomId,
    });
  } catch ({ message }: any) {
    return res.status(500).json({ ok: false, message: message });
  }

  return res.status(201).json({ ok: true });
}

export default destroyRoom
