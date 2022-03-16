import { compare } from "https://esm.sh/compare-versions";

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
  msDigit = 3,
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

export const checkUpdate = async (currVer: string) => {
  const response = await fetch(
    "https://api.github.com/repos/petamorikei/disruption-log-parser/releases/latest",
  );
  if (response.ok) {
    const json = await response.json();
    const latestVer = json.tag_name;
    if (latestVer) {
      if (compare(currVer.slice(1), latestVer.slice(1), "<")) {
        console.log(
          `%cNew version available! => ${latestVer}`,
          "color: yellow",
        );
        console.log(
          `Download latest version from here: https://github.com/petamorikei/disruption-log-parser/releases/tag/latest`,
        );
      } else {
        console.log("%cYou're up-to-date!", "color: green");
      }
    } else {
      console.warn("%cVersion info not found", "color: orange");
    }
  } else {
    console.error("%cFailed to fetch version info", "color: red");
  }
};

export const resolveMonth = (month: string) => {
  return month === "Jan"
    ? 0
    : month === "Feb"
    ? 1
    : month === "Mar"
    ? 2
    : month === "Apr"
    ? 3
    : month === "May"
    ? 4
    : month === "Jun"
    ? 5
    : month === "Jul"
    ? 6
    : month === "Aug"
    ? 7
    : month === "Sep"
    ? 8
    : month === "Oct"
    ? 9
    : month === "Nov"
    ? 10
    : month === "Dec"
    ? 11
    : 0;
};
