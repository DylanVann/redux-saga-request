# redux-saga-request

🏞 Request helper for Redux Saga.

Helper for running async functions and dispatching actions in redux saga.

## Usage

```bash
yarn add redux-saga-request
```

```js
import { createRequest, request } from 'redux-saga-request'

// Create your request types.
const FETCH_STUFF = createRequest('FETCH_STUFF')

// Have something async to run.
const fetchStuff = fetch('https://unsplash.it/list').then(r => r.json());

// Run it with Redux Saga.
function* mySaga() {
  yield request(FETCH_STUFF, [fetchStuff]);
}

// Do stuff easily in your reducers.
const stuffReducer (state = {}, { type, payload }) => {
  switch (type) {
    case FETCH_STUFF.STARTED:
      return {
        ...state,
        // Maybe use this to show a loading spinner?
        fetching: true,
      }
    case FETCH_STUFF.SUCCEEDED:
      return {
        ...state,
        fetching: false,
        fetched: true,
        // Here's the stuff!
        stuff: payload,
      }
    case FETCH_STUFF.CANCELLED:
    case FETCH_STUFF.ERRORED:
      return {
        ...state,
        fetching: false,
        fetched: false,
        // Oh no, show an error message based on this.
        errored: true,
      }
    default:
      return state;
  }
};
```

## Advanced Usage

- You can pass arguments to your async function.
- You can attach metadata to all request actions to keep them
  associated.

```js
function* mySaga() {
  yield request(
    FETCH_STUFF,
    [fetchStuff, fetchStuffArg],
    { fetchStuffMeta: 'META' }
  );
}
```
