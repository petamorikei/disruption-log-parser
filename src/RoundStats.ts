export class RoundStats {
  private _roundIndex: number;
  private _conduitResult: Array<boolean>;
  private _startTimeStamp: number;
  private _endTimeStamp: number;
  private _totalDuration: number;

  constructor(roundIndex: number = 0) {
    this._roundIndex = roundIndex;
    this._conduitResult = new Array<boolean>();
    this._startTimeStamp = 0;
    this._endTimeStamp = 0;
    this._totalDuration = 0;
  }

  get roundIndex(): number {
    return this._roundIndex;
  }
  set roundIndex(value: number) {
    this._roundIndex = value;
  }

  get conduitResult(): Array<boolean> {
    return this._conduitResult;
  }
  set conduitResult(value: Array<boolean>) {
    this._conduitResult = value;
  }

  get startTimeStamp(): number {
    return this._startTimeStamp;
  }
  set startTimeStamp(value: number) {
    this._startTimeStamp = value;
  }

  get endTimeStamp(): number {
    return this._endTimeStamp;
  }
  set endTimeStamp(value: number) {
    this._endTimeStamp = value;
  }

  get totalDuration(): number {
    return this._totalDuration;
  }

  set totalDuration(duration: number) {
    this._totalDuration = duration;
  }

  get durationExcludingInterval(): number {
    return this._endTimeStamp - this._startTimeStamp;
  }

  get isCompleted(): boolean {
    return this._conduitResult.length === 4;
  }
}
