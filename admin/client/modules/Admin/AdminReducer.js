// Import Actions
import { ACTIONS } from './AdminActions';
// Initial State
const initialState = {
  search: '',
  currentPage: 1,
  maxPage: 0,
  admin: [],
};

const AdminReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_ADMIN_SEARCH:
      return { ...state, search: action.search };
    case ACTIONS.SET_ADMIN_CURRENT_PAGE:
      return { ...state, currentPage: action.page };
    case ACTIONS.SET_ADMIN_MAX_PAGE:
      return { ...state, maxPage: action.page };
    case ACTIONS.SET_ADMIN:
      return { ...state, admin: action.admin };
    default:
      return state;
  }
};

export const getSearch = state => state.admin.search;
export const getCurrentPage = state => state.admin.currentPage;
export const getMaxPage = state => state.admin.maxPage;
export const getAdmin = state => state.admin.admin;

export default AdminReducer;

