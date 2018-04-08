// Import Actions
import { ACTIONS } from './SettingActions';
// Initial State
const initialState = {
  currentPage: 1,
  maxPage: 1,
  setting: [],
};

const SettingReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_SETTING_MAX_PAGE:
      return { ...state, maxPage: action.maxPage };
    case ACTIONS.SET_SETTING_CURRENT_PAGE:
      return { ...state, currentPage: action.currentPage };
    case ACTIONS.SET_SETTING:
      return { ...state, setting: action.setting };
    default:
      return state;
  }
};

export const getSearch = state => state.setting.search;
export const getCurrentPage = state => state.setting.currentPage;
export const getMaxPage = state => state.setting.maxPage;
export const getSetting = state => state.setting.setting;

export default SettingReducer;

