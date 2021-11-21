export class RoundStats {
  private _roundIndex: number;
  private _conduitResult: Array<boolean>;
  private _time: number;
  private _totalTime: number;

  constructor(roundIndex: number = 0) {
    this._roundIndex = roundIndex;
    this._conduitResult = new Array<boolean>();
    this._time = 0;
    this._totalTime = 0;
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

  get time(): number {
    return this._time;
  }
  set time(value: number) {
    this._time = value;
  }

  get totalTime(): number {
    return this._totalTime;
  }
  set totalTime(value: number) {
    this._totalTime = value;
  }
}
