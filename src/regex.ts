export const regex = {
  startupTime: /^([0-9.]+) Sys \[Diag\]: Current time: /,
  missionInfo:
    /^([0-9.]+) Script \[Info\]: ThemedSquadOverlay.lua: Mission name: ([^\r\n ]+)/,
  modeState:
    /^([0-9.]+) Script \[Info\]: SentientArtifactMission.lua: ModeState = [0-9]/,
  completedDefence:
    /^([0-9.]+) Script \[Info\]: SentientArtifactMission.lua: Disruption: Completed defense for artifact [1234]/,
  failedDefence:
    /^([0-9.]+) Script \[Info\]: SentientArtifactMission.lua: Disruption: Failed defense for artifact [1234]/,
  createPlayerForClient: /^([0-9.]+) Game \[Info\]: CreatePlayerForClient./,
  missionScore:
    /^([0-9.]+) Script \[Info\]: SentientArtifactMission.lua: Disruption: Total score is/,
  endOfMatch:
    /^([0-9.]+) Script \[Info\]: ExtractionTimer.lua: EOM: All players extracting/,
  abort: /^([0-9.]+) Script \[Info\]: TopMenu.lua: Abort/,
  missionFailed: /^([0-9.]+) Script \[Info\]: EndOfMatch.lua: Mission Failed/,
};
