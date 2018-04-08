import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormControl, Button, Table } from 'react-bootstrap';
import { getCustomerSearch, toggleUser } from '../../CustomerActions';
import { getCustomer, getSearch, getCurrentPage } from '../../CustomerReducer';
import { getId } from '../../../Login/LoginReducer';
import { setNotify } from '../../../App/AppActions';

class CustomerList extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.dispatch(getCustomerSearch(this.props.search, this.props.currentPage - 1));
  }
  onToggleUserProfile = (userProfile) => {
    const user = {
      id: userProfile._id,
      approved: userProfile.approved,
    };
    this.props.dispatch(toggleUser(user)).then((res) => {
      if (res.user === 'missing') {
        this.props.dispatch(setNotify('Thiếu thông tin.'));
      }
      if (res.user === 'error') {
        this.props.dispatch(setNotify('Lỗi duyệt hồ sơ người dùng'));
      }
      if (res.user === 'success') {
        this.props.dispatch(setNotify('Thao tác hoàn tất.'));
        this.props.dispatch(getCustomerSearch(this.props.search, this.props.currentPage - 1));
      }
    })
  };
  render() {
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Tên tài khoản</th>
            <th>Ngày tạo</th>
            <th>Xem thông tin</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
        {
          this.props.customer.map((a, index) => {
            const date = new Date(a.dateCreated);
            const hours =  date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
            const minutes =  date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
            const time = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${hours}:${minutes}`;
            console.log(date);
            return (
              <tr key={index}>
                <td>{a.userName}</td>
                <td>{time}</td>
                <td>
                  <Button onClick={() => this.props.onUserProfile(a)}>Xem</Button>
                </td>
                <td>
                  {
                    a.approved ? (
                      <Button bsStyle="warning" onClick={() => this.onToggleUserProfile(a)} disabled={!a.isSubmitting}>Thu hồi</Button>
                    ) : (
                      <Button bsStyle="danger" onClick={() => this.onToggleUserProfile(a)} disabled={!a.isSubmitting}>Duyệt</Button>
                    )
                  }
                </td>
              </tr>
            )
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
    customer: getCustomer(state),
    currentPage: getCurrentPage(state),
    search: getSearch(state),
    id: getId(state),
  };
}

CustomerList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  customer: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  search: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onUserProfile: PropTypes.func.isRequired,
  onDeposit: PropTypes.func.isRequired,
};

CustomerList.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(CustomerList);
