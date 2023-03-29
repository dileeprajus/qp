/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { Table, Row, FormGroup, FormControl } from 'react-bootstrap';
import { inject } from 'mobx-react';

@inject('generic_master_store')
class SecondsSchedule extends React.Component {
  constructor(props) {
    super(props);
    // This is not creating new datasource
    this.generic_master_store = this.props.generic_master_store;
    this.scheduler_store = this.props.scheduler_store;
    this.state = {
      currentScheduleOpt: ''
    };
  }

  componentWillMount() {
  }
  componentWillReceiveProps() {
    if(this.props.scheduler_store.newCronString) {
      var tempArr = this.props.scheduler_store.newCronString.split(' ')
      if(tempArr[0]) {
        tempArr[0] = tempArr[0].split('/');
        tempArr[0] = (tempArr[0][1] !== undefined && tempArr[0][1] !== ''&& tempArr[0][1]!=='*') ? tempArr[0][1] : '0'
      }
      this.scheduler_store.currentSecondsScheduleVal = tempArr[0];
    }
  }
  selectItem(event) {
    if(event.target.value !=='select'){
    this.setState({ currentScheduleOpt: event.target.value });
    this.scheduler_store.setvalue(event.target.name, event.target.value);
    var cronStr = this.scheduler_store.retrunCronExpression('Seconds', { seconds: event.target.value });
    this.scheduler_store.setvalue('newCronString', cronStr);
    }
  }
  render() {
    var secondsScheduleList = [];
    for (var i = 5; i <= 59; i++) {
      secondsScheduleList.push(
        <option key={i} value={i}>{i}</option>
      );
    }
    var tableBody = [];
      tableBody.push(
        <tr key={'secondsScheduleTableRow'}>
          <td> Every </td>
          <td>
            <FormGroup controlId="formControlsSelect">
              <FormControl
                  componentClass="select" placeholder="Select Seconds Schedule" name="currentSecondsScheduleVal"
                  onChange={this.selectItem.bind(this)} value={this.scheduler_store.currentSecondsScheduleVal}
              >
                <option value='select' name ='select'>Select</option>
                {secondsScheduleList}
              </FormControl>
            </FormGroup>
          </td>
          <td>second(s)</td>
        </tr>
      );
    return (
      <div key="secondsBasicinfotable">
        <Row>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Allowed Values</th>
                <th>Values</th>
              </tr>
            </thead>
            <tbody>
              {tableBody}
            </tbody>
          </Table>
        </Row>
      </div>
    );
  }
}
SecondsSchedule.propTypes = {
  store: React.PropTypes.object
};

export default SecondsSchedule;
