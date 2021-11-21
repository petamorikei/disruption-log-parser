import { MissionStats } from "./MissionStats.ts";
import { ModeState } from "./ModeState.ts";
import { regex } from "./regex.ts";
import { RoundStats } from "./RoundStats.ts";
import { subTo3Decimals, formatTime, formatRound } from "./utils.ts";

// TODO: Error message if there is no disruption log
// TODO: Check how this works when you leave mission alone as host

const outputRoundStats = (
  roundStats: RoundStats,
  fastestTime: number,
  slowestTime: number
) => {
  const colorIntensity =
    (1 - (roundStats.time - fastestTime) / (slowestTime - fastestTime)) * 255;
  let conduitResultEmoji = "";
  for (const result of roundStats.conduitResult) {
    conduitResultEmoji += result ? "✅" : "❌";
  }
  const formattedRound = formatRound(roundStats.roundIndex);
  console.log(
    `Round ${formattedRound}   :  ${conduitResultEmoji} %c${formatTime(
      roundStats.time
    )}  %c${formatTime(roundStats.totalTime, 3)}`,
    `color: rgb(255,${colorIntensity},${colorIntensity})`,
    "color: nocolor"
  );
};

const outputMissionStats = (missionStats: MissionStats) => {
  const fastestTime = missionStats.rounds.reduce((fastest, roundStats) =>
    fastest.time < roundStats.time ? fastest : roundStats
  ).time;
  const slowestTime = missionStats.rounds.reduce((slowest, roundStats) =>
    slowest.time > roundStats.time ? slowest : roundStats
  ).time;

  console.log(`▶ Mission: ${missionStats.missionName}`);
  console.log(`▷ Player : ` + `${missionStats.players}`.replaceAll(",", ", "));
  console.log("============================================================");
  console.log("       Phase       Conduit       Time         Total Time    ");
  console.log("------------------------------------------------------------");
  console.group();
  console.log(
    `Unlock Door :           ${formatTime(
      missionStats.timeBeforeUnlockDoor
    )}  ${formatTime(missionStats.timeBeforeUnlockDoor, 3)}`
  );
  for (const roundStats of missionStats.rounds) {
    outputRoundStats(roundStats, fastestTime, slowestTime);
  }
  console.log(
    `Extraction  :           ${formatTime(
      missionStats.timeAfterLastRound
    )}  ${formatTime(missionStats.totalTime, 3)}`
  );
  console.groupEnd();
  console.log("============================================================");
  console.log(
    `Conduit       : ` +
      `${missionStats.totalConduitSucceeded}/${missionStats.totalConduit}`.padStart(
        14,
        " "
      )
  );
  console.log(
    `Mission Score : ` + `${missionStats.missionScore}`.padStart(14, " ")
  );
  const averageTime =
    (missionStats.totalTime -
      missionStats.timeBeforeUnlockDoor -
      missionStats.timeAfterLastRound) /
    missionStats.rounds.length;
  console.log(`Average Time  : ${formatTime(averageTime, 3)}`);
  console.log(`Total Time    : ${formatTime(missionStats.totalTime, 3)}`);
  console.log();
};

const outputStats = (missionStatsList: MissionStats[]) => {
  for (const missionStats of missionStatsList) {
    outputMissionStats(missionStats);
  }
};

export const parseLog = (logData: string) => {
  let isExtracted = false;
  let missionName = "";
  let currentRound = 0;
  const missionStatsList: Array<MissionStats> = [];
  let missionStats: MissionStats = new MissionStats();
  let roundStats: RoundStats = new RoundStats();
  let players: Array<string> = [];

  const extractTimeStamp = (line: string): number => {
    return parseFloat(line.match(/^[0-9.]+/)![0]);
  };
  const calcPastTimeFromStartOfMission = (line: string) => {
    return subTo3Decimals(extractTimeStamp(line), missionStats.startTimeStamp);
  };

  for (const line of logData.split("\r\n")) {
    if (line.match(regex.modeState)) {
      const modeState = parseInt(line[line.length - 1]);
      if (
        currentRound === 0 &&
        modeState === ModeState.ARTIFACT_ROUND &&
        isExtracted === false
      ) {
        // Beginning of first round
        roundStats = new RoundStats(++currentRound);
        missionStats.doorUnlockTimeStamp = extractTimeStamp(line);
        missionStats.totalTime = calcPastTimeFromStartOfMission(line);
        missionStats.timeBeforeUnlockDoor = missionStats.totalTime;
      } else if (modeState === ModeState.ARTIFACT_ROUND_DONE) {
        // End of round
        roundStats.time = subTo3Decimals(
          calcPastTimeFromStartOfMission(line),
          missionStats.totalTime
        );
        missionStats.totalTime = calcPastTimeFromStartOfMission(line);
        roundStats.totalTime = missionStats.totalTime;
        missionStats.rounds.push(roundStats);
        roundStats = new RoundStats(++currentRound);
      } else if (modeState === ModeState.UNLOCK_DOOR) {
        // Beginning of mission before unlock door
        missionStats = new MissionStats(missionName);
        missionStats.startTimeStamp = extractTimeStamp(line);
      }
    } else if (line.match(regex.completedDefence)) {
      roundStats.conduitResult.push(true);
    } else if (line.match(regex.failedDefence)) {
      roundStats.conduitResult.push(false);
    } else if (line.match(regex.missionInfo)) {
      players = [];
      if (isExtracted === false) {
        currentRound = 0;
      }
      isExtracted = false;
      missionName = line.split(": ")[3];
    } else if (line.match(regex.createPlayerForClient)) {
      players.push(line.split("=")[2]);
    } else if (line.match(regex.missionScore)) {
      const missionScore = parseInt(line.match(/[0-9]+$/)![0]);
      missionStats.missionScore = missionScore;
    } else if (line.match(regex.endOfMission)) {
      missionStats.players = players.concat();
      missionStats.extractionTimeStamp = extractTimeStamp(line);
      missionStats.timeAfterLastRound = subTo3Decimals(
        calcPastTimeFromStartOfMission(line),
        missionStats.totalTime
      );
      missionStats.totalTime = subTo3Decimals(
        missionStats.extractionTimeStamp,
        missionStats.startTimeStamp
      );
      isExtracted = true;
      currentRound = 0;
      missionStatsList.push(missionStats);
    }
  }

  outputStats(missionStatsList);
};
