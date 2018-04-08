import callApi from '../../util/apiCaller';
// Export Constants
export const ACTIONS = {
  SET_MARKET_ORDERS_CURRENT_PAGE: 'SET_MARKET_ORDERS_CURRENT_PAGE',
  SET_MARKET_ORDERS_MAX_PAGE: 'SET_MARKET_ORDERS_MAX_PAGE',
  SET_MARKET_ORDERS: 'SET_MARKET_ORDERS',
  SET_MARKET_ORDERS_TOGGLE: 'SET_MARKET_ORDERS_TOGGLE',
  SET_MARKET_ORDERS_DETAIL: 'SET_MARKET_ORDERS_DETAIL',
  CLOSE_MARKET_ORDERS: 'CLOSE_MARKET_ORDERS',
  SET_CONFIRMATION: 'SET_CONFIRMATION',
  SET_TX_HASH: 'SET_TX_HASH',
  SET_MODE: 'SET_MODE',
};
export function setMode(mode) {
  return {
    type: ACTIONS.SET_MODE,
    mode,
  };
}
export function setTxHash(txHash) {
  return {
    type: ACTIONS.SET_TX_HASH,
    txHash,
  };
}
export function setConfirmation(confirmations) {
  return {
    type: ACTIONS.SET_CONFIRMATION,
    confirmations,
  };
}
export function setMarketOrdersDetail(transaction) {
  return {
    type: ACTIONS.SET_MARKET_ORDERS_DETAIL,
    transaction
  };
}
export function getConfirmation(coin, txHash) {
  return (dispatch) => {
    return callApi(`transaction/hash/${coin}/${txHash}`, 'get', '').then(res => {
      dispatch(setConfirmation(res.confirmations));
    });
  };
}
export function fix() {
  return () => {
    return callApi('transaction/fix', 'post', '').then(() => {});
  };
}
export function closeMarketOrdersDetail() {
  return {
    type: ACTIONS.CLOSE_MARKET_ORDERS,
  };
}
export function setToggle(toggle) {
  return {
    type: ACTIONS.SET_MARKET_ORDERS_TOGGLE,
    toggle,
  };
}
export function setCurrentPage(page) {
  return {
    type: ACTIONS.SET_MARKET_ORDERS_CURRENT_PAGE,
    page,
  };
}
export function setMaxPage(page) {
  return {
    type: ACTIONS.SET_MARKET_ORDERS_MAX_PAGE,
    page,
  };
}
export function setMarketOrders(market) {
  return {
    type: ACTIONS.SET_MARKET_ORDERS,
    market,
  };
}
export function fetchMarketOrders(page, mode) {
  return (dispatch) => {
    return callApi(`market?page=${page}&mode=${mode}`, 'get', '').then(res => {
      dispatch(setMarketOrders(res.market));
      dispatch(setMaxPage(res.count));
      dispatch(setCurrentPage(1));
    });
  };
}
export function refresh(market) {
  return () => {
    return callApi('market/refresh', 'post', '', market).then(res => {
      return res
    });
  };
}
export function auto(market) {
  return () => {
    return callApi('market/auto', 'post', '', market).then(res => {
      return res
    });
  };
}
