Redux Store Validator
=========

Wrapper to add validation to your Redux reducers

```
npm install --save redux-store-validator
```

### Purpose

In a large React/Redux app, the store can become intractable. A common cause of bugs is when the data in the store has changed in a way that the developer didn't expect. `redux-store-validator` is intended to facilitate adding detection of when such a scenario occurs. You can add as many or as little validators to specific parts of your store, and act on it accordingly. For example, you can add a validator to check that a value which you expected to be always positive ever becomes negative. If so, you can log or recover right after the offending action modifies the store.

### Usage

Wrap your reducers

#### reducers/index.js

```js
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

Add validators to reducers as needed

#### reducers/a.js
```js
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

That's it. After you've wrapped your reducers and added validators, you can detect if the store has become invalid by querying the state.

`redux-store-validator` adds the following to your redux state:

`state[INVALID_KEYS]`: Array of keys which correspond to the substates that are invalid.

You can act upon it however you like. Below are just a few examples

## Examples of acting upon invalid store

In your component you can choose not to render with the new data if it's invalid.

### components/myComponent.jsx

```js
import { INVALID_KEYS } from 'redux-store-validator';
...

const myComponent = React.createClass({
  props: {
    text: PropTypes.string,
    isValid: PropTypes.bool
  },

  shouldComponentUpdate(nextProps) {
    return nextProps.isValid;
  },

  ...
  
  render() {
    return <div>{this.props.text}</div>;
  }
});

function mapStateToProps(state) {
  return {
    text: state.a.word,
    isValid: state[INVALID_KEYS].includes('a')
  }
}
...
```

---------------------------

You can replace the state with a default valid one as soon as an action caused it to become invalid.

#### Back in reducers/index.js

```js
import aReducer, {
  validator as aValidator,
  defaultState as aDefaultState
} from './a';
import { bReducer } from './b';

import { INVALID_KEYS } from 'redux-store-validator';

const reducers = {
  a: aReducer,
  b: bReducer
}

const validators = {
  // Only add validators for substates you want validation on
  a: aValidator
}

const defaultStates = {
  a: aDefaultState
}

const rootReducer = combineReducers(withValidation(reducers, validators));

function replaceInvalid(combinedReducer) {
  return (state, action) => {
    const newState = combinedReducer(state, action);
    if (newState.INVALID_KEYS.length === 0) {
      return newState;
    }
    for (const validatedSubstate of Object.keys(validators)) {
      if (newState[INVALID_KEYS].includes(validatedSubstate)) {
        newState[validatedSubstate] = defaultStates[validatedSubstate]
        // If the default state is valid, the INVALID_KEYS will remove the state key in the next reduction step
      }
    }
    return newState;
  }
}
export default replaceInvalid(rootReducer);
```

---------------------------

You can log in a logger middleware

#### middlewares/Logger.js

```js
import { INVALID_KEYS } from 'redux-store-validator';

export default ({getState}) => (next) => (action) => {
  const state = getState(); 
  if (state[INVALID_KEYS].length !== 0) {
    // Log the invalid states
    for (const key of state[INVALID_KEYS]) {
      const substate = state[key];
      ...
    }
    ...
  }
  ...
  return next(action);
}
```