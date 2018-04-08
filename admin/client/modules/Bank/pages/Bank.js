import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Modal, Table, Button, Form, FormGroup, FormControl, ControlLabel, Col, HelpBlock } from 'react-bootstrap';
import BankNavBar from '../components/BankNavBar/BankNavBar';
import BankList from '../components/BankList/BankList';
import { updateBank, createBank, fetchBanks } from '../BankActions';
import { getCurrentPage } from '../BankReducer';
import { setNotify } from '../../App/AppActions';

class Bank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreate: false,
      isCreating: false,
      name: '',
      value: '',
      error: '',

      isEdit: false,
      isEditing: false,
      selectedBank: {},
      nameEdit: '',
      errorEdit: '',
    };
  }
  onCreate = () => {
    this.setState({ isCreate: true });
  };
  onHide = () => {
    this.setState({ isCreate: false });
  };
  onSubmit = () => {
    if (this.state.name.trim() === '') {
      this.setState({ error: 'Nhập tên ngân hàng.' });
      return;
    }
    const bank = {
      name: this.state.name,
    };
    this.setState({ error: '' });
    this.setState({ isCreating: true });
    this.props.dispatch(createBank(bank)).then((res) => {
      this.setState({ isCreating: false });
      this.props.dispatch(setNotify(res.bank));
      this.props.dispatch(fetchBanks(this.props.currentPage - 1));
      if (res.bank === 'Thêm ngân hàng thành công') {
        this.setState({ name: '', isCreate: false });
      }
    });
  };
  onToggle = (bank) => {
    const toggleBank = bank;
    toggleBank.disabled = !bank.disabled;
    this.props.dispatch(updateBank(toggleBank)).then(() => {
      this.props.dispatch(fetchBanks(this.props.currentPage - 1));
    });
  };
  onEdit = (selectedBank) => {
    this.setState({ isEdit: true, selectedBank, nameEdit: selectedBank.name });
  };
  onHideEdit = () => {
    this.setState({ isEdit: false });
  };
  onSubmitEdit = () => {
    if (this.state.nameEdit.trim() === '') {
      this.setState({ errorEdit: 'Nhập tên ngân hàng.' });
      return;
    }
    const bank = {
      id: this.state.selectedBank._id,
      name: this.state.nameEdit,
    };
    this.setState({ isEditing: true });
    this.props.dispatch(updateBank(bank)).then((res) => {
      this.setState({ isEditing: false });
      if (res.bank === 'Chỉnh sửa thành công') {
        this.setState({ selectedBank: {}, valueEdit: '', isEdit: false, errorEdit: '' });
        this.props.dispatch(fetchBanks(this.props.currentPage - 1));
      } else {
        this.setState({ errorEdit: res.bank });
      }
    });
  };
  handleName = (event) => {
    this.setState({ name: event.target.value });
  };
  handleNameEdit = (event) => {
    this.setState({ nameEdit: event.target.value });
  };
  render() {
    return (
      <div>
        <Row>
          <BankNavBar onCreate={this.onCreate} />
        </Row>
        <Row>
          <BankList onToggle={this.onToggle} onEdit={this.onEdit} />
        </Row>

        <Modal
          show={this.state.isCreate}
          onHide={this.onHide}
        >
          <Modal.Header>
            <Modal.Title>Thêm Ngân hàng mới</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal>
              <FormGroup>
                <Col componentClass={ControlLabel} md={2}>
                  Tên
                </Col>
                <Col md={10}>
                  <FormControl
                    type="text"
                    value={this.state.name}
                    onChange={this.handleName}
                  />
                </Col>
              </FormGroup>

              <FormGroup controlId="error" validationState="error" >
                <Col md={6} mdOffset={3} >
                  <HelpBlock>{this.state.error}</HelpBlock>
                </Col>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button disabled={this.state.isCreating} onClick={this.onHide}>{this.state.isCreating ? 'Đang gửi' : 'Thoát'}</Button>
            <Button disabled={this.state.isCreating} onClick={this.onSubmit}>{this.state.isCreating ? 'Đang gửi' : 'Tạo'}</Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.isEdit}
          onHide={this.onHideEdit}
        >
          <Modal.Header>
            <Modal.Title>Chỉnh sửa cấu hình</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal>
              <FormGroup>
                <Col componentClass={ControlLabel} md={2}>
                  Tên
                </Col>
                <Col md={10}>
                  <FormControl
                    type="text"
                    value={this.state.nameEdit}
                    onChange={this.handleNameEdit}
                  />
                </Col>
              </FormGroup>

              <FormGroup controlId="error" validationState="error" >
                <Col md={6} mdOffset={3} >
                  <HelpBlock>{this.state.error}</HelpBlock>
                </Col>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button disabled={this.state.isEditing} onClick={this.onHideEdit}>{this.state.isCreating ? 'Đang gửi' : 'Thoát'}</Button>
            <Button disabled={this.state.isEditing} onClick={this.onSubmitEdit}>{this.state.isCreating ? 'Đang gửi' : 'Sửa'}</Button>
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
  };
}

Bank.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
};

Bank.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Bank);
