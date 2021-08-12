import { Budget } from "./Budget";
import { Encoding } from "../Encoding";
import { SearchAlgorithm } from "../metaheuristics/SearchAlgorithm";

/**
 * Budget for the total time of the search process.
 *
 * @author Mitchell Olsthoorn
 */
export class TotalTimeBudget<T extends Encoding> implements Budget<T> {
  /**
   * The current number of seconds.
   * @protected
   */
  protected _currentSearchTime: number;

  /**
   * The maximum number of seconds allowed.
   * @protected
   */
  protected _maxSearchTime: number;

  /**
   * The time the tracking started.
   * @protected
   */
  protected _counterTime: number;

  /**
   * If the budget is tracking progress
   * @protected
   */
  protected _tracking: boolean;

  /**
   * Constructor.
   *
   * @param maxSearchTime The maximum allowed time in seconds this budget should use
   */
  constructor(maxSearchTime = Number.MAX_SAFE_INTEGER) {
    this._currentSearchTime = 0;
    this._maxSearchTime = maxSearchTime;
    this._counterTime = 0;
    this._tracking = false;
  }

  /**
   * @inheritDoc
   */
  getRemainingBudget(): number {
    if (this.getUsedBudget() > this._maxSearchTime) {
      console.log(
        `Consumed ${
          this.getUsedBudget() - this._maxSearchTime
        }s over the allocated search time`
      );
    }

    return Math.max(this._maxSearchTime - this.getUsedBudget(), 0);
  }

  /**
   * @inheritDoc
   */
  getUsedBudget(): number {
    if (this._tracking) {
      const currentTime = Date.now() / 1000;
      return this._currentSearchTime + (currentTime - this._counterTime);
    } else {
      return this._currentSearchTime;
    }
  }

  /**
   * @inheritDoc
   */
  getTotalBudget(): number {
    return this._maxSearchTime;
  }

  /**
   * @inheritDoc
   */
  reset(): void {
    this._currentSearchTime = 0;
    this._counterTime = 0;
    this._tracking = false;
  }

  /**
   * @inheritDoc
   */
  initializationStarted(): void {
    this.searchStarted();
  }

  /**
   * @inheritDoc
   */
  initializationStopped(): void {
    this.searchStopped();
  }

  /**
   * @inheritDoc
   */
  searchStarted(): void {
    if (!this._tracking) {
      this._counterTime = Date.now() / 1000;
      this._tracking = true;
    }
  }

  /**
   * @inheritDoc
   */
  searchStopped(): void {
    if (this._tracking) {
      this._currentSearchTime = this.getUsedBudget();
      this._counterTime = 0;
      this._tracking = false;
    }
  }

  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  evaluation(encoding: T): void {}

  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  iteration(searchAlgorithm: SearchAlgorithm<T>): void {}
}
