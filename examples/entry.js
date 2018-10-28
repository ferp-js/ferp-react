import React from 'react';
import { render } from 'react-dom';
import { effects } from 'ferp';

import { AppProvider } from '../index.js';

import * as Counter from './counter.js';


render(
  <React.Fragment>
    <AppProvider
      init={[Counter.initialState, effects.none()]}
      update={Counter.update}
    >
      <Counter.Component />
    </AppProvider>
  </React.Fragment>,
  document.getElementById('app'),
);
