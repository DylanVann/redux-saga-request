import { put, call } from 'redux-saga/effects'

import { createRequest, requestSaga } from './request'

const REQUEST_TYPE = createRequest('TEST')
const payload = { foo: 'bar' }
const payloadError = new Error('test')
const func = [() => payload]
const errorFunc = [() => { throw payloadError }]
const meta = { test: 'test' }

describe('saga request helper', () => {
  it('should create action types', () => {
    expect(createRequest(REQUEST_TYPE)).toMatchSnapshot()
  })

  it('should dispatch started and succeeded actions', () => {
    const generator = requestSaga(REQUEST_TYPE, func, meta)
    let next = generator.next()

    expect(next.value).toEqual(
      put(REQUEST_TYPE.start(meta)),
      'it should dispatch a started action with the meta')

    next = generator.next(REQUEST_TYPE.start(meta))

    expect(next.value).toEqual(
      call(...func),
      'it should call the provided function')

    next = generator.next(payload)

    expect(next.value).toEqual(
      put(REQUEST_TYPE.success(payload, meta)),
      'should dispatch a succeeded action with the payload and meta')

    next = generator.next()

    expect(next.value).toEqual(
      { '@@redux-saga/IO': true, CANCELLED: {} },
      'it should check if the saga was cancelled',
    )

    next = generator.next()

    expect(next.value).toBeUndefined()
    expect(next.done).toEqual(true, 'the generator should have finished')
  })

  it('should dispatch started and errored actions', () => {
    const generator = requestSaga(REQUEST_TYPE, errorFunc, meta)
    let next = generator.next()

    expect(next.value).toEqual(
      put(REQUEST_TYPE.start(meta)),
      'it should dispatch a started action with the meta')

    next = generator.next(REQUEST_TYPE.start(meta))

    expect(next.value).toEqual(
      call(...errorFunc),
      'it should call the provided function')

    next = generator.throw(payloadError)

    expect(next.value).toEqual(
      put(REQUEST_TYPE.error(payloadError, meta)),
      'should dispatch a errored action with the error and meta')

    next = generator.next()

    expect(next.value).toEqual(
      { '@@redux-saga/IO': true, CANCELLED: {} },
      'it should check if the saga was cancelled',
    )

    next = generator.next()

    expect(next.value).toBeUndefined()
    expect(next.done).toEqual(true, 'the generator should have finished')
  })
})
