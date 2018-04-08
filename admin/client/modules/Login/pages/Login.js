import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, FormGroup, FormControl, Col, Row, Button, ControlLabel, Panel, HelpBlock } from 'react-bootstrap';
import { loginRequest } from '../LoginActions';
import {  } from '../LoginReducer';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',

      userNameError: '',
      passwordError: '',

      isSigningIn: false,
      error: '',
    };
  }

  onSigningIn = () => {
    const admin = {
      userName: this.state.userName,
      password: this.state.password,
    };
    this.setState({ isSigningIn: true });
    this.props.dispatch(loginRequest(admin)).then((res) => {
      const response = res ? res.code : '';
      switch (response) {
        case 'login fail': {
          this.setState({ error: 'Không thể đăng nhập.', isSigningIn: false });
          break;
        }
        case 'success': {
          this.context.router.push('/statistic');
          break;
        }
        default: {

        }
      }
    });
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
      this.setState({ userNameError: '' });
    }
  };
  handlePasswordBlur = (event) => {
    if (event.target.value.trim() === '') {
      this.setState({ passwordError: 'Trườg này không được trống.'});
    } else {
      this.setState({ passwordError: '' });
    }
  };
  onKeyDown = (event) => {
    if (event.keyCode === 13) {
      this.onSigningIn();
    }
  };

  render() {
    return (
      <Col xs={12} mdOffset={4} md={4} style={{ transform: 'translateY(100%)' }}>
        <Panel header="Đăng nhập trang quản trị VND Exchange">
          <Form horizontal style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            <FormGroup controlId="formHorizontalEmail">
              <FormControl
                type="text"
                value={this.state.userName}
                onChange={this.handleUserName}
                onBlur={this.handleUserNameBlur}
                onKeyDown={this.onKeyDown}
                placeholder="Tài khoản"
              />
            </FormGroup>

            <FormGroup controlId="formHorizontalPassword">
              <FormControl
                type="password"
                value={this.state.password}
                onChange={this.handlePassword}
                onBlur={this.handlePasswordBlur}
                onKeyDown={this.onKeyDown}
                placeholder="Mật khẩu"
              />
            </FormGroup>

            <FormGroup>
              <Button bsStyle="success" block disabled={this.state.isSigningIn} onClick={this.onSigningIn}>
                Đăng nhập
              </Button>
            </FormGroup>

            <FormGroup controlId="error" validationState='error' style={{ display: (this.state.error === '') ? 'none' : 'block' }} >
              <HelpBlock>{this.state.error}</HelpBlock>
            </FormGroup>
          </Form>
        </Panel>
      </Col>
    );
  }
}
// Retrieve data from store as props
function mapStateToProps(state) {
  return {
  };
}

Login.propTypes = {
  dispatch: PropTypes.func,
};

Login.contextTypes = {
  router: React.PropTypes.object,
};

export default connect(mapStateToProps)(Login);
