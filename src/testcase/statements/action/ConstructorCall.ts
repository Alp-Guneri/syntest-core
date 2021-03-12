import { Statement } from "../Statement";
import { ActionStatement } from "../ActionStatement";

import { getProperty, prng, Sampler } from "../../../index";

/**
 * @author Dimitri Stallenberg
 * @author Annibale Panichella
 */
export class ConstructorCall extends ActionStatement {
  get constructorName(): string {
    return this._constructorName;
  }

  private _constructorName: string;
  private _calls: ActionStatement[];

  /**
   * Constructor
   * @param type the return type of the function
   * @param uniqueId optional argument
   * @param constructorName the name of the function
   * @param args the arguments of the function
   */
  constructor(
    type: string,
    uniqueId: string,
    constructorName: string,
    args: Statement[],
    calls: ActionStatement[]
  ) {
    super(type, uniqueId, args);
    this._constructorName = constructorName;
    this._calls = calls;
  }

  mutate(sampler: Sampler, depth: number) {
    //if (prng.nextBoolean(getProperty("resample_gene_probability"))) {
    // resample the gene
    //    return sampler.sampleGene(depth, this.type, 'constructor')
    //} else {
    // randomly mutate one of the args
    if (this.args.length > 0) {
      const args = [...this.args.map((a: Statement) => a.copy())];
      const index = prng.nextInt(0, args.length - 1);
      args[index] = args[index].mutate(sampler, depth + 1);
    }

    const random = prng.nextDouble(0, 1);
    if (random <= 0.33) {
      this.deleteMethodCall(depth, sampler);
    } else if (prng.nextDouble() <= 0.66) {
      this.replaceMethodCall(depth, sampler);
    } else {
      this.addMethodCall(depth, sampler);
    }

    if (!this.hasMethodCalls()) this.addMethodCall(depth, sampler);

    return this;
    //}
  }

  protected addMethodCall(depth: number, sampler: Sampler) {
    const calls = this.getMethodCalls();
    const index = prng.nextInt(0, calls.length);
    this.setMethodCall(
      index,
      sampler.sampleGene(depth, this.type, "functionCall")
    );
  }

  protected replaceMethodCall(depth: number, sampler: Sampler) {
    if (this.hasMethodCalls()) {
      const calls = this.getMethodCalls();
      const index = prng.nextInt(0, calls.length - 1);
      this.setMethodCall(index, calls[index].mutate(sampler, depth));
    }
  }

  protected deleteMethodCall(depth: number, sampler: Sampler) {
    if (this.hasMethodCalls()) {
      const calls = this.getMethodCalls();
      const index = prng.nextInt(0, calls.length - 1);
      this.getMethodCalls().splice(index, 1);
    }
  }

  copy() {
    const deepCopyArgs = [...this.args.map((a: Statement) => a.copy())];
    const deepCopyCalls = [
      ...this._calls.map((a: ActionStatement) => a.copy()),
    ];
    return new ConstructorCall(
      this.type,
      this.id,
      this.constructorName,
      deepCopyArgs,
      deepCopyCalls
    );
  }

  getMethodCalls(): ActionStatement[] {
    return [...this._calls];
  }

  setMethodCall(index: number, call: ActionStatement) {
    this._calls[index] = call;
  }

  hasMethodCalls(): boolean {
    return !!this._calls.length;
  }
}
