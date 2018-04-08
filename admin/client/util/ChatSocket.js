/**
 * Client Socket handle
 */
const io = require('socket.io-client');
export default class ChatSocket {
  constructor() {
    this.connected = false;
    this.socket = io.connect('http://hotcoinex:9000');
  }
  doConnect() {
    this.connected = true;
  }
  userStatistic(callback) {
    this.socket.emit('userStatistic', callback);
  }

  listening(callback) {
    this.socket.on('userStatistic', (message) => {
      callback(message);
    });
  }
}
