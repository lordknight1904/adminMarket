import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox, Table, Button } from 'react-bootstrap';
import {} from '../../BankActions';
import { getBanks, getCurrentPage } from '../../BankReducer';
import { getId } from '../../../Login/LoginReducer';
import { setNotify } from '../../../App/AppActions';

class BankList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
        {
          this.props.banks.map((a, index) => {
            return (
              <tr key={index}>
                <td>{a.name}</td>
                <td>
                  <Button bsStyle="primary" bsSize="xs" onClick={() => this.props.onEdit(a)}>Sửa</Button>
                </td>
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
    banks: getBanks(state),
    currentPage: getCurrentPage(state),
    id: getId(state),
  };
}

BankList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  banks: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
};

BankList.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(BankList);
