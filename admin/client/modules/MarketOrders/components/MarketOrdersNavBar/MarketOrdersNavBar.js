import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, Pagination, Checkbox, Button } from 'react-bootstrap';
import styles from './MarketOrdersNavBar.css';
import { setCurrentPage, setMode } from '../../MarketOrdersActions';
import { getCurrentPage, getMaxPage, getMode, getMarketOrders } from '../../MarketOrdersReducer';
import { Radio, RadioGroup } from 'react-radio-group';

class MarketOrdersNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
    };
  }
  onMode = (value) => {
    this.props.dispatch(setMode(value));
  };
  handlePage = (eventKey) => {
    this.props.dispatch(setCurrentPage(eventKey - 1));
  };
  render() {
    return (
      <Navbar className={styles.cointain}>
        <Nav>
          <NavItem componentClass="span">
            <Pagination
              bsSize="small"
              first
              last
              boundaryLinks
              activePage={this.props.currentPage}
              items={this.props.maxPage}
              maxButtons={5}
              onSelect={this.handlePage}
            />
          </NavItem>
          <NavItem>
            <RadioGroup selectedValue={this.props.mode} onChange={this.onMode}>
              <Radio value="conflict" />&nbsp;Xung đột&nbsp;
              <Radio value="ongoing" />&nbsp;Đang thực hiện&nbsp;
              <Radio value="done" />&nbsp;Hoàn tất&nbsp;
              <Radio value="standard" />&nbsp;Tất cả&nbsp;
            </RadioGroup>
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    mode: getMode(state),
    currentPage: getCurrentPage(state),
    maxPage: getMaxPage(state),
    marketOrders: getMarketOrders(state),
  };
}

MarketOrdersNavBar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  maxPage: PropTypes.number.isRequired,
  marketOrders: PropTypes.array.isRequired,
  mode: PropTypes.string.isRequired,
};

MarketOrdersNavBar.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(MarketOrdersNavBar);
