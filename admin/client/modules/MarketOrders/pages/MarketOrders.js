import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Modal, Table, Button } from 'react-bootstrap';
import MarketOrdersNavBar from '../components/MarketOrdersNavBar/MarketOrdersNavBar';
import MarketOrdersList from '../components/MarketOrdersList/MarketOrdersList';
import { fetchMarketOrders, refresh, auto } from '../MarketOrdersActions';
import { getCurrentPage, getMode } from '../MarketOrdersReducer';
import { getCoinList } from '../../App/AppReducer';
import numeral from 'numeral';

class MarketOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      time: new Date(),
      start: new Date(),
      isView: false,
      oldCurrentPage: 1,
      oldMode: 'standard',
    };
  }
  componentDidMount() {
    this.props.dispatch(fetchMarketOrders(this.props.currentPage - 1, this.props.mode));
    this.timer = setInterval(this.tick, 1000);
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.state.oldMode !== nextProps.mode ||
      this.state.oldCurrentPage !== nextProps.currentPage
    ) {
      this.props.dispatch(fetchMarketOrders(nextProps.currentPage - 1, nextProps.mode));
      this.setState({
        oldCurrentPage: nextProps.currentPage,
        oldMode: nextProps.mode,
      });
    }
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  onDetail = (detail) => {
    this.setState({ detail, isView: true });
  };
  onHide = () => {
    this.setState({ detail: {}, isView: false });
  };
  onTranslate = (str) => {
    switch (str) {
      case 'open': {
        return 'Mở';
      }
      case 'second': {
        return 'Đã đặt';
      }
      case 'third': {
        return 'Đã tải bằng chứng';
      }
      case 'done': {
        return 'Hoàn tất';
      }
      case 'buy': {
        return 'Mua';
      }
      case 'sell': {
        return 'Bán';
      }
      default: return '~';
    }
  };
  tick = () => {
    this.setState({ time: new Date() });
  };
  onRefresh = () => {
    const market = {
      id: this.state.detail._id,
    };
    this.props.dispatch(refresh(market)).then((res) => {
      console.log(res);
    });
  };
  onAuto = () => {
    const market = {
      id: this.state.detail._id,
    };
    this.props.dispatch(auto(market)).then((res) => {
      console.log(res);
    });
  };
  render() {
    const detail = this.state.detail;

    const time = this.state.time;
    const start = new Date(detail.dateSecond);
    const timeLeft = new Date(start - time);
    timeLeft.setHours(timeLeft.getHours() - 7);
    timeLeft.setMinutes(timeLeft.getMinutes() + 15);
    const hours = timeLeft.getHours() < 10 ? `0${timeLeft.getHours()}` : timeLeft.getHours();
    const minutes = timeLeft.getMinutes() < 10 ? `0${timeLeft.getMinutes()}` : timeLeft.getMinutes();
    const seconds = timeLeft.getSeconds() < 10 ? `0${timeLeft.getSeconds()}` : timeLeft.getSeconds();

    const timeStr = `${hours}:${minutes}:${seconds}`;

    const coin = this.props.coinList.filter((c) => { return c.name === detail.coin; });
    const unit = (coin.length > 0) ? coin[0].unit : 0;
    const amount = numeral(detail.amount).value();
    const feeTrade = numeral(detail.feeTrade).value();
    const feeNetwork = numeral(detail.feeNetwork).value();
    return (
      <div>
        <Row>
          <MarketOrdersNavBar />
        </Row>
        <Row>
          <MarketOrdersList onDetail={this.onDetail} />
        </Row>

        <Modal
          show={this.state.isView}
          onHide={this.onHide}
        >
          <Modal.Header>
            <Modal.Title>Thông tin giao dịch</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered condensed hover>
              <tbody>
                <tr>
                  <td>Người đặt</td>
                  <td>{detail.createUser ? detail.createUser.userName : '~'}</td>
                </tr>
                <tr>
                  <td>Lệnh</td>
                  <td>{this.onTranslate(detail.type)}</td>
                </tr>
                <tr>
                  <td>Đồng</td>
                  <td>{detail.coin}</td>
                </tr>
                <tr>
                  <td>Đối tác</td>
                  <td>{detail.userId ? detail.userId.userName : '~'}</td>
                </tr>
                <tr>
                  <td>Trạng thái</td>
                  <td>{this.onTranslate(detail.stage)}</td>
                </tr>
                <tr>
                  <td>Thời gian còn lại</td>
                  <td>{(detail.stage !== 'done' || detail.conflict) ? timeStr : '~'}</td>
                </tr>
                <tr>
                  <td>Tỉ giá</td>
                  <td>{`${numeral(detail.rate).format('0,0')} đ`}</td>
                </tr>
                <tr>
                  <td>Số lượng</td>
                  <td>{numeral(amount / unit).format('0,0.[000000]')}</td>
                </tr>
                <tr>
                  <td>Số lượng thực chuyển</td>
                  <td>{numeral((amount - feeNetwork - feeTrade) / unit).format('0,0.[000000]')}</td>
                </tr>
                <tr>
                  <td>Phí mạng</td>
                  <td>{numeral(feeNetwork / unit).format('0,0.[000000]')}</td>
                </tr>
                <tr>
                  <td>Phí giao dịch</td>
                  <td>{numeral(feeTrade / unit).format('0,0.[000000]')}</td>
                </tr>
                <tr>
                  <td>Bằng chứng chuyển khoản</td>
                  <td>
                    {
                      detail.hasOwnProperty('evidenceDir') ? (
                        <div
                          style={{
                            backgroundImage: `url(/public/${detail.evidenceDir})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'contain',
                            width: '300px',
                            height: '400px',
                          }}
                        />
                      ) : 'Chưa đang bằng chứng chuyển khoản'
                    }
                  </td>
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="warning" bsSize="xsmall" disabled={detail.conflict !== 'conflict'} onClick={this.onRefresh}>
              Hồi phục
            </Button>
            <Button bsStyle="danger" bsSize="xsmall" disabled={detail.stage !== 'conflict'} onClick={this.onAuto}>
              Tự động
            </Button>
            <Button bsSize="xsmall" onClick={this.onHide}>Thoát</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    currentPage: getCurrentPage(state),
    mode: getMode(state),
    coinList: getCoinList(state),
  };
}

MarketOrders.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  mode: PropTypes.string.isRequired,
  coinList: PropTypes.array.isRequired,
};

MarketOrders.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(MarketOrders);
