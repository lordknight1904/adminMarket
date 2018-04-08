// Import Actions
import { ACTIONS } from './AppActions';

// Initial State
const initialState = {
  isNotify: false,
  message: '',
  coinList: [
    { name: 'USDT', unit: 100000, fee: 0 },
    { name: 'BTC', unit: 100000000, fee: 50000 },
    { name: 'ETH', unit: 1000000000000000000, fee: 0 },
  ],
  socketIO: {},
};

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_CHAT_SOCKET:
      return { ...state, socketIO: action.socketIO };
    case ACTIONS.SET_NOTIFY:
      return { ...state, isNotify: true, message: action.message };
    case ACTIONS.CLOSE_NOTIFY:
      return { ...state, isNotify: false, message: '' };
    default:
      return state;
  }
};

export const getIsNotify = state => state.app.isNotify;
export const getMessage = state => state.app.message;
export const getCoinList = state => state.app.coinList;
export const getSocket = state => state.app.socketIO;
// Export Reducer
export default AppReducer;
