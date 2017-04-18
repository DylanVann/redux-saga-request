import { combineReducers } from 'redux'
import {
  SELECT_REDDIT,
  INVALIDATE_REDDIT,
  REQUEST_POSTS,
  RECEIVE_POSTS,
  FETCH_POSTS,
  REFRESH_CLICKED
} from '../actions'

const selectedReddit = (state = 'reactjs', action) => {
  switch (action.type) {
    case SELECT_REDDIT:
      return action.reddit
    default:
      return state
  }
}

const posts = (state = {
  isFetching: false,
  didInvalidate: false,
  errored: false,
  items: []
}, action) => {
  switch (action.type) {
    case REFRESH_CLICKED:
    case INVALIDATE_REDDIT:
      return {
        ...state,
        didInvalidate: true
      }
    case FETCH_POSTS.STARTED:
    case REQUEST_POSTS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case FETCH_POSTS.ERRORED:
      return {
        ...state,
        isFetching: false,
        errored: true,
        didInvalidate: true,
      }
    case FETCH_POSTS.SUCCEEDED:
    case RECEIVE_POSTS:
      const items = action.posts || action.payload.posts
      const lastUpdated =action.receivedAt || action.payload.receivedAt
      return {
        ...state,
        isFetching: false,
        errored: false,
        didInvalidate: false,
        items,
        lastUpdated
      }
    default:
      return state
  }
}

const postsByReddit = (state = { }, action) => {
  const reddit = action.reddit || (action.meta && action.meta.reddit)
  switch (action.type) {
    case INVALIDATE_REDDIT:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
    case REFRESH_CLICKED:
    case FETCH_POSTS.STARTED:
    case FETCH_POSTS.SUCCEEDED:
    case FETCH_POSTS.ERRORED:
    case FETCH_POSTS.CANCELLED:
      return {
        ...state,
        [reddit]: posts(state[reddit], action)
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  postsByReddit,
  selectedReddit
})

export default rootReducer
