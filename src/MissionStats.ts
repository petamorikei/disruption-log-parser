import { RoundStats } from "./RoundStats.ts";

export class MissionStats {
  private _players: Array<string>;
  private _missionName: string;
  private _missionScore: number;
  private _totalTime: number;
  private _timeBeforeUnlockDoor: number;
  private _timeAfterLastRound: number;
  private _rounds: RoundStats[];
  private _startTimeStamp: number;
  private _doorUnlockTimeStamp: number;
  private _extractionTimeStamp: number;

  constructor(missionName: string = "") {
    this._players = new Array<string>();
    this._missionName = missionName;
    this._missionScore = 0;
    this._totalTime = 0;
    this._timeBeforeUnlockDoor = 0;
    this._timeAfterLastRound = 0;
    this._rounds = [];
    this._startTimeStamp = 0;
    this._doorUnlockTimeStamp = 0;
    this._extractionTimeStamp = 0;
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

  get totalTime(): number {
    return this._totalTime;
  }
  set totalTime(value: number) {
    this._totalTime = value;
  }

  get timeBeforeUnlockDoor(): number {
    return this._timeBeforeUnlockDoor;
  }
  set timeBeforeUnlockDoor(value: number) {
    this._timeBeforeUnlockDoor = value;
  }

  get timeAfterLastRound(): number {
    return this._timeAfterLastRound;
  }
  set timeAfterLastRound(value: number) {
    this._timeAfterLastRound = value;
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

  get doorUnlockTimeStamp(): number {
    return this._doorUnlockTimeStamp;
  }
  set doorUnlockTimeStamp(value: number) {
    this._doorUnlockTimeStamp = value;
  }

  get extractionTimeStamp(): number {
    return this._extractionTimeStamp;
  }
  set extractionTimeStamp(value: number) {
    this._extractionTimeStamp = value;
  }
}
