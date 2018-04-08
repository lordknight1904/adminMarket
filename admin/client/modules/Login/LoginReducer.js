// Import Actions
import { ACTIONS } from './LoginActions';
// Initial State
const initialState = {
  id: '',
  userName: '',
  token: '',
};

const LoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return { ...state, id: action.admin.id,  userName: action.admin.userName, token: action.admin.token };
    case ACTIONS.LOGOUT: {
      return {...state, id: '', userName: '', token: ''};
    }
    default:
      return state;
  }
};

export const getId = state => state.login.id;
export const getUserName = state => state.login.userName;
export const getToken = state => state.login.token;

export default LoginReducer;
