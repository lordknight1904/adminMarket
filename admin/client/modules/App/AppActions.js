import callApi from '../../util/apiCaller';
import localStorage from 'localStorage';
// Export Constants
export const ACTIONS = {
  SET_NOTIFY: 'SET_NOTIFY',
  CLOSE_NOTIFY: 'CLOSE_NOTIFY',
  SET_CHAT_SOCKET: 'SET_CHAT_SOCKET',
};

export function setSocket(socketIO) {
  return {
    type: ACTIONS.SET_CHAT_SOCKET,
    socketIO
  };
}
export function setNotify(message) {
  return {
    type: ACTIONS.SET_NOTIFY,
    message
  };
}
export function closeNotify() {
  return {
    type: ACTIONS.CLOSE_NOTIFY,
  };
}
