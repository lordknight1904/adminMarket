import callApi from '../../util/apiCaller';
// Export Constants
export const ACTIONS = {
  SET_SETTING_CURRENT_PAGE: 'SET_SETTING_CURRENT_PAGE',
  SET_SETTING_MAX_PAGE: 'SET_SETTING_MAX_PAGE',
  SET_SETTING: 'SET_SETTING',
};
export function setCurrentPage(page) {
  return {
    type: ACTIONS.SET_SETTING_CURRENT_PAGE,
    page,
  };
}
export function setSetting(setting) {
  return {
    type: ACTIONS.SET_SETTING,
    setting,
  };
}
export function fetchSetting(page) {
  return (dispatch) => {
    return callApi(`setting?search=${page}`, 'get', '').then(res => {
      dispatch(setSetting(res.setting));
    });
  };
}
export function updateSetting(setting) {
  return () => {
    return callApi('setting', 'put', '', { setting }).then(res => {
      return res;
    });
  };
}
export function createSetting(setting) {
  return () => {
    return callApi('setting', 'post', '', { setting }).then(res => {
      return res;
    });
  };
}
