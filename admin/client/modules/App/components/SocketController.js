import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setSocket } from '../AppActions';
import { getSocket } from '../AppReducer';
import ChatSocketObj from '../../../util/ChatSocket';

export class SocketController extends Component {
  componentDidMount() {
    Promise.resolve(this.props.dispatch(setSocket(new ChatSocketObj()))).then(() => {
      this.isDidMount = true;
      this.props.socketIO.listening((message) => {
        switch (message.code) {
          case 'userStatistic': {
            console.log(message);
            break;
          }
          default: {
            break;
          }
        }
      });
    });
  }
  componentWillReceiveProps(props) {
    if (this.isDidMount === false) {
      return;
    }
    this.connectToServer(props);
  }

  connectToServer(props) {
    props.socketIO.doConnect({ });
    props.dispatch(setSocket(props.socketIO));
  }
  render() {
    return null;
  }
}
SocketController.propTypes = {
  dispatch: PropTypes.func.isRequired,
  socketIO: PropTypes.object.isRequired,
};
// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    socketIO: getSocket(state),
  };
}

export default connect(mapStateToProps)(SocketController);
