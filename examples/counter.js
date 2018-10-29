import React from 'react';
import { effects } from 'ferp';

import { connect } from '../index.js';

export const Component = connect(({ state, dispatch }) => (
  <div className="counter">
    <section className="counter-container">
      <span className="counter-number">{state.count}</span>
      <button className="counter-button" onClick={() => dispatch({ type: 'INCREMENT' })}>
        +
      </button>
      <button className="counter-button" onClick={() => dispatch({ type: 'DECREMENT' })}>
        -
      </button>
    </section>
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


