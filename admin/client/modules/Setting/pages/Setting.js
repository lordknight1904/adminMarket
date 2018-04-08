import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Modal, Table, Button, Form, FormGroup, FormControl, ControlLabel, Col, HelpBlock } from 'react-bootstrap';
import SettingNavBar from '../components/SettingNavBar/SettingNavBar';
import SettingList from '../components/SettingList/SettingList';
import { updateSetting, createSetting, fetchSetting } from '../SettingActions';
import { getCurrentPage } from '../SettingReducer';
import { setNotify } from '../../App/AppActions';

class Customer extends Component {
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
      selectedSetting: {},
      valueEdit: '',
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
      this.setState({ error: 'Nhập tên cấu hình.' });
      return;
    }
    if (this.state.value.trim() === '') {
      this.setState({ error: 'Nhập giá trị cấu hình.' });
      return;
    }
    const setting = {
      name: this.state.name,
      value: this.state.value,
    };
    this.setState({ error: '' });
    this.setState({ isCreating: true });
    this.props.dispatch(createSetting(setting)).then((res) => {
      this.setState({ isCreating: false });
      this.props.dispatch(setNotify(res.setting));
      this.props.dispatch(fetchSetting(this.props.currentPage - 1));
      if (res.setting === 'Tạo cấu hình thành công.') {
        this.setState({ name: '', value: '', isCreate: false });
      }
    });
  };
  onToggle = (setting) => {
    const toggleSetting = setting;
    toggleSetting.disabled = !setting.disabled;
    this.props.dispatch(updateSetting(toggleSetting)).then(() => {
      this.props.dispatch(fetchSetting(this.props.currentPage - 1));
    });
  };
  onEdit = (selectedSetting) => {
    this.setState({ isEdit: true, selectedSetting, valueEdit: selectedSetting.value });
  };
  onHideEdit = () => {
    this.setState({ isEdit: false });
  };
  onSubmitEdit = () => {
    if (this.state.valueEdit.trim() === '') {
      this.setState({ errorEdit: 'Nhập giá trị cấu hình.' });
      return;
    }
    const setting = {
      _id: this.state.selectedSetting._id,
      name: this.state.selectedSetting.name,
      value: this.state.valueEdit,
    };
    this.setState({ isEditing: true });
    this.props.dispatch(updateSetting(setting)).then((res) => {
      this.setState({ isEditing: false });
      if (res.setting === 'Chỉnh sửa thành công.') {
        this.setState({ selectedSetting: {}, valueEdit: '', isEdit: false, errorEdit: '' });
        this.props.dispatch(fetchSetting(this.props.currentPage - 1));
      } else {
        this.setState({ errorEdit: res.settting });
      }
    });
  };
  handleName = (event) => {
    this.setState({ name: event.target.value });
  };
  handleValue = (event) => {
    this.setState({ value: event.target.value });
  };
  handleValueEdit = (event) => {
    this.setState({ valueEdit: event.target.value });
  };
  render() {
    return (
      <div>
        <Row>
          <SettingNavBar onCreate={this.onCreate} />
        </Row>
        <Row>
          <SettingList onToggle={this.onToggle} onEdit={this.onEdit} />
        </Row>

        <Modal
          show={this.state.isCreate}
          onHide={this.onHide}
        >
          <Modal.Header>
            <Modal.Title>Thêm Cấu hình mới</Modal.Title>
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

              <FormGroup>
                <Col componentClass={ControlLabel} md={2}>
                  Giá trị
                </Col>
                <Col md={10}>
                  <FormControl
                    type="text"
                    value={this.state.value}
                    onChange={this.handleValue}
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
                    defaultValue={this.state.selectedSetting.name}
                    disabled
                  />
                </Col>
              </FormGroup>

              <FormGroup>
                <Col componentClass={ControlLabel} md={2}>
                  Giá trị
                </Col>
                <Col md={10}>
                  <FormControl
                    type="text"
                    value={this.state.valueEdit}
                    onChange={this.handleValueEdit}
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

Customer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
};

Customer.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Customer);
