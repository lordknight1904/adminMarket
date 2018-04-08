import callApi from '../../util/apiCaller';
// Export Constants
export const ACTIONS = {
};

export function getFeeByDay(date, coin) {
  return () => {
    return callApi(`transaction/fee/${date}/${coin}`, 'get', '').then(res => {
      return res;
    });
  };
}
export function getUserStatistic() {
  return () => {
    return callApi('user/statistic', 'get', '').then(res => {
      return res;
    });
  };
}
export function getOrderStatistic(date, coin) {
  return () => {
    return callApi(`order/statistic/${date}/${coin}`, 'get', '').then(res => {
      return res;
    });
  };
}
