import { Evaluation } from "../search/objective/Evaluation";
import { ConstructorCall } from "./statements/action/ConstructorCall";
import { prng } from "../util/prng";
import { getLogger } from "../util/logger";
import { TestCaseSampler } from "./sampling/TestCaseSampler";
import { TestCaseDecoder } from "./decoder/TestCaseDecoder";
import { Encoding } from "../search/Encoding";
import { ExecutionResult } from "../search/ExecutionResult";
import { ObjectiveFunction } from "../search/objective/ObjectiveFunction";

/**
 * TestCase class
 *
 * @author Dimitri Stallenberg
 * @author Mitchell Olsthoorn
 */
export class TestCase implements Encoding {
  protected _root: ConstructorCall;
  protected _crowdingDistance: number;
  protected _rank: number;
  protected _id: string;

  /**
   * Mapping from objective to their distance values for this test case.
   * @protected
   */
  protected _objectives: Map<ObjectiveFunction<TestCase>, number>;

  /**
   * The last execution result of this test case.
   * @protected
   */
  protected _executionResult: ExecutionResult;

  /**
   * Constructor.
   *
   * @param root The root of the tree chromosome of the test case
   */
  constructor(root: ConstructorCall) {
    this._root = root;
    this._crowdingDistance = 0;
    this._rank = 0;
    this._id = prng.uniqueId(20);
    this._objectives = new Map<ObjectiveFunction<TestCase>, number>();
    getLogger().debug(`Created test case: ${this._id}`);
  }

  mutate(sampler: TestCaseSampler) {
    getLogger().debug(`Mutating test case: ${this._id}`);
    return new TestCase(this._root.mutate(sampler, 0));
  }

  hashCode(decoder: TestCaseDecoder): number {
    const string = decoder.decodeTestCase(this, `${this.id}`);
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      const character = string.charCodeAt(i);
      hash = (hash << 5) - hash + character;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  getCrowdingDistance() {
    return this._crowdingDistance;
  }

  setCrowdingDistance(value: number) {
    this._crowdingDistance = value;
  }

  setRank(value: number) {
    this._rank = value;
  }

  getRank() {
    return this._rank;
  }

  get id(): string {
    return this._id;
  }
  get root(): ConstructorCall {
    return this._root;
  }

  copy(): TestCase {
    const copy = this.root.copy();
    for (let index = 0; index < this.root.getChildren().length; index++) {
      copy.setChild(index, this.root.getChildren()[index].copy());
    }

    return new TestCase(copy);
  }

  getExecutionResult(): ExecutionResult {
    return this._executionResult;
  }

  setExecutionResult(executionResult: ExecutionResult) {
    this._executionResult = executionResult;
  }

  /**
   * Return the distance for the given objective.
   *
   * @param objectiveFunction The objective.
   */
  getObjective(objectiveFunction: ObjectiveFunction<TestCase>): number {
    return this._objectives.get(objectiveFunction);
  }

  setObjective(
    objectiveFunction: ObjectiveFunction<Encoding>,
    distance: number
  ) {
    this._objectives.set(objectiveFunction, distance);
  }
}
