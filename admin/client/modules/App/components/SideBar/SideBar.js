import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getUserName, getId } from '../../../Login/LoginReducer';
import { logout } from '../../../Login/LoginActions';
import { Tab, Row, Col, Nav, NavItem } from 'react-bootstrap';
import styles from '../../App.css';

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  handleSelect = (eventKey) => {
    if (eventKey !== 'logOut') {
      this.context.router.push(`/${eventKey}`);
    } else {
      this.props.dispatch(logout());
    }
  };
  render() {
    return (
      <Tab.Container id="left-tabs-example" defaultActiveKey="statistic">
        <Row className={`clearfix ${styles.sideBar}`}>
          <Nav bsStyle="pills" stacked onSelect={this.handleSelect}>
            <NavItem eventKey="statistic">
              Thống kê
            </NavItem>
            <NavItem eventKey="admin">
              Quản trị viên
            </NavItem>
            <NavItem eventKey="customer">
              Khách hàng
            </NavItem>
            <NavItem eventKey="market">
              Lệnh giao dịch
            </NavItem>
            <NavItem eventKey="bank">
              Ngân hàng
            </NavItem>
            <NavItem eventKey="setting">
              Cấu hình
            </NavItem>
            <NavItem eventKey="logOut">
              Đăng xuất
            </NavItem>
          </Nav>
        </Row>
      </Tab.Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    // userName: getUserName(state),
    // id: getId(state),
  };
}
SideBar.propTypes = {
  dispatch: PropTypes.func,
  // userName: PropTypes.string.isRequired,
  // id: PropTypes.string.isRequired,
};
SideBar.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(SideBar);
