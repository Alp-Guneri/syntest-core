/*
 * Copyright 2020-2023 Delft University of Technology and SynTest contributors
 *
 * This file is part of SynTest Framework - SynTest Core.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  Encoding,
  SearchAlgorithm,
  MOSAFamily,
  StructuralObjectiveManager,
  SecondaryObjectiveComparator,
  LengthObjectiveComparator,
} from "@syntest/core";
import { pluginRequiresOptions } from "@syntest/module";
import {
  SearchAlgorithmPlugin,
  SearchAlgorithmOptions,
} from "../SearchAlgorithmPlugin";

/**
 * Plugin for DynaMOSA
 *
 * Dynamic Many-Objective Sorting Algorithm (DynaMOSA).
 *
 * Based on:
 * Automated Test Case Generation as a Many-Objective Optimisation Problem with Dynamic Selection of the Targets
 * A. Panichella; F. K. Kifetew; P. Tonella
 *
 * @author Dimitri Stallenberg
 */
export class DynaMOSAPlugin<
  T extends Encoding
> extends SearchAlgorithmPlugin<T> {
  constructor() {
    super("DynaMOSA", "Dynamic Many-Objective Sorting Algorithm");
  }

  createSearchAlgorithm(
    options: SearchAlgorithmOptions<T>
  ): SearchAlgorithm<T> {
    if (!options.runner) {
      throw new Error(pluginRequiresOptions("DynaMOSA", "runner"));
    }
    if (!options.encodingSampler) {
      throw new Error(pluginRequiresOptions("DynaMOSA", "encodingSampler"));
    }
    if (!options.crossover) {
      throw new Error(pluginRequiresOptions("DynaMOSA", "crossover"));
    }
    if (!options.populationSize) {
      throw new Error(pluginRequiresOptions("DynaMOSA", "populationSize"));
    }
    if (!options.crossoverProbability) {
      throw new Error(
        pluginRequiresOptions("DynaMOSA", "crossoverProbability")
      );
    }

    const secondaryObjectives = new Set<SecondaryObjectiveComparator<T>>();
    secondaryObjectives.add(new LengthObjectiveComparator());
    return new MOSAFamily<T>(
      new StructuralObjectiveManager<T>(options.runner, secondaryObjectives),
      options.encodingSampler,
      options.crossover,
      options.populationSize,
      options.crossoverProbability
    );
  }
}