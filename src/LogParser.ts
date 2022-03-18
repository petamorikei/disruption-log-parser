import { readLines } from "https://deno.land/std@0.129.0/io/mod.ts";

import { MissionStats } from "./MissionStats.ts";
import { ModeState } from "./ModeState.ts";
import { regex } from "./regex.ts";
import { RoundStats } from "./RoundStats.ts";
import { resolveMonth, subTo3Decimals } from "./utils.ts";

export class LogParser {
  extractTimeStamp(line: string) {
    return parseFloat(line.match(/^[0-9.]+/)![0]);
  }

  calcPastTimeFromStartOfMission(line: string, missionStats: MissionStats) {
    return subTo3Decimals(
      this.extractTimeStamp(line),
      missionStats.startTimeStamp,
    );
  }

  async parseMission(
    gen: AsyncIterableIterator<string>,
  ): Promise<MissionStats> {
    const missionStats = new MissionStats();
    let currentRoundIndex = 0;
    while (true) {
      const iter = await gen.next();
      if (iter.done) {
        // Write code here for live update.
        break;
      } else {
        const line = iter.value;
        if (regex.createPlayerForClient.test(line)) {
          missionStats.players.push(line.split("=").at(-1) || "N/A");
        } else if (regex.missionScore.test(line)) {
          missionStats.missionScore = parseInt(line.match(/[0-9]+$/)![0]);
        } else if (regex.modeState.test(line)) {
          const modeState = parseInt(line[line.length - 1]);
          if (modeState === ModeState.UNLOCK_DOOR) {
            // Record start timestamp of the mission.
            missionStats.startTimeStamp = this.extractTimeStamp(line);
          } else if (modeState === ModeState.ARTIFACT_ROUND) {
            // Beginning of rounds (When in-game count becomes 0).
            if (missionStats.doorUnlockedTimeStamp === 0) {
              missionStats.doorUnlockedTimeStamp = this.extractTimeStamp(line);
            }
            currentRoundIndex++;
            const roundStats = await this.parseRound(gen);
            if (roundStats.endTimeStamp === 0) {
              // Indicates the round is aborted during round.
              break;
            }
            roundStats.startTimeStamp = this.extractTimeStamp(line);
            roundStats.roundIndex = currentRoundIndex;
            if (
              !roundStats.hasSomeFinishedConduit &&
              !roundStats.isMissionFailedDuringRound
            ) {
              missionStats.extractionTimeStamp = roundStats.endTimeStamp;
              missionStats.setTotalDurationOfRounds();
              break;
            }
            missionStats.rounds.push(roundStats);
            if (!roundStats.isFinished) {
              missionStats.extractionTimeStamp = roundStats.endTimeStamp;
              missionStats.setTotalDurationOfRounds();
              break;
            }
          }
        } else if (regex.endOfMatch.test(line)) {
          // Extraction during round interval.
          missionStats.extractionTimeStamp = this.extractTimeStamp(line);
          missionStats.setTotalDurationOfRounds();
          break;
        } else if (regex.missionFailed.test(line)) {
          // Failure during round interval.
          missionStats.extractionTimeStamp = this.extractTimeStamp(line);
          missionStats.setTotalDurationOfRounds();
          break;
        } else if (regex.abort.test(line)) {
          break;
        }
      }
    }
    return missionStats;
  }

  async parseRound(gen: AsyncIterableIterator<string>): Promise<RoundStats> {
    const roundStats = new RoundStats();
    while (true) {
      const iter = await gen.next();
      if (iter.done) {
        // Write code here for live update.
        break;
      } else {
        const line = iter.value;
        if (regex.modeState.test(line)) {
          const modeState = parseInt(line[line.length - 1]);
          if (modeState === ModeState.ARTIFACT_ROUND_DONE) {
            roundStats.endTimeStamp = this.extractTimeStamp(line);
            break;
          }
        } else if (regex.completedDefence.test(line)) {
          roundStats.conduitResult.push(true);
        } else if (regex.failedDefence.test(line)) {
          roundStats.conduitResult.push(false);
        } else if (regex.endOfMatch.test(line)) {
          // Extraction during round.
          roundStats.endTimeStamp = this.extractTimeStamp(line);
          break;
        } else if (regex.missionFailed.test(line)) {
          // Failure during round.
          roundStats.endTimeStamp = this.extractTimeStamp(line);
          roundStats.isMissionFailedDuringRound = true;
          break;
        } else if (regex.abort.test(line)) {
          break;
        }
      }
    }
    return roundStats;
  }

  async parse(logPath: string) {
    const fileReader = Deno.openSync(logPath);
    const gen = readLines(fileReader);
    let latestMissionName = "";
    const missionStatsList = new Array<MissionStats>();
    let startupTime = new Date();

    while (true) {
      const iter = await gen.next();
      if (iter.done) {
        break;
      } else {
        const line = iter.value;
        if (regex.missionInfo.test(line)) {
          latestMissionName = line.split(": ").at(-1) || "N/A";
        } else if (regex.startupTime.test(line)) {
          const [month, date, time, year] = line.split(": ")[2].split(
            " ",
          ).slice(1, 5);
          const monthIndex = resolveMonth(month);
          const [hours, minutes, seconds] = time.split(":");
          startupTime = new Date(
            parseInt(year),
            monthIndex,
            parseInt(date),
            parseInt(hours),
            parseInt(minutes),
            parseInt(seconds),
          );
        } else if (line === "    missionType=MT_ARTIFACT") {
          const missionStats = await this.parseMission(gen);
          missionStats.missionName = latestMissionName;
          missionStats.setStartDate(startupTime);
          if (missionStats.extractionTimeStamp !== 0) {
            missionStatsList.push(missionStats);
          }
        }
      }
    }
    return missionStatsList;
  }
}
