/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { Table, Row, Col } from 'react-bootstrap';

class AlertsSummaryTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      table_info: {
        TotalNumberofAlerts: 10,
        SuccessTransactions: 0,
        FailedTransactions: 0
      }
    };
  }

  componentWillMount() {
  }
  render() {
    var tableBody = [];
    for(var info in this.state.table_info){
      var prop_val = String(this.state.table_info[info]);
      tableBody.push(
        <tr key={info}>
          <td> {info} </td>
          <td key={this.state.table_info[info]}>{prop_val}</td>
        </tr>
      );
    }
    return (
      <div key="alert_summary_table">
        <Row className="show-grid">
          <Col xs={12} sm={12} md={12} lg={12}>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>Property Name</th>
                  <th>Property Value</th>
                </tr>
              </thead>
              <tbody>
                {tableBody}
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}
Table.propTypes = {
  store: React.PropTypes.object
};

export default AlertsSummaryTable;
