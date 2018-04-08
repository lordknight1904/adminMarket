// Import Actions
import { ACTIONS } from './MarketOrdersActions';
// Initial State
const initialState = {
  currentPage: 1,
  maxPage: 1,
  marketOrders: [],
  mode: 'standard',
};

const MarketOrdersReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_MODE:
      return { ...state, mode: action.mode };
    case ACTIONS.SET_CONFIRMATION:
      return { ...state, confirmations: action.confirmations };
    case ACTIONS.SET_MARKET_ORDERS_CURRENT_PAGE:
      return { ...state, currentPage: action.page };
    case ACTIONS.SET_MARKET_ORDERS_MAX_PAGE:
      return { ...state, maxPage: action.page };
    case ACTIONS.SET_MARKET_ORDERS:
      return { ...state, marketOrders: action.market };
    default:
      return state;
  }
};

export const getMode = state => state.marketOrders.mode;
export const getCurrentPage = state => state.marketOrders.currentPage;
export const getMaxPage = state => state.marketOrders.maxPage;
export const getMarketOrders = state => state.marketOrders.marketOrders;

export default MarketOrdersReducer;

