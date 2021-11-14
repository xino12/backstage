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

import { AnyApiFactory } from '../types';
import { createApis } from './apis';
import { allPermutations } from './testutil';

describe('createApis', () => {
  it('handles any arrangement of factory inputs', () => {
    const apiA: AnyApiFactory = {
      api: { id: 'a', T: undefined },
      deps: {},
      factory: () => 1,
    };

    const apiB: AnyApiFactory = {
      api: { id: 'b', T: undefined },
      deps: { ai: apiA.api },
      factory: ({ ai }) => (ai as any) + 1,
    };

    const apiC: AnyApiFactory = {
      api: { id: 'c', T: undefined },
      deps: { bi: apiB.api },
      factory: ({ bi }) => (bi as any) + 1,
    };

    const apiD: AnyApiFactory = {
      api: { id: 'd', T: undefined },
      deps: { bi: apiB.api },
      factory: ({ bi }) => (bi as any) + 1,
    };

    const apiE: AnyApiFactory = {
      api: { id: 'e', T: undefined },
      deps: { ci: apiC.api, di: apiD.api },
      factory: ({ ci, di }) => (ci as any) + (di as any),
    };

    for (const factories of allPermutations([apiA, apiB, apiC, apiD, apiE])) {
      expect(createApis(factories).get('e')).toBe(6);
    }
  });

  it('can register factories that have dependencies among themselves', () => {
    const apiB: AnyApiFactory = {
      api: { id: 'b', T: undefined },
      deps: {},
      factory: () => 1,
    };

    const apiA: AnyApiFactory = {
      api: { id: 'a', T: undefined },
      deps: { bi: apiB.api },
      factory: ({ bi }) => (bi as any) + 1,
    };

    for (const factories of allPermutations([apiA, apiB])) {
      const result = createApis(factories);
      expect(result.get('a')).toBe(2);
      expect(result.get('b')).toBe(1);
    }
  });

  it('can register factories that have dependencies on already registered things', () => {
    const apiB: AnyApiFactory = {
      api: { id: 'b', T: undefined },
      deps: {},
      factory: () => 1,
    };

    let result = createApis([apiB]);

    const apiA: AnyApiFactory = {
      api: { id: 'a', T: undefined },
      deps: { bi: apiB.api },
      factory: ({ bi }) => (bi as any) + 1,
    };

    result = createApis([apiA], result);

    expect(result.get('a')).toBe(2);
    expect(result.get('b')).toBeUndefined();
  });

  it('can overwrite already registered things', () => {
    const apiA: AnyApiFactory = {
      api: { id: 'a', T: undefined },
      deps: {},
      factory: () => 1,
    };

    let result = createApis([apiA]);

    const apiA2: AnyApiFactory = {
      api: { id: 'a', T: undefined },
      deps: {},
      factory: () => 2,
    };

    result = createApis([apiA2], result);

    expect(result.get('a')).toBe(2);
  });

  it('rejects attempts to register dangling references', () => {
    const apiA: AnyApiFactory = {
      api: { id: 'a', T: undefined },
      deps: {},
      factory: () => 1,
    };

    const result = createApis([apiA]);

    const apiB: AnyApiFactory = {
      api: { id: 'b', T: undefined },
      deps: { ai: apiA.api },
      factory: () => 2,
    };

    const apiC: AnyApiFactory = {
      api: { id: 'c', T: undefined },
      deps: { missing: { id: 'missing', T: undefined } },
      factory: () => undefined,
    };

    for (const factories of allPermutations([apiB, apiC])) {
      expect(() =>
        createApis(factories, result),
      ).toThrowErrorMatchingInlineSnapshot(
        '"Could not resolve API dependency in chain, c -> missing"',
      );
    }
  });

  it('rejects circular dependencies', () => {
    const apiA: AnyApiFactory = {
      api: { id: 'a', T: undefined },
      deps: { bi: { id: 'b', T: undefined } },
      factory: () => 1,
    };

    const apiB: AnyApiFactory = {
      api: { id: 'b', T: undefined },
      deps: { ai: { id: 'a', T: undefined } },
      factory: () => 2,
    };

    expect(() => createApis([apiA, apiB])).toThrowErrorMatchingInlineSnapshot(
      '"Circular API dependencies: a -> b -> a"',
    );
  });

  it('transfers over refs, but does not transfer over unreferenced things', () => {
    const apiA: AnyApiFactory = {
      api: { id: 'a', T: undefined },
      deps: {},
      factory: () => 1,
    };

    const apiB: AnyApiFactory = {
      api: { id: 'b', T: undefined },
      deps: {},
      factory: () => 2,
    };

    let result = createApis([apiA, apiB]);

    expect(result.get('a')).toBe(1);
    expect(result.get('b')).toBe(2);

    result = createApis([apiA.api], result);

    expect(result.get('a')).toBe(1);
    expect(result.get('b')).toBeUndefined();
  });
});
