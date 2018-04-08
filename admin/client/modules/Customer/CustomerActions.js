import callApi from '../../util/apiCaller';
// Export Constants
export const ACTIONS = {
  SET_CUSTOMER_SEARCH: 'SET_CUSTOMER_SEARCH',
  SET_CUSTOMER_CURRENT_PAGE: 'SET_CUSTOMER_CURRENT_PAGE',
  SET_CUSTOMER: 'SET_CUSTOMER',
};
export function setSearch(search) {
  return {
    type: ACTIONS.SET_CUSTOMER_SEARCH,
    search
  };
}
export function setCurrentPage(page) {
  return {
    type: ACTIONS.SET_CUSTOMER_CURRENT_PAGE,
    page
  };
}
export function setCustomer(customer) {
  return {
    type: ACTIONS.SET_CUSTOMER,
    customer
  };
}
export function getCustomerSearch(search, page) {
  return (dispatch) => {
    return callApi(`user?search=${search}&page=${page}`, 'get', '' ).then(res => {
      dispatch(setCustomer(res.user));
    });
  };
}
export function toggleUser(user) {
  return () => {
    return callApi('user', 'put', '', { user }).then(res => {
      return res;
    });
  };
}
export function denyUser(user) {
  return () => {
    return callApi('user/deny', 'put', '', { user }).then(res => {
      return res;
    });
  };
}
export function createDeposit(deposit) {
  return () => {
    return callApi('deposit', 'post', '', { deposit }).then(res => {
      return res;
    });
  };
}
