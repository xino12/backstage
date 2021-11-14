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

import { ApiRef, createApiFactory } from './api';

describe('createApiFactory', () => {
  it('works', () => {
    const api1: ApiRef<number> = {
      id: 'api.one',
      T: undefined as any,
    };

    const api2: ApiRef<number> = {
      id: 'api.two',
      T: undefined as any,
    };

    const factory1 = createApiFactory({
      api: api1,
      deps: {},
      factory: () => 1,
    });

    const factory2 = createApiFactory({
      api: api2,
      deps: { one: api1 },
      factory: ({ one }) => one + 1,
    });

    expect(factory1).toEqual({
      api: api1,
      deps: {},
      factory: expect.any(Function),
    });
    expect(factory2).toEqual({
      api: api2,
      deps: { one: api1 },
      factory: expect.any(Function),
    });
  });
});
