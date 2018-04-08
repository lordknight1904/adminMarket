import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import FontIcon from 'material-ui/FontIcon';
import { getUserStatistic } from '../../StatisticActions';
import { getSocket } from '../../../App/AppReducer';

const verticalAlign = {
  verticalAlign: 'middle',
};
const box = {
  width: '300px',
};
class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      today: 0,
      current: 0
    };
  }
  componentDidMount() {
    this.props.dispatch(getUserStatistic()).then((res) => {
      this.setState({ total: res.total, today: res.today });
    });
    this.props.socketIO.userStatistic((message) => {
      this.setState({
        current: message.current,
      });
    });
  }
  render() {
    return (
      <div style={{ width: '100%', margin: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ ...box }}>
          <p>Tổng số khách hàng</p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <FontIcon className="material-icons" style={verticalAlign}>perm_identity</FontIcon>
            <p style={{ display: 'inline-block', margin: '0 0 0 5px', ...verticalAlign }} >{this.state.total}</p>
          </div>
        </div>
        <div style={{ ...box }}>
          <p>Khách hàng đang truy cập</p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <FontIcon className="material-icons" style={verticalAlign}>perm_identity</FontIcon>
            <p style={{ display: 'inline-block', margin: '0 0 0 5px', ...verticalAlign }} >{this.state.current}</p>
          </div>
        </div>
        <div style={{ ...box }}>
          <p>Khách hàng đăng ký hôm nay</p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <FontIcon className="material-icons" style={verticalAlign}>perm_identity</FontIcon>
            <p style={{ display: 'inline-block', margin: '0 0 0 5px', ...verticalAlign }} >{this.state.today}</p>
          </div>
        </div>
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    socketIO: getSocket(state)
  };
}

Customer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  socketIO: PropTypes.object.isRequired,
};

Customer.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Customer);
