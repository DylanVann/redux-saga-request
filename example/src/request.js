import { call, cancelled as cancelledSaga, put } from 'redux-saga/effects'

/**
 * request can be used to call a promise in a saga and have events
 * dispatched indicating the promises status.
 */

// Creates types and action creators for a request.
export function createRequest(type) {
  const BASE = type
  const STARTED = `${type}_STARTED`
  const SUCCEEDED = `${type}_SUCCEEDED`
  const ERRORED = `${type}_ERRORED`
  const CANCELLED = `${type}_CANCELLED`
  return {
    BASE,
    STARTED,
    SUCCEEDED,
    ERRORED,
    CANCELLED,
    start: meta => ({
      type: STARTED,
      meta,
    }),
    success: (payload, meta) => ({
      type: SUCCEEDED,
      payload,
      meta,
    }),
    error: (error, meta) => ({
      type: ERRORED,
      meta,
    }),
    cancel: meta => ({
      type: CANCELLED,
      meta,
    }),
  }
}

// Calls a promise. Puts events for start, success, error, and cancelled.
export function* requestSaga(type, func, meta) {
  // Get the request event types for this type.
  const {
    start,
    success,
    error,
    cancel,
  } = type

  // Put the started type.
  yield put(start(meta))

  try {
    // Attempt to call the promise.
    const payload = yield call(...func)

    // If it's successful put the succeeded type.
    return yield put(success(payload, meta))
  } catch (e) {
    // If it's unsuccessful put the errored type.
    // eslint-disable-next-line no-console
    return yield put(error(e, meta))
  } finally {
    if (yield cancelledSaga()) {
      // If this saga is cancelled put the cancelled type.
      return yield put(cancel(meta))
    }
  }
}

export function request(type, func, meta) {
  return call(requestSaga, type, func, meta)
}

