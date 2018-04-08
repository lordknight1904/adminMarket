import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AdminNavBar from '../components/AdminNavBar/AdminNavBar';
import AdminList from '../components/AdminList/AdminList';
import { getId } from '../../Login/LoginReducer';
import { Modal, Button, Form, FormGroup, FormControl, Col, Row, ControlLabel, Panel, HelpBlock } from 'react-bootstrap';
import { deleteAdmin, recoverAdmin, createAdmin, getAdminSearch } from '../AdminActions';
import { getSearch, getCurrentPage } from '../AdminReducer';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      idSelected: '',
      show: false,
      message: '',

      register: false,
      userName: '',
      password: '',
      role: 'admin',
      userNameError: '',
      passwordError: '',
      isSigningIn: false,
      error: '',
    }
  }
  componentWillMount() {
    if (this.props.id === '') {
      this.context.router.push('/');
    }
  }
  showDialog = (type, id) => {
    console.log('alo');
    this.setState({ show: true, type, idSelected: id });
  };
  hideDialog = () => {
    this.setState({ show: false });
  };
  onXacNhan = () => {
    switch (this.state.type) {
      case 'Delete': {
        const del = {
          id: this.state.idSelected
        };
        this.props.dispatch(deleteAdmin(del)).then((res) => {
          if (res.admin !== 'success') {
            this.setState({ message: res.admin });
          } else {
            this.setState({ message: '', show: false });
            this.props.dispatch(getAdminSearch(this.props.search, this.props.currentPage -1));
          }
        });
        break;
      }
      case 'Recover': {
        const recover = {
          id: this.state.idSelected
        };
        this.props.dispatch(recoverAdmin(recover)).then((res) => {
          if (res.admin !== 'success') {
            this.setState({ message: res.admin });
          } else {
            this.setState({ message: '', show: false });
            this.props.dispatch(getAdminSearch(this.props.search, this.props.currentPage -1));
          }
        });
        break;
      }
      default: break;
    }
  };
  translateType = (type) => {
    switch (type) {
      case 'Recover': return 'Khôi phục';
      case 'Delete': return 'Tước quyền';
      default: return '';
    }
  };

  onRegister = () => {
    this.setState({ register: true });
  };
  hideRegister = () => {
    this.setState({ register: false });
  };
  onCreateAdmin = () => {
    const admin = {
      userName: this.state.userName,
      password: this.state.password,
      role: this.state.role,
    };
    this.setState({ isSigningIn: true });
    this.props.dispatch(createAdmin(admin)).then((res) => {
      const response = res ? res.code : '';
      switch (response) {
        case 'error': {
          this.setState({ error: 'Không thể đăng nhập.', isSigningIn: false });
          break;
        }
        case 'Thiếu thông tin': {
          this.setState({ error: 'Vui lòng nhập đủ thông tin', isSigningIn: false });
          break;
        }
        case 'success': {
          this.setState({ isSigningIn: false, register: false });
          this.props.dispatch(getAdminSearch(this.props.search, this.props.currentPage -1));
          break;
        }
        default: {

        }
      }
    })
  };
  handleUserName = (event) => {
    if (event.target.value.trim() === '') {
      this.setState({ userName: event.target.value.trim(), userNameError: 'Trường này không được trống.' });
    } else {
      this.setState({ userName: event.target.value.trim(), userNameError: ''});
    }
  };
  handlePassword = (event) => {
    if (event.target.value.trim() === '') {
      this.setState({ password: event.target.value.trim(), passwordError: 'Trường này không được trống.' });
    } else {
      this.setState({ password: event.target.value.trim(), passwordError: '' });
    }
  };
  handleUserNameBlur = (event) => {
    if (event.target.value.trim() === '') {
      this.setState({ userNameError: 'Trường này không được trống.'});
    } else {
      this.setState({ userNameError: ''});
    }
  };
  handlePasswordBlur = (event) => {
    if (event.target.value.trim() === '') {
      this.setState({ passwordError: 'Trườg này không được trống.'});
    } else {
      this.setState({ passwordError: ''});
    }
  };
  handleRole = (event) => {
    this.setState({ role: event.target.value });
  };
  render() {
    return (
      <div>
        <Row>
          <AdminNavBar onRegister={this.onRegister}/>
        </Row>
        <Row>
          <AdminList showDialog={this.showDialog}/>
        </Row>

        <Modal
          show={this.state.show}
          onHide={this.hideDialog}
        >
          <Modal.Header>
            <Modal.Title>Xác nhận</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {`${this.translateType(this.state.type)} quản trị viên này.`}
            <br/>
            <FormGroup controlId="error" validationState='error' >
              <HelpBlock>{this.state.message}</HelpBlock>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideDialog}>Hủy</Button>
            <Button bsStyle="primary" onClick={this.onXacNhan}>{this.translateType(this.state.type)}</Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.register}
          onHide={this.hideRegister}
        >
          <Modal.Header>
            <Modal.Title>Tạo quản trị viên mới</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal>
              <FormGroup controlId="formHorizontalEmail">
                <Col componentClass={ControlLabel} sm={2}>
                  Tên tài khoản
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={this.state.userName}
                    onChange={this.handleUserName}
                    onBlur={this.handleUserNameBlur}
                  />
                </Col>
              </FormGroup>

              <FormGroup controlId="formHorizontalPassword">
                <Col componentClass={ControlLabel} sm={2}>
                  Mật khẩu
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="password"
                    value={this.state.password}
                    onChange={this.handlePassword}
                    onBlur={this.handlePasswordBlur}
                  />
                </Col>
              </FormGroup>

              <FormGroup  controlId="formControlsSelect">
                <Col componentClass={ControlLabel} sm={2}>
                  Chức vụ
                </Col>
                <Col sm={10}>
                  <FormControl componentClass="select" onChange={this.handleRole} >
                    <option value="admin">Quản trị viên</option>
                    <option value="employee">Nhân viên</option>
                  </FormControl>
                </Col>
              </FormGroup>

              <FormGroup controlId="error" validationState='error' >
                <Col sm={6} smOffset={3} >
                  <HelpBlock>{this.state.error}</HelpBlock>
                </Col>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideRegister} disabled={this.state.isSigningIn}>Hủy</Button>
            <Button bsStyle="primary" onClick={this.onCreateAdmin} disabled={this.state.isSigningIn}>Tạo</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    id: getId(state),
    search: getSearch(state),
    currentPage: getCurrentPage(state),
  };
}

Admin.propTypes = {
  dispatch: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  currentPage: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
};

Admin.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Admin);
