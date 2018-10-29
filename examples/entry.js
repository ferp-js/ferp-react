import React from 'react';
import { render } from 'react-dom';
import { effects } from 'ferp';

import { AppProvider } from '../index.js';

import * as Counter from './counter.js';
import * as Threads from './threads.js';

const Demo = ({ title, initialState, initialEffect, update, subscribe, Component }) => (
  <section>
    <h2>{title}</h2>
    <AppProvider
      init={[initialState, initialEffect]}
      update={update}
      subscribe={subscribe}
    >
      <Component />
    </AppProvider>
  </section>
);

Demo.defaultProps = {
  initialEffect: effects.none(),
};

render(
  <React.Fragment>
    <h1>Ferp + React</h1>
    <Demo title="Counter" {...Counter} />
    <Demo title="Threaded Messages" {...Threads} />
  </React.Fragment>,
  document.getElementById('app'),
);
