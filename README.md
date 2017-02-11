Redux Store Validator
=========

Wrapper to add validation to your Redux reducers

```
npm install --save redux-store-validator
```

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

The substate will have an additional flag indicating whether or not validation succeeded.

For example, in your component you can choose not to render with the new data if it's invalid.

```js
import { IS_INVALID_FLAG } from 'redux-store-validator';
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
    isValid: state.a.IS_INVALID_FLAG
  }
}
...
```

Or you can replace the state with a default valid one as soon as an action caused it to become invalid.

```js
const rootReducer = combineReducers(withValidation(reducers, validators));
```