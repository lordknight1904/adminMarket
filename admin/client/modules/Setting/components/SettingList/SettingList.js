import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox, Table, Button } from 'react-bootstrap';
import {} from '../../SettingActions';
import { getSetting, getCurrentPage } from '../../SettingReducer';
import { getId } from '../../../Login/LoginReducer';
import { setNotify } from '../../../App/AppActions';

class SettingList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Giá trị</th>
            <th>Vô hiệu</th>
            <th>Thao tác</th>
            <th>Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
        {
          this.props.setting.map((a, index) => {
            const date = new Date(a.dateCreated);
            const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
            const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
            const time = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${hours}:${minutes}`;
            return (
              <tr key={index}>
                <td>{a.name}</td>
                <td>{a.value}</td>
                <td>
                  <Checkbox checked={a.disabled} onClick={() => this.props.onToggle(a)} />
                </td>
                <td>
                  <Button bsStyle="primary" bsSize="xs" onClick={() => this.props.onEdit(a)}>Sửa</Button>
                </td>
                <td>{time}</td>
              </tr>
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
    setting: getSetting(state),
    currentPage: getCurrentPage(state),
    id: getId(state),
  };
}

SettingList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  setting: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
};

SettingList.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(SettingList);
