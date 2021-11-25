import { MissionStats } from "./MissionStats.ts";
import { ModeState } from "./ModeState.ts";
import { regex } from "./regex.ts";
import { RoundStats } from "./RoundStats.ts";
import { subTo3Decimals } from "./utils.ts";

// TODO: Check how this works when you leave mission alone as host

export const parseLog = (logData: string) => {
  let disruptionStarted = false;
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
        disruptionStarted === true
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
        if (disruptionStarted) {
          currentRound = 0;
        }
        disruptionStarted = true;
        missionStats = new MissionStats(missionName);
        missionStats.startTimeStamp = extractTimeStamp(line);
      }
    } else if (line.match(regex.completedDefence)) {
      roundStats.conduitResult.push(true);
    } else if (line.match(regex.failedDefence)) {
      roundStats.conduitResult.push(false);
    } else if (line.match(regex.missionInfo)) {
      players = [];
      missionName = line.split(": ")[3];
    } else if (line.match(regex.createPlayerForClient)) {
      players.push(line.split("=")[2]);
    } else if (line.match(regex.missionScore)) {
      const missionScore = parseInt(line.match(/[0-9]+$/)![0]);
      missionStats.missionScore = missionScore;
    } else if (line.match(regex.endOfMission) && disruptionStarted) {
      missionStats.players = [...players];
      missionStats.extractionTimeStamp = extractTimeStamp(line);
      missionStats.timeAfterLastRound = subTo3Decimals(
        calcPastTimeFromStartOfMission(line),
        missionStats.totalTime
      );
      missionStats.totalTime = subTo3Decimals(
        missionStats.extractionTimeStamp,
        missionStats.startTimeStamp
      );
      disruptionStarted = false;
      currentRound = 0;
      missionStatsList.push(missionStats);
    }
  }

  return missionStatsList;
};
