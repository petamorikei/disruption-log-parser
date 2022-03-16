import { RoundStats } from "./RoundStats.ts";

export class MissionStats {
  private _startDate: Date;
  private _players: Array<string>;
  private _missionName: string;
  private _missionScore: number;
  private _rounds: RoundStats[];
  private _startTimeStamp: number;
  private _doorUnlockedTimeStamp: number;
  private _extractionTimeStamp: number;

  constructor(missionName: string = "") {
    this._startDate = new Date();
    this._players = new Array<string>();
    this._missionName = missionName;
    this._missionScore = 0;
    this._rounds = [];
    this._startTimeStamp = 0;
    this._doorUnlockedTimeStamp = 0;
    this._extractionTimeStamp = 0;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get players(): Array<string> {
    return this._players;
  }
  set players(value: Array<string>) {
    this._players = value;
  }

  get missionName(): string {
    return this._missionName;
  }
  set missionName(value: string) {
    this._missionName = value;
  }

  get missionScore(): number {
    return this._missionScore;
  }
  set missionScore(value: number) {
    this._missionScore = value;
  }

  get totalDuration(): number {
    return this._extractionTimeStamp - this._startTimeStamp;
  }

  get durationBeforeUnlockDoor(): number {
    return this._doorUnlockedTimeStamp - this._startTimeStamp;
  }

  get durationAfterLastRound(): number {
    const lastRound = this._rounds.at(-1);
    if (lastRound && lastRound.isFinished) {
      return this._extractionTimeStamp - lastRound.endTimeStamp;
    } else {
      return 0;
    }
  }

  get totalConduit() {
    let total = 0;
    for (const round of this.rounds) {
      total += round.conduitResult.length;
    }
    return total;
  }

  get totalConduitSucceeded(): number {
    let total = 0;
    for (const round of this.rounds) {
      total += round.conduitResult.filter((result) => result).length;
    }
    return total;
  }

  get rounds(): RoundStats[] {
    return this._rounds;
  }
  set rounds(value: RoundStats[]) {
    this._rounds = value;
  }

  get startTimeStamp(): number {
    return this._startTimeStamp;
  }
  set startTimeStamp(value: number) {
    this._startTimeStamp = value;
  }

  get doorUnlockedTimeStamp(): number {
    return this._doorUnlockedTimeStamp;
  }
  set doorUnlockedTimeStamp(value: number) {
    this._doorUnlockedTimeStamp = value;
  }

  get extractionTimeStamp(): number {
    return this._extractionTimeStamp;
  }
  set extractionTimeStamp(value: number) {
    this._extractionTimeStamp = value;
  }

  setTotalDurationOfRounds() {
    let doneTimeStampOfPreviousRound = 0;
    for (const [index, round] of this._rounds.entries()) {
      if (index === 0) {
        // First round doesn't have interval.
        round.totalDuration = round.durationExcludingInterval;
        doneTimeStampOfPreviousRound = round.endTimeStamp;
      } else {
        round.totalDuration = round.endTimeStamp - doneTimeStampOfPreviousRound;
        doneTimeStampOfPreviousRound = round.endTimeStamp;
      }
    }
  }

  getTimeElapsed(round: number): number {
    return this._rounds[round - 1].endTimeStamp - this._startTimeStamp;
  }

  setStartDate(startupTime: Date) {
    this._startDate = new Date(startupTime);
    this._startDate.setSeconds(
      this._startDate.getSeconds() + Math.trunc(this._startTimeStamp),
    );
  }
}
