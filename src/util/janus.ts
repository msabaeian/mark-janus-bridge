import JanodeService from "../kernel/janus";
import { generateRandom8DigitNumber } from "./random";

const generateUniqueRoomId = async (): Promise<number> => {
  return new Promise(async (resolve) => {
    const min = 10000000;
    const max = 99999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    try {
      const response = await JanodeService.getManagerHandler().exists({
        room: randomNumber,
      });
      if (response && response.exists) {
        return resolve(generateUniqueRoomId());
      }
      return resolve(randomNumber);
    } catch ({ message }: any) {
      console.log("generateUniqueRoomId catch");
      console.log(message);
      resolve(0);
    }
  });
};

export { generateUniqueRoomId };
