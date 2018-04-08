/**
 * Root Reducer
 */
import { combineReducers } from 'redux';

// Import Reducers
import app from './modules/App/AppReducer';
import login from './modules/Login/LoginReducer';
import admin from './modules/Admin/AdminReducer';
import customer from './modules/Customer/CustomerReducer';
import statistic from './modules/Statistic/StatisticReducer';
import setting from './modules/Setting/SettingReducer';
import marketOrders from './modules/MarketOrders/MarketOrdersReducer';
import banks from './modules/Bank/BankReducer';

// Combine all reducers into one root reducer
export default combineReducers({
  app,
  login,
  admin,
  customer,
  statistic,
  setting,
  marketOrders,
  banks,
});
