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

import { AnyApiFactory, AnyApiRef, ApiRef } from '@backstage/types';
import { DateTime, Duration } from 'luxon';

/**
 * A context that is meant to be passed as a ctx variable down the call chain,
 * to pass along scoped information and abort signals.
 *
 * @public
 */
export interface Context {
  /**
   * Returns an abort signal that triggers when the current context or any of
   * its parents signal for it.
   */
  readonly abortSignal: AbortSignal;

  /**
   * Returns a promise that resolves when the current context or any of its
   * parents signal to abort.
   */
  readonly abortPromise: Promise<void>;

  /**
   * The point in time when the current context shall time out and abort, if
   * applicable.
   */
  readonly deadline: DateTime | undefined;

  /**
   * Creates a derived context, which signals to abort operations either when
   * any parent context signals, or when the current layer calls the returned
   * abort function.
   *
   * @returns A derived context, and the function that triggers it to abort.
   */
  withAbort(): { ctx: Context; abort: () => void };

  /**
   * Creates a derived context, which signals to abort operations either when
   * any parent context signals, or when the given amount of time has passed.
   * This may affect the deadline.
   *
   * @param timeout - The duration of time, after which the derived context
   *                  will signal to abort.
   */
  withTimeout(timeout: Duration): Context;

  /**
   * Creates a derived context, with the ability to resolve (only) the given set
   * of APIs.
   *
   * @param apis - The API references to pass through from the parent context,
   *               if any, and the factories for new APIs to instantiate.
   * @remarks
   *
   * The argument list may contain both {@link @backstage/types#ApiRef} and
   * {@link @backstage/types#ApiFactory} entries.
   *
   * Each {@link @backstage/types#ApiRef} implies an expectation that the
   * existing context must have that API present and resolvable, and that the
   * returned context will have that exact same instance passed through to be
   * resolvable. If the existing context did not have that API present, an error
   * will be thrown.
   *
   * Each {@link @backstage/types#ApiFactory} implies that the returned context
   * shall have an instance of that API created and present. The dependencies of
   * that factory may be among any of the existing context's resolvable APIs, or
   * among the other given factories.
   */
  withApis(...apis: Array<AnyApiRef | AnyApiFactory>): Context;

  /**
   * Attempts to resolve an API reference into an instance that was registered
   * in the context.
   */
  api<Api>(ref: ApiRef<Api>): Api | undefined;

  /**
   * Creates a derived context, which has a specific key-value pair set as well
   * as all key-value pairs set in the original context.
   *
   * @param key - The key of the value to set
   * @param value - The value, or a function that accepts the previous value (or
   *                undefined if not set yet) and computes the new value
   */
  withValue<T = unknown>(
    key: string | symbol,
    value: T | ((previous: T | undefined) => T),
  ): Context;

  /**
   * Attempts to get a stored value by key from the context.
   *
   * @param key - The key of the value to get
   * @returns The associated value, or undefined if not set
   */
  value<T = unknown>(key: string | symbol): T | undefined;
}
