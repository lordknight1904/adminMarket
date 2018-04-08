import callApi from '../../util/apiCaller';
// Export Constants
export const ACTIONS = {
  SET_BANK_CURRENT_PAGE: 'SET_BANK_CURRENT_PAGE',
  SET_BANK_MAX_PAGE: 'SET_BANK_MAX_PAGE',
  SET_BANKS: 'SET_BANKS',
};
export function setCurrentPage(page) {
  return {
    type: ACTIONS.SET_BANK_CURRENT_PAGE,
    page,
  };
}
export function setBank(banks) {
  return {
    type: ACTIONS.SET_BANKS,
    banks,
  };
}
export function fetchBanks(page) {
  return (dispatch) => {
    return callApi(`bank?search=${page}`, 'get', '').then(res => {
      dispatch(setBank(res.banks));
    });
  };
}
export function updateBank(bank) {
  return () => {
    return callApi('bank', 'put', '', { bank }).then(res => {
      return res;
    });
  };
}
export function createBank(bank) {
  return () => {
    return callApi('bank', 'post', '', { bank }).then(res => {
      return res;
    });
  };
}
