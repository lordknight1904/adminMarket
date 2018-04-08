import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import fusionCharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';
import { getOrderStatistic } from '../../StatisticActions';
import { getCoinList } from '../../../App/AppReducer';

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchData: [],
      data: [],
      selectedCoin: 'BTC',
      days: 30,
      category: [],
      open: [],
      close: [],
    };
    charts(fusionCharts);
  }
  componentDidMount() {
    this.fetchData(this.state.selectedCoin, this.state.days);
  }
  changeCoin = (eventKey) => {
    this.setState({ selectedCoin: eventKey });
    this.fetchData(eventKey, this.state.days);
  };
  changeDate = (eventKey) => {
    this.setState({ days: eventKey });
    this.fetchData(this.state.selectedCoin, eventKey);
  };
  fetchData = (coin, days) => {
    this.props.dispatch(getOrderStatistic(days, coin)).then((res) => {
      const category = [];
      const open = [];
      const close = [];
      console.log(res);
      res.order.map((t, index) => {
        category.push({ label: (index % 7 === 0) ? t.label : '' });
        open.push({ value: t.open });
        close.push({ value: t.close });
      });
      this.setState({
        category,
        open,
        close,
      });
    });
  };
  render() {
    const category = this.state.category;
    const open = this.state.open;
    const close = this.state.close;
    const myDataSource = {
      chart: {
        caption: 'Lệnh đặt/đóng trong ngày',
        xAxisName: 'Ngày',
        yAxisName: `Tổng cộng(${this.state.selectedCoin})`,
        paletteColors: '#0075c2, #1aaf5d',
        showHoverEffect: '1',
        use3DLighting: '0',
        showaxislines: '1',
        theme: 'hulk-light',
        showBorder: '0',
      },
      // data: this.state.data,
      categories: [{ category }],
      dataset: [
        {
          seriesname: 'Đang mở',
          data: open,
        },
        {
          seriesname: 'Đóng',
          data: close,
        },
      ],
    };
    const chartConfigs = {
      id: 'order-chart',
      type: 'MSArea',
      width: '100%',
      height: 400,
      dataFormat: 'json',
      dataSource: myDataSource,
    };
    return (
      <div style={{ width: '45%', minWidth: '500px', margin: 'auto' }}>
        <ReactFC {...chartConfigs} />
        <DropdownButton bsStyle="primary" bsSize="xsmall" title={this.state.selectedCoin} id="bg-nested-dropdown" onSelect={this.changeCoin}>
          <MenuItem eventKey="BTC">BTC</MenuItem>
          <MenuItem eventKey="ETH">ETH</MenuItem>
        </DropdownButton>
        <DropdownButton bsStyle="primary" bsSize="xsmall" title={`${this.state.days} ngày trước`} id="bg-nested-dropdown" onSelect={this.changeDate}>
          <MenuItem eventKey="30">30 ngày trước</MenuItem>
          <MenuItem eventKey="60">60 ngày trước</MenuItem>
          <MenuItem eventKey="90">90 ngày trước</MenuItem>
        </DropdownButton>
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    coinList: getCoinList(state),
  };
}

Order.propTypes = {
  dispatch: PropTypes.func.isRequired,
  coinList: PropTypes.array.isRequired,
};

Order.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Order);
