import callApi from '../../util/apiCaller';
// Export Constants
export const ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
};

export function login(admin) {
  return {
    type: ACTIONS.LOGIN,
    admin
  };
}
export function logout() {
  return {
    type: ACTIONS.LOGOUT,
  };
}
export function loginRequest(admin) {
  return (dispatch) => {
    return callApi('admin/login', 'post', '', {admin}).then(res => {
      if (res.admin && res.admin.code === 'success') {
        dispatch(login(res.admin.admin));
      }
      return res.admin;
    });
  };
}
