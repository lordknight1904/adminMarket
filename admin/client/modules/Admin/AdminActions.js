import callApi from '../../util/apiCaller';
// Export Constants
export const ACTIONS = {
  SET_ADMIN_SEARCH: 'SET_ADMIN_SEARCH',
  SET_ADMIN_CURRENT_PAGE: 'SET_ADMIN_CURRENT_PAGE',
  SET_ADMIN_MAX_PAGE: 'SET_ADMIN_MAX_PAGE',
  SET_ADMIN: 'SET_ADMIN',
};
export function setSearch(search) {
  return {
    type: ACTIONS.SET_ADMIN_SEARCH,
    search
  };
}
export function setCurrentPage(page) {
  return {
    type: ACTIONS.SET_ADMIN_CURRENT_PAGE,
    page
  };
}
export function setMaxPage(page) {
  return {
    type: ACTIONS.SET_ADMIN_MAX_PAGE,
    page
  };
}
export function setAdmin(admin) {
  return {
    type: ACTIONS.SET_ADMIN,
    admin
  };
}

export function getAdminSearch(search, page) {
  return (dispatch) => {
    return callApi(`admin?search=${search}&page=${page}`, 'get', '' ).then(res => {
      dispatch(setAdmin(res.admin));
    });
  };
}

export function deleteAdmin(del) {
  return () => {
    return callApi('admin/delete', 'post', '', {del}).then(res => {
      return res;
    });
  };
}
export function recoverAdmin(recover) {
  return () => {
    return callApi('admin/recover', 'post', '', {recover}).then(res => {
      return res;
    });
  };
}
export function createAdmin(admin) {
  return () => {
    return callApi('admin', 'post', '', {admin}).then(res => {
      return res.admin;
    });
  };
}
