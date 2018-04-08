import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormControl, Button, Table } from 'react-bootstrap';
import { getAdminSearch } from '../../AdminActions';
import { getAdmin, getSearch, getCurrentPage } from '../../AdminReducer';
import { getId } from '../../../Login/LoginReducer';
import { setNotify } from '../../../App/AppActions';

class AdminList extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.dispatch(getAdminSearch(this.props.search, this.props.currentPage - 1));
  }
  onClick = (type, a) => {
    if (a._id === this.props.id) {
      this.props.dispatch(setNotify('Không thể tự Tước quyền/Khôi phục.'));
    } else {
      this.props.showDialog(type, a._id);
    }
  };
  render() {
    return (
      <Table striped bordered condensed hover>
        <thead>
        <tr>
          <th>Tên tài khoản</th>
          <th>Chức vụ</th>
          <th>Ngày tạo</th>
          <th>Thao tác</th>
        </tr>
        </thead>
        <tbody>
        {
          this.props.admin.map((a, index) => {
            const date = new Date(a.dateCreated);
            const hours =  date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
            const minutes =  date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
            const time = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${hours}:${minutes}`;
            return (
              <tr key={index}>
                <td>{a.userName}</td>
                <td>{a.role}</td>
                <td>{time}</td>
                <td>
                  {
                    (a.disabled) ? (
                      <Button bsStyle="success" onClick={() => this.onClick('Recover', a)}>Khôi phục</Button>
                      ) : (
                      <Button bsStyle="danger" onClick={() => this.onClick('Delete', a)}>Tước quyền</Button>
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
    admin: getAdmin(state),
    currentPage: getCurrentPage(state),
    search: getSearch(state),
    id: getId(state),
  };
}

AdminList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  admin: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  search: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,

  showDialog: PropTypes.func.isRequired,
};

AdminList.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(AdminList);
