/*
 * redux-store-validator
 */

const noop = () => {return true};

const IS_INVALID_FLAG = '@@redux-store-validator@@IS_INVALID_FLAG';

export const withValidation = (reducers, validators) => {
  const validatedReducers = {};
  Object.entries(reducers).map(([reducerSubstate, reducer]) => {
    validators[reducerSubstate] = validators[reducerSubstate] || noop;
    validatedReducers[reducerSubstate] = (state, action) => {
      const newState = reducer(state, action);
      if (!validators[reducerSubstate](newState)) {
        newState.IS_INVALID_FLAG = true;
      }
      return newState;
    }
  })
  return validatedReducers;
};

export default withValidation;
