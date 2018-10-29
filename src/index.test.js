const test = require('ava');
const TestRenderer = require('react-test-renderer');
const { createElement } = require('react');
const { effects } = require('ferp');

const FerpReact = require('./index.js');

const waitToFind = (renderer, ComponentClass, attempts = 100) => new Promise((resolve, reject) => {
  if (attempts === 0) {
    reject(new Error('Component not found'));
    return;
  }
  const { root } = renderer;
  const found = root.findByType(ComponentClass);
  if (found) {
    resolve(found);
    return;
  }
  setTimeout(() => {
    try {
      renderer.update();
      resolve(waitToFind(renderer, ComponentClass, attempts - 1));
    } catch (err) {
      console.log('waitToFind failed', err);
      reject(err);
    }
  }, 1);
});

test('passes state and dispatch', async (t) => {
  const initialState = {
    foo: 'bar',
    baz: 'Hello, world!',
  };

  const MyComponent = ({ state, dispatch }) => {
    return null;
  };
  MyComponent.displayName = 'MyComponent';

  const MyConnectedComponent = FerpReact.connect(MyComponent);

  /*
   * In JSX:
   *
   * <FerpReact.AppProvider
   *  init={[initialState, effects.none()]}
   *  update={(_, state) => [state, effects.none()]}
   * >
   *   <MyComponent />
   * </FerpReact.AppProvider>
   */

  const renderer = TestRenderer.create(
    createElement(
      FerpReact.AppProvider,
      {
        init: [initialState, effects.none()],
        update: (_, state) => [state, effects.none()],
      },
      createElement(MyConnectedComponent),
    ),
  );

  const myConnectedComponent = await waitToFind(renderer, MyConnectedComponent);
  const myComponent = await waitToFind(renderer, MyComponent);

  t.is(myConnectedComponent.type.displayName, 'withFerpApp(MyComponent)');
  t.is(myComponent.props.state, initialState);
  t.is(typeof myComponent.props.dispatch, 'function');
});

test.cb('can dispatch a new effect', (t) => {
  t.plan(2);

  const initialState = {
    foo: 'bar',
    baz: 'Hello, world!',
  };

  const fooExpectations = ['bar', 'baz'];

  const MyComponent = ({ state, dispatch }) => {
    const expected = fooExpectations.shift();
    t.is(state.foo, expected);
    if (fooExpectations.length === 0) {
      t.end();
    }
    return null;
  };
  MyComponent.displayName = 'MyComponent';

  const MyConnectedComponent = FerpReact.connect(MyComponent);

  /*
   * In JSX:
   *
   * <FerpReact.AppProvider
   *  init={[initialState, effects.none()]}
   *  update={(message, state) => {
   *    switch (message.type) {
   *      case 'SET_FOO':
   *        return [{ ...state, foo: message.foo }, effects.none()];
   *
   *      default:
   *        return [state, effects.none()]
   *    }
   *  }
   * >
   *   <MyComponent />
   * </FerpReact.AppProvider>
   */

  const renderer = TestRenderer.create(
    createElement(
      FerpReact.AppProvider,
      {
        init: [
          initialState,
          effects.delay({ type: 'SET_FOO', foo: 'baz' }, 10),
        ],
        update: (message, state) => {
          switch (message.type) {
            case 'SET_FOO':
              return [
                Object.assign({}, state, { foo: message.foo }),
                effects.none(),
              ];

            default:
              return [
                state,
                effects.none(),
              ]
          }
        },
      },
      createElement(MyConnectedComponent),
    ),
  );
});
