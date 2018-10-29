[![npm version](https://badge.fury.io/js/@ferp/react.svg)](https://badge.fury.io/js/@ferp/react)
[![Build Status](https://travis-ci.org/ferp-js/react.svg?branch=master)](https://travis-ci.org/ferp-js/ferp)
![Dependencies](https://david-dm.org/ferp-js/react.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/ferp-js/react/badge.svg)](https://snyk.io/test/github/ferp-js/react)
[![Join the chat at https://gitter.im/mrozbarry/ferp](https://badges.gitter.im/mrozbarry/ferp.svg)](https://gitter.im/mrozbarry/ferp?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# @ferp/react

[Ferp](https://github.com/ferp-js/ferp) is the easiest, functional-reactive, zero dependency javascript app framework for nodejs and modern browsers.

And now it's even easier to use with react!

## Installing

```bash
npm install --save ferp @ferp/react
```

Or grab it from unpkg

```
<script src="https://unpkg.com/@ferp/react"></script>
<script>
  const { ferp } = window;
</script>
```

## Creating an app

Here's an app that infinitely adds a counter, and logs it.

```javascript
import React from 'react';
import { effects } from 'ferp';

import { connect } from '../index.js';

const Counter = connect(({ state, dispatch }) => (
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

const initialState = {
  count: 0,
};

const update = (message, state) => {
  switch (message.type) {
    case 'INCREMENT':
      return [{ ...state, count: state.count + 1 }, effects.none()];

    case 'DECREMENT':
      return [{ ...state, count: state.count - 1 }, effects.none()];

    default:
      return [state, effects.none()];
  }
};

render(
  <AppProvider
    init={[initialState, effects.none()]}
    update={update}
  >
    <Counter />
  </AppProvider>,
  document.body,
);
```
## More docs

 - [Ferp README](https://github.com/ferp-js/ferp)

## Still have questions?

 - [Open an issue](https://github.com/ferp-js/ferp-react/issues/new), we're happy to answer any of your questions, or investigate how to fix a bug.
 - [Join us on reddit](https://www.reddit.com/r/ferp), show off what you're doing, post tutorials, or just hang out, but keep things ferp related please.
 - [Chat with us on gitter](https://gitter.im/mrozbarry/ferp), we'll try to be quick to respond.
