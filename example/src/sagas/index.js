import { takeLatest } from 'redux-saga/effects'
import { request } from 'redux-saga-request'
import { FETCH_POSTS, REFRESH_CLICKED, fetchPosts } from '../actions'

function* fetchPostsSaga(action) {
  yield request(FETCH_POSTS, [fetchPosts, action.reddit], { reddit: action.reddit })
}

function* rootSaga() {
  yield takeLatest(REFRESH_CLICKED, fetchPostsSaga)
}

export default rootSaga
