import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Fee from '../components/Fee/Fee';
import Order from '../components/Order/Order';
import Customer from '../components/Customer/Customer';

class Statistic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchData: [],
      category: [],
      coin: [],
      usdt: [],
    };
  }
  // so luong khach hang
  // so lenh dat/khop trong ngay
  render() {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: '20px' }}>
        <Customer />
        <Order />
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
  };
}

Statistic.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

Statistic.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Statistic);
