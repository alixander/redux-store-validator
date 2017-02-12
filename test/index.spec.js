import { combineReducers, createStore } from 'redux';
import assert from 'assert';
import { withValidation, INVALID_KEYS } from '../lib';

describe('withValidation', function() {
  const aInitialState = {
    word: 'NA'
  };
  const bInitialState = {
    counter: 0
  };
  let aReducer = (state = aInitialState, action) => {
    switch (action.type) {
      case 'set':
        state.word = action.data;
        return state;
      default:
        return state;
    }
  };
  let bReducer = (state = bInitialState, action) => {
    switch (action.type) {
      case 'increment':
        state.counter = (state.counter || 0) + 1;
        return state;
      default:
        return state;
    }
  };
  let reducers = {
    a: aReducer,
    b: bReducer
  };
  it('should identify when state invalid', function() {
    const aValidator = (state) => {
      return typeof state.word === 'string';
    };
    const validators = {
      a: aValidator
    };
    const rootReducer = combineReducers(withValidation(reducers, validators));
    const store = createStore(rootReducer);
    store.dispatch({
      type: 'set',
      data: 'a string'
    });
    assert.equal(0, (store.getState())[INVALID_KEYS].length);
    store.dispatch({
      type: 'set',
      data: 1
    });
    assert.deepEqual(store.getState()[INVALID_KEYS], ['a']);
  });
  it('should adjust for returning back to valid states', function() {
    const aValidator = (state) => {
      return typeof state.word === 'string';
    };
    const validators = {
      a: aValidator
    };
    const rootReducer = combineReducers(withValidation(reducers, validators));
    const store = createStore(rootReducer);
    store.dispatch({
      type: 'set',
      data: 1
    });
    assert.deepEqual(store.getState()[INVALID_KEYS], ['a']);
    store.dispatch({
      type: 'set',
      data: 'a string'
    });
    assert.equal(0, (store.getState())[INVALID_KEYS].length);
  });
});
