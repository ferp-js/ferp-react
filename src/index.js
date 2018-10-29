const { Component, createContext, createElement } = require('react');
const { app, effects, subscriptions } = require('ferp')

const { Provider, Consumer } = createContext({ state: {}, dispatch: () => {} });

class AppProvider extends Component {
  constructor(props) {
    super(props);

    this.interceptUpdateAndSync = this.interceptUpdateAndSync.bind(this);
    this.exposeDispatchSubscription = this.exposeDispatchSubscription.bind(this);

    this.state = {
      ferpState: props.init[0],
      dispatch: null,
    };
  }

  componentDidMount() {
    this.detach = this.createApp();
  }

  createApp() {
    return app({
      init: this.props.init,
      update: this.interceptUpdateAndSync,
      subscribe: (state) => [
        ...this.props.subscribe(state),
        [this.exposeDispatchSubscription],
      ],
    });
  }

  interceptUpdateAndSync(message, state) {
    const result = this.props.update(message, state);
    return [
      result[0],
      effects.batch([
        result[1],
        this.syncEffect(result[0]),
      ]),
    ];
  }

  syncEffect(ferpState) {
    this.setState({ ferpState });
    return effects.none();
  }

  exposeDispatchSubscription() {
    return (dispatch) => {
      this.setState({ dispatch });

      return () => {
        this.setState({ dispatch: null });
      };
    };
  }

  componentWillUnmount() {
    this.detach();
  }

  render() {
    const { ferpState, dispatch } = this.state;

    return createElement(
      Provider,
      {
        value: { state: ferpState, dispatch },
      },
      dispatch && this.props.children,
    );

  }
}

AppProvider.defaultProps = {
  subscribe: () => [],
};

const connect = (Target) => {
  const component = (props) => createElement(
    Consumer,
    null,
    ({ state, dispatch }) => createElement(
      Target,
      Object.assign({}, props, { state, dispatch }),
    )
  );

  component.displayName = `withFerpApp(${Target.displayName || 'Component'})`

  return component;
};

module.exports = {
  AppProvider,
  connect,
};
