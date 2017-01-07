# Ducks: Redux Reducer Bundles

it makes more sense for these pieces to be bundled together in an isolated module that is self contained, and can even be packaged easily into a library.

### Example

```javascript
import { createAction, handleActions } from 'redux-actions'

export const setStatus = createAction('setStatus')

export default handleActions({
  // add each new team to the store
  [setStatus]: (state, action) => action.payload,
}, '')

```
### Rules

A module...

1. MUST `export default` a function called `reducer()`
2. MUST `export` its action creators as functions

These same guidelines are recommended for `{actionType, action, reducer}` bundles that are shared as reusable Redux libraries.

### Name & Structure

```
lib/redux
├── README.md
├── modules
│   ├── index.js
├── sagas
│   ├── index.js
└── store.js

```

### Usage

You can still do:

```javascript
import { createStore, applyMiddleware, combineReducers } from 'redux'

import createLogger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'

import * as reducers from './modules'
import rootSaga from './sagas'

const logger = createLogger()
const sagaMiddleware = createSagaMiddleware()

export default createStore(
  combineReducers(reducers),
  {}, // initial data
  applyMiddleware(logger, sagaMiddleware)
)

sagaMiddleware.run(rootSaga)
```

You can still do:

```javascript
import * as widgetActions from './modules/widgets';
```
...and it will only import the action creators, ready to be passed to `bindActionCreators()`.

There will be some times when you want to `export` something other than an action creator. That's okay, too. The rules don't say that you can *only* `export` action creators. When that happens, you'll just have to enumerate the action creators that you want. Not a big deal.

```javascript
import {loadWidgets, createWidget, updateWidget, removeWidget} from './modules/widgets';
// ...
bindActionCreators({loadWidgets, createWidget, updateWidget, removeWidget}, dispatch);
```
