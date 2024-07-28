const emitEvent = (socket, event, data?: any, _id?: number) => {
  let evtdata: any = {
    data,
  };
  if (_id) evtdata._id = _id;

  socket.emit(event, evtdata);
};

const emitError = (socket, message, request?: any, _id?: number) => {
  let evtdata: any = {
    error: message,
  };
  if (request) evtdata.request = request;
  if (_id) evtdata._id = _id;

  socket.emit("audio-error", evtdata);
};

export { emitEvent, emitError };
