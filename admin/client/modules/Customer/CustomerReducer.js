// Import Actions
import { ACTIONS } from './CustomerActions';
// Initial State
const initialState = {
  search: '',
  currentPage: 1,
  customer: [],
};

const CustomerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_CUSTOMER_SEARCH:
      return { ...state, search: action.search };
    case ACTIONS.SET_CUSTOMER_CURRENT_PAGE:
      return { ...state, currentPage: action.page };
    case ACTIONS.SET_CUSTOMER:
      return { ...state, customer: action.customer };
    default:
      return state;
  }
};

export const getSearch = state => state.customer.search;
export const getCurrentPage = state => state.customer.currentPage;
export const getMaxPage = state => state.customer.maxPage;
export const getCustomer = state => state.customer.customer;

export default CustomerReducer;

