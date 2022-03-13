export enum ModeState {
  MISSION_SETUP = 1, // Unused. Almost same time as UNLOCK_DOOR.
  UNLOCK_DOOR = 2, // Beginning of mission.
  ARTIFACT_ROUND = 3, // Beginning of round.
  ARTIFACT_ROUND_DONE = 4, // End of round.
  REWARDS_HOST = 5, // Unused. Almost same time as ARTIFACT_ROUND_DONE.
  INTERVAL = 6, // Unused. Almost same time as ARTIFACT_ROUND_DONE.
}
