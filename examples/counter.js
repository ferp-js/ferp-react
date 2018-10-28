import React from 'react';
import { render } from 'react-dom';
import { effects } from 'ferp';

import { connect } from '../index.js';

export const Component = connect(({ state, dispatch }) => (
  <div>
    {state.count}
    <button onClick={() => dispatch({ type: 'INCREMENT' })}>
      Increment
    </button>
    <button onClick={() => dispatch({ type: 'DECREMENT' })}>
      Decrement
    </button>
  </div>
));

export const initialState = {
  count: 0,
};

export const update = (message, state) => {
  switch (message.type) {
    case 'INCREMENT':
      return [{ ...state, count: state.count + 1 }, effects.none()];

    case 'DECREMENT':
      return [{ ...state, count: state.count - 1 }, effects.none()];

    default:
      return [state, effects.none()];
  }
};


