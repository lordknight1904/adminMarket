import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, MenuItem, Pagination, FormControl, Button } from 'react-bootstrap';
import styles from './BankNavBar.css';
import { setCurrentPage, fetchBanks } from '../../BankActions';
import { getCurrentPage, getMaxPage } from '../../BankReducer';

class BankNavBar extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(fetchBanks(this.props.currentPage - 1));
  }
  handlePage = (eventKey) => {
    this.props.dispatch(setCurrentPage(eventKey));
    this.props.dispatch(fetchBanks(eventKey));
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
              onSelect={this.handlePage}
            />
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

BankNavBar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  maxPage: PropTypes.number.isRequired,
};

BankNavBar.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(BankNavBar);
