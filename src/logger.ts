import { MissionStats } from "./MissionStats.ts";
import { RoundStats } from "./RoundStats.ts";
import { formatRound, formatTime } from "./utils.ts";

const outputRoundStats = (
  roundStats: RoundStats,
  fastestTime: number,
  slowestTime: number,
) => {
  const colorIntensity =
    (1 - (roundStats.time - fastestTime) / (slowestTime - fastestTime)) * 255;
  let conduitResultEmoji = "";
  for (const result of roundStats.conduitResult) {
    conduitResultEmoji += result ? "✅" : "❌";
  }
  const formattedRound = formatRound(roundStats.roundIndex);
  console.log(
    `Round ${formattedRound}   :  ${conduitResultEmoji} %c${
      formatTime(
        roundStats.time,
      )
    }  %c${formatTime(roundStats.totalTime, 3)}`,
    `color: rgb(255,${colorIntensity},${colorIntensity})`,
    "color: nocolor",
  );
};

const outputMissionStats = (missionStats: MissionStats) => {
  const fastestTime =
    missionStats.rounds.reduce((fastest, roundStats) =>
      fastest.time < roundStats.time ? fastest : roundStats
    ).time;
  const slowestTime =
    missionStats.rounds.reduce((slowest, roundStats) =>
      slowest.time > roundStats.time ? slowest : roundStats
    ).time;

  console.log();
  console.log(`▶ Mission: ${missionStats.missionName}`);
  console.log(`▷ Player : ` + `${missionStats.players}`.replaceAll(",", ", "));
  console.log("============================================================");
  console.log("       Phase       Conduit       Time         Total Time    ");
  console.log("------------------------------------------------------------");
  console.group();
  console.log(
    `Unlock Door :           ${
      formatTime(
        missionStats.timeBeforeUnlockDoor,
      )
    }  ${formatTime(missionStats.timeBeforeUnlockDoor, 3)}`,
  );
  for (const roundStats of missionStats.rounds) {
    outputRoundStats(roundStats, fastestTime, slowestTime);
  }
  console.log(
    `Extraction  :           ${
      formatTime(
        missionStats.timeAfterLastRound,
      )
    }  ${formatTime(missionStats.totalTime, 3)}`,
  );
  console.groupEnd();
  console.log("============================================================");
  console.log(
    `Conduit       : ` +
      `${missionStats.totalConduitSucceeded}/${missionStats.totalConduit}`
        .padStart(
          14,
          " ",
        ),
  );
  console.log(
    `Mission Score : ` + `${missionStats.missionScore}`.padStart(14, " "),
  );
  const averageTime = (missionStats.totalTime -
    missionStats.timeBeforeUnlockDoor -
    missionStats.timeAfterLastRound) /
    missionStats.rounds.length;
  console.log(`Average Time  : ${formatTime(averageTime, 3)}`);
  console.log(`Total Time    : ${formatTime(missionStats.totalTime, 3)}`);
};

export const outputStats = (missionStatsList: MissionStats[]) => {
  if (missionStatsList.length === 0) {
    console.log("No stats to display.");
    console.log(
      "Note that this tool can only analyze the mission when you were the host.",
    );
    console.log(
      "Also this tool can't analyze the mission that was aborted / failed.",
    );
  } else {
    for (const missionStats of missionStatsList) {
      outputMissionStats(missionStats);
    }
  }
};
