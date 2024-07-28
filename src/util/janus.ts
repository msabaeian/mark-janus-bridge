import JanodeService from "../kernel/janus";
import { generateRandom8DigitNumber } from "./random";

const generateUniqueRoomId = async (): Promise<number> => {
  return new Promise(async (resolve) => {
    const randomNumber = generateRandom8DigitNumber()
    try {
      const response = await JanodeService.getManagerHandler().exists({
        room: randomNumber,
      });
      if (response && response.exists) {
        return resolve(generateUniqueRoomId());
      }
      return resolve(randomNumber);
    } catch ({ message }: any) {
      resolve(0);
    }
  });
};

export { generateUniqueRoomId };
