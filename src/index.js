/*
 * redux-store-validator
 */

const noop = () => {return true};

export const INVALID_KEYS = '@@redux-store-validator@@INVALID_KEYS';

export const withValidation = (reducers, validators) => {
  const validatedReducers = {};
  let invalidKeys = [];
  Object.entries(reducers).map(([reducerSubstate, reducer]) => {
    validators[reducerSubstate] = validators[reducerSubstate] || noop;
    validatedReducers[reducerSubstate] = (state, action) => {
      const newState = reducer(state, action);
      if (!validators[reducerSubstate](newState)) {
        invalidKeys.push(reducerSubstate);
      }
      return newState;
    }
  })
  validatedReducers[INVALID_KEYS] = () => {
    const copy = invalidKeys.slice();
    invalidKeys = [];
    return copy;
  }
  return validatedReducers;
};

export default withValidation;
