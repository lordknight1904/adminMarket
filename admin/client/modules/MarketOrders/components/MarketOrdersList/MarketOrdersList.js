import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormControl, Button, Table } from 'react-bootstrap';
import { fetchMarketOrders, setConfirmation, getConfirmation, setTxHash } from '../../MarketOrdersActions';
import { getMarketOrders, getMaxPage, getCurrentPage } from '../../MarketOrdersReducer';
import { getId } from '../../../Login/LoginReducer';
import { setNotify } from '../../../App/AppActions';
import { getCoinList } from '../../../App/AppReducer';
import numeral from 'numeral';
import MarketOrdersDetail from './MarketOrdersDetail';

class MarketOrdersList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Table striped bordered condensed hover style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th style={{ width: '8%' }}>Tg. còn lại</th>
            <th style={{ width: '20%' }}>Tài khoản</th>
            <th style={{ width: '4%' }}>Lệnh</th>
            <th style={{ width: '20%' }}>Đối tác</th>
            <th style={{ width: '8%' }}>T.thái</th>
            <th style={{ width: '10%' }}>Thực chuyển</th>
            <th style={{ width: '10%' }}>Phí mạng</th>
            <th style={{ width: '10%' }}>Phí g.d</th>
            <th style={{ width: '10%' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
        {
          this.props.marketOrders.map((m, index) => {
            return (
              <MarketOrdersDetail detail={m} key={index} onDetail={this.props.onDetail} />
            );
          })
        }
        </tbody>
      </Table>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    marketOrders: getMarketOrders(state),
    currentPage: getCurrentPage(state),
    maxPage: getMaxPage(state),
    coinList: getCoinList(state),
  };
}

MarketOrdersList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onDetail: PropTypes.func.isRequired,
  marketOrders: PropTypes.array.isRequired,
  coinList: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  maxPage: PropTypes.number.isRequired,
};

MarketOrdersList.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(MarketOrdersList);
