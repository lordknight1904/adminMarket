import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Modal, Table, Button, Form, FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import CustomerNavBar from '../components/CustomerNavBar/CustomerNavBar';
import CustomerList from '../components/CustomerList/CustomerList';
import { createDeposit } from '../CustomerActions';
import { setNotify } from '../../App/AppActions';
import numeral from 'numeral';

class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: {},
      isView: false,
      userDepositId: '',
      isDeposit: false,
      value: 0,
    };
  }
  onUserProfile = (userProfile) => {
    this.setState({ userProfile, isView: true });
  };
  onHide = () => {
    this.setState({ userProfile: {}, isView: false });
  };
  onDeposit = (userDepositId) => {
    this.setState({ userDepositId, isDeposit: true });
  };
  onHideDeposit = () => {
    this.setState({ userDepositId: '', isDeposit: false });
  };
  onValue = (event) => {
    const number = numeral(event.target.value).format('0,0.[000000]');
    this.setState({ value: number });
  };
  deposit = () => {
    if (numeral(this.state.value).value() < 0) {
      this.props.dispatch(setNotify('Giá trị phải lớn hơn 0'));
      return;
    }
    const deposit = {
      userId: this.state.userDepositId,
      value: numeral(this.state.value).value(),
    };
    this.props.dispatch(createDeposit(deposit)).then((res) => {
      this.setState({ isDeposit: false, userDepositId: '' });
      if (res.deposit.code === 'success') {
        this.props.dispatch(setNotify('Nạp tiền thành công.'));
      } else {
        this.props.dispatch(setNotify('Nạp tiền không thành công.'));
      }
    });
  };
  render() {
    return (
      <div>
        <Row>
          <CustomerNavBar />
        </Row>
        <Row>
          <CustomerList onUserProfile={this.onUserProfile} onDeposit={this.onDeposit} />
        </Row>

        <Modal
          show={this.state.isView}
          onHide={this.onHide}
        >
          <Modal.Header>
            <Modal.Title>Thông tin khách hàng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered condensed hover>
              <tbody>
                <tr>
                  <td>Full name</td>
                  <td>{this.state.userProfile.realName}</td>
                </tr>
                <tr>
                  <td>Phone</td>
                  <td>{this.state.userProfile.phone}</td>
                </tr>
                <tr>
                  <td>Identity Verification Photo</td>
                  <td>
                    <img  width={200} height={150} src={`/public/${this.state.userProfile.imageDir}`} />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.onHide}>Thoát</Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.isDeposit}
          onHide={this.onHideDeposit}
        >
          <Modal.Header>
            <Modal.Title>Nạp tiền</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Form>
              <FormGroup controlId='formAmount'>
                <ControlLabel>Giá trị (USDT)</ControlLabel>
                <FormControl autoComplete='off' type="text" value={this.state.value} onChange={this.onValue}/>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.deposit}>Nạp</Button>
            <Button onClick={this.onHideDeposit}>Thoát</Button>
          </Modal.Footer>
        </Modal>

      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
  };
}

Customer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

Customer.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Customer);
