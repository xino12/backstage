/*
 * Copyright 2021 The Backstage Authors
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

import { AnyApiFactory, AnyApiRef } from '@backstage/types';
import mapValues from 'lodash/mapValues';

/**
 * A set of API instances, keyed by their apiRef ID.
 */
export type ContextApis = Map<string, unknown>;

function isFactory(item: AnyApiRef | AnyApiFactory): item is AnyApiFactory {
  if ('factory' in item) {
    return true;
  }
  return false;
}

/**
 * Creates a new set of API instances, based on either transferring over from a
 * previously existing set, or by instantiating new ones from factories.
 *
 * @param apiRefsAndFactories - The refs and factories for the APIs that should
 *                              be present in the new set
 * @param previous - The previous set of APIs
 * @returns A new set of APIs, transferred or instantiated
 */
export function createApis(
  apiRefsAndFactories: Array<AnyApiRef | AnyApiFactory>,
  previous?: ContextApis | undefined,
): ContextApis {
  const result = new Map<string, unknown>();

  // First transfer over all APIs that have a ref in the new set
  for (const item of apiRefsAndFactories) {
    if (!isFactory(item)) {
      const instance = previous?.get(item.id);
      if (!instance) {
        throw new Error(
          `The desired API ${item.id} did not exist in the parent context`,
        );
      }
      result.set(item.id, instance);
    }
  }

  // Arrange the factories such that dependencies appear before all dependents
  const queue: AnyApiFactory[] = [];

  function enqueueDepthFirst(factory: AnyApiFactory, seen: string[]) {
    for (const depRef of Object.values(factory.deps)) {
      if (seen.includes(depRef.id)) {
        throw new Error(
          `Circular API dependencies: ${seen.join(' -> ')} -> ${depRef.id}`,
        );
      }

      const depFactory = apiRefsAndFactories
        .filter(isFactory)
        .find(f => f.api.id === depRef.id);

      if (depFactory) {
        enqueueDepthFirst(depFactory, [...seen, depRef.id]);
      } else if (!previous?.has(depRef.id)) {
        throw new Error(
          `Could not resolve API dependency in chain, ${seen.join(' -> ')} -> ${
            depRef.id
          }`,
        );
      }
    }

    if (!queue.includes(factory)) {
      queue.push(factory);
    }
  }

  for (const item of apiRefsAndFactories) {
    if (isFactory(item)) {
      enqueueDepthFirst(item, [item.api.id]);
    }
  }

  for (const factory of queue) {
    const dependencies = mapValues(factory.deps, ref => {
      // If the target set contained a replacement factory for a given API ref,
      // we try to read that newly created instance first
      return result.get(ref.id) || previous?.get(ref.id);
    });
    const instance = factory.factory(dependencies);
    result.set(factory.api.id, instance);
  }

  return result;
}
