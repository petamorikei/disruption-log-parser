export const regex = {
  missionInfo:
    /^([0-9.]+) Script \[Info\]: ThemedSquadOverlay.lua: Mission name: ([^\r\n ]+)/,
  modeState:
    /^([0-9.]+) Script \[Info\]: SentientArtifactMission.lua: ModeState = [0-9]/,
  completedDefence:
    /^([0-9.]+) Script \[Info\]: SentientArtifactMission.lua: Disruption: Completed defense for artifact [1234]/,
  failedDefence:
    /^([0-9.]+) Script \[Info\]: SentientArtifactMission.lua: Disruption: Failed defense for artifact [1234]/,
  endOfMission:
    /^([0-9.]+) Script \[Info\]: ExtractionTimer.lua: EOM: All players extracting/,
};
