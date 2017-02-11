Redux Store Validator
=========

Wrapper to add validation to your Redux reducers

```
npm install --save redux-store-validator
```

#### reducers/index.js

```
import { withValidation } from 'redux-store-validator';
import aReducer, { validator as aValidator } from './a';
import { bReducer } from './b';

const reducers = {
  a: aReducer,
  b: bReducer
}

const validators = {
  // Only add validators for substates you want validation on
  a: aValidator
}

// Instead of
// const rootReducer = combineReducers(reducers);
// You wrap your reducers in 'withValidation' and pass in the validators to execute
const rootReducer = combineReducers(withValidation(reducers, validators));
```

#### reducers/a.js

```
export function validator(state) {
  return state.word === 'asdf';
}

export default function(state, action) {
  switch(action.type) {
    case 'asdf':
      state.word = 'asdf';
      return state;
    default:
      return state;
  }
}
```