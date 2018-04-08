import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, MenuItem, Pagination, FormControl, Button } from 'react-bootstrap';
import styles from './SettingNavBar.css';
import { setCurrentPage, fetchSetting } from '../../SettingActions';
import { getCurrentPage, getMaxPage } from '../../SettingReducer';

class SettingNavBar extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(fetchSetting(this.props.currentPage - 1));
  }
  hanldePage = (eventKey) => {
    this.props.dispatch(setCurrentPage(eventKey));
    this.props.dispatch(fetchSetting(eventKey));
  };
  search = () => {
    this.props.dispatch(fetchSetting(this.props.currentPage - 1));
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
              items={1}
              maxButtons={5}
              onSelect={this.hanldePage}
            />
          </NavItem>
          <NavItem>
            <Button bsStyle="success" onClick={this.search}>Tìm kiếm</Button>
          </NavItem>
        </Nav>
        <Nav pullRight>
          <NavItem>
            <Button bsStyle="success" onClick={this.props.onCreate}>Thêm</Button>
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    currentPage: getCurrentPage(state),
    maxPage: getMaxPage(state),
  };
}

SettingNavBar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  maxPage: PropTypes.number.isRequired,
};

SettingNavBar.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(SettingNavBar);
