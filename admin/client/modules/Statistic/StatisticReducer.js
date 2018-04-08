// Import Actions
import { ACTIONS } from './StatisticActions';
// Initial State
const initialState = {
  id: '',
  userName: '',
  token: '',
};

const StatisticReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default StatisticReducer;
