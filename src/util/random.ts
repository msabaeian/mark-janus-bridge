function generateRandom8DigitNumber(): number {
  const min = 10000000;
  const max = 99999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * charactersLength))
  ).join("");
}

export { generateRandom8DigitNumber, generateRandomString };
