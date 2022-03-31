import { MissionStats } from "./MissionStats.ts";
import { RoundStats } from "./RoundStats.ts";
import { formatRound, formatTime } from "./utils.ts";

export class Logger {
  outputRoundStats(
    roundStats: RoundStats,
    fastestTime: number,
    slowestTime: number,
    timeElapsed: number,
  ) {
    const colorIntensity = (1 -
      (roundStats.totalDuration - fastestTime) /
        (slowestTime - fastestTime)) * 255;
    let conduitResultEmoji = "";
    for (const result of roundStats.conduitResult) {
      conduitResultEmoji += result ? "✅" : "❌";
    }
    conduitResultEmoji += "⬜️".repeat(4 - roundStats.conduitResult.length);
    const formattedRound = formatRound(roundStats.roundIndex);
    console.log(
      `Round ${formattedRound}   :  ${conduitResultEmoji} %c${
        formatTime(
          roundStats.totalDuration,
        )
      }  %c${formatTime(timeElapsed, 3)}`,
      roundStats.isFinished
        ? `color: rgb(255,${colorIntensity},${colorIntensity})`
        : `color: rgb(255,255,0)`,
      "color: nocolor",
    );
  }

  outputMissionStats(missionStats: MissionStats) {
    const completedRounds = missionStats.rounds.filter((round) =>
      round.isFinished === true
    );
    const fastestTime =
      completedRounds.reduce((fastest, roundStats) =>
        fastest.totalDuration < roundStats.totalDuration ? fastest : roundStats
      ).totalDuration;
    const slowestTime =
      missionStats.rounds.reduce((slowest, roundStats) =>
        slowest.totalDuration > roundStats.totalDuration ? slowest : roundStats
      ).totalDuration;

    console.log("============================================================");
    console.log(
      `       --- Mission started on ${missionStats.startDate.toLocaleString()} ---`,
    );
    console.log(`▶ Mission: ${missionStats.missionName}`);
    console.log(
      `▷ Player : ` + `${missionStats.players}`.replaceAll(",", ", "),
    );
    console.log("============================================================");
    console.log("       Phase       Conduit       Time        Time Elapsed   ");
    console.log("------------------------------------------------------------");
    console.group();
    console.log(
      `Unlock Door :           ${
        formatTime(
          missionStats.durationBeforeUnlockDoor,
        )
      }  ${formatTime(missionStats.durationBeforeUnlockDoor, 3)}`,
    );
    for (const [index, roundStats] of missionStats.rounds.entries()) {
      this.outputRoundStats(
        roundStats,
        fastestTime,
        slowestTime,
        missionStats.getTimeElapsed(index + 1),
      );
    }
    if (missionStats.durationAfterLastRound !== 0) {
      console.log(
        `Extraction  :           ${
          formatTime(
            missionStats.durationAfterLastRound,
          )
        }  ${formatTime(missionStats.totalDuration, 3)}`,
      );
    } else {
      if (missionStats.isMissionFailed()) {
        console.log(`Mission failed at Round ${missionStats.rounds.length}`);
      } else {
        console.log(`Extracted during Round ${missionStats.rounds.length}`);
      }
    }

    console.groupEnd();
    console.log("============================================================");
    console.log(
      `  Conduit       : ` +
        `${missionStats.totalConduitSucceeded}/${missionStats.totalConduit}`
          .padStart(
            14,
            " ",
          ),
    );
    console.log(
      `  Mission Score : ` + `${missionStats.missionScore}`.padStart(14, " "),
    );
    const incompleteRoundDuration =
      missionStats.rounds.find((round) => !round.isFinished)?.totalDuration ||
      0;
    const averageTime = (missionStats.totalDuration -
      missionStats.durationBeforeUnlockDoor -
      missionStats.durationAfterLastRound -
      incompleteRoundDuration) /
      missionStats.rounds.length;
    console.log(`  Average Time  : ${formatTime(averageTime, 3)}`);
    console.log(
      `  Total Time    : ${formatTime(missionStats.totalDuration, 3)}`,
    );
    console.log("============================================================");
  }

  outputStats(missionStatsList: MissionStats[]) {
    if (missionStatsList.length === 0) {
      console.log("No stats to display.");
      console.log(
        "Note that this tool can only analyze the mission when you were the host.",
      );
      console.log(
        "Also this tool can't analyze the mission that was aborted.",
      );
    } else {
      for (const [index, missionStats] of missionStatsList.entries()) {
        if (index !== 0) {
          console.log(
            "////////////////////////////////////////////////////////////",
          );
        }
        this.outputMissionStats(missionStats);
      }
    }
  }
}
