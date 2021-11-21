export const addTo3Decimals = (...args: Array<number>) => {
  return Math.round(args.reduce((acc, curr) => acc + curr, 0) * 1000) / 1000;
};

export const subTo3Decimals = (a: number, b: number) => {
  return Math.round((a - b) * 1000) / 1000;
};

export const formatTime = (
  time: number,
  minDigit = 2,
  secDigit = 2,
  msDigit = 3
) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time) - minutes * 60;
  const miliseconds = Math.floor((time - Math.floor(time)) * 1000);

  const minutesStr = `${minutes}`.padStart(minDigit, " ") + "m";
  const secondsStr = `${seconds}`.padStart(secDigit, "0") + "s";
  const milisecondsStr = `${miliseconds}`.padStart(msDigit, "0") + "ms";

  return `${minutesStr} ${secondsStr} ${milisecondsStr}`;
};

export const formatRound = (roundIndex: number) => {
  return roundIndex < 10
    ? `  ${roundIndex}`
    : roundIndex < 100
    ? ` ${roundIndex}`
    : `${roundIndex}`;
};
