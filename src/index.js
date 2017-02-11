/*
 * redux-store-validator
 */

const noop = () => {return true};

export const withValidation = (reducers, validators) => {
  const validatedReducers = {};
  Object.entries(reducers).map(([reducerSubstate, reducer]) => {
    validators[reducerSubstate] = validators[reducerSubstate] || noop;
    validatedReducers[reducerSubstate] = (state, action) => {
      const newState = reducer(state, action);
      if (!validators[reducerSubstate](newState)) {
        // TODO
      }
      return newState;
    }
  })
  return validatedReducers;
};

export default withValidation;
