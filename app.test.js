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
    return createElement('div');
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

// test('can dispatch a new effect', (t) => {
// });
