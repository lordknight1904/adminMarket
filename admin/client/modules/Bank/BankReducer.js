// Import Actions
import { ACTIONS } from './BankActions';
// Initial State
const initialState = {
  currentPage: 1,
  maxPage: 1,
  banks: [],
};

const BankReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_BANK_MAX_PAGE:
      return { ...state, maxPage: action.maxPage };
    case ACTIONS.SET_BANK_CURRENT_PAGE:
      return { ...state, currentPage: action.currentPage };
    case ACTIONS.SET_BANKS:
      return { ...state, banks: action.banks };
    default:
      return state;
  }
};

export const getSearch = state => state.banks.search;
export const getCurrentPage = state => state.banks.currentPage;
export const getMaxPage = state => state.banks.maxPage;
export const getBanks = state => state.banks.banks;

export default BankReducer;

