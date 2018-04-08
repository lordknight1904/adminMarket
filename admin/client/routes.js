/* eslint-disable global-require */
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './modules/App/App';

// require.ensure polyfill for node
if (typeof require.ensure !== 'function') {
  require.ensure = function requireModule(deps, callback) {
    callback(require);
  };
}

/* Workaround for async react routes to work with react-hot-reloader till
  https://github.com/reactjs/react-router/issues/2182 and
  https://github.com/gaearon/react-hot-loader/issues/288 is fixed.
 */
if (process.env.NODE_ENV !== 'production') {
  // Require async routes only in development for react-hot-reloader to work.
  require('./modules/Login/pages/Login');
  require('./modules/Home/pages/Home');
  require('./modules/Customer/pages/Customer');
  require('./modules/Admin/pages/Admin');
  require('./modules/Statistic/pages/Statistic');
  require('./modules/Setting/pages/Setting');
  require('./modules/MarketOrders/pages/MarketOrders');
  require('./modules/Bank/pages/Bank');
}

// react-router setup with code-splitting
// More info: http://blog.mxstbr.com/2016/01/react-apps-with-pages/
export default (
  <Route path="/" component={App}>
    <IndexRoute
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Login/pages/Login').default);
        });
      }}
    />
    <Route
      path="/market"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/MarketOrders/pages/MarketOrders').default);
        });
      }}
    />
    <Route
      path="/setting"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Setting/pages/Setting').default);
        });
      }}
    />
    <Route
      path="/statistic"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Statistic/pages/Statistic').default);
        });
      }}
    />
    <Route
      path="/home"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Home/pages/Home').default);
        });
      }}
    />
    <Route
      path="/admin"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Admin/pages/Admin').default);
        });
      }}
    />
    <Route
      path="/customer"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Customer/pages/Customer').default);
        });
      }}
    />
    <Route
      path="/bank"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Bank/pages/Bank').default);
        });
      }}
    />
  </Route>
);
