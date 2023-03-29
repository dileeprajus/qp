/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { Table, Row, FormGroup, FormControl } from 'react-bootstrap';
import { inject } from 'mobx-react';

@inject('generic_master_store')
class HoursSchedule extends React.Component {
  constructor(props) {
    super(props);
    // This is not creating new datasource
    this.generic_master_store = this.props.generic_master_store;
    this.scheduler_store = this.props.scheduler_store;
    this.state = {
      currentMinuteScheduleVal: '',
      currentSecondsScheduleVal: '',
      currentHourScheduleVal: ''
    };
  }

  componentWillMount() {
    
  }
  componentWillReceiveProps() {
    if(this.props.scheduler_store.newCronString) {
      var tempArr = this.props.scheduler_store.newCronString.split(' ')
      if(tempArr[1]) {
        tempArr[1] = tempArr[1].split('/');
        tempArr[1] = (tempArr[1][0] !== undefined && tempArr[1][0] !== ''&& tempArr[1][0]!=='*') ? tempArr[1][1] : '0'
      }
      if(tempArr[2]) {
        tempArr[2] = tempArr[2].split('/');
        tempArr[2] = (tempArr[2][1] !== undefined && tempArr[2][1] !== ''&& tempArr[2][1]!=='*') ? tempArr[2][1] : '0'
      }
      this.scheduler_store.currentMinuteScheduleVal = tempArr[1];
      this.scheduler_store.currentSecondsScheduleVal = (tempArr[0] !== ''&& tempArr[0]!=='*') ? tempArr[0] :'0';
      this.scheduler_store.currentHourScheduleVal = tempArr[2];
    }
  }
  selectItem(event) {
    var obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
    this.scheduler_store.setvalue(event.target.name, event.target.value);
    var cronStr = this.scheduler_store.retrunCronExpression('Hours',
      {
        hours: this.scheduler_store.currentHourScheduleVal ? this.scheduler_store.currentHourScheduleVal : this.state.currentHourScheduleVal,
        minutes: this.scheduler_store.currentMinuteScheduleVal ? this.scheduler_store.currentMinuteScheduleVal : this.state.currentMinuteScheduleVal,
        seconds: this.scheduler_store.currentSecondsScheduleVal ? this.scheduler_store.currentSecondsScheduleVal : this.state.currentSecondsScheduleVal
      });
    this.scheduler_store.setvalue('newCronString', cronStr);
  }
  returnList(start, end) {
    var arr = [];
    for (var i = start; i <= end; i++) {
      arr.push(
        <option key={i} value={i}>{i}</option>
      );
    }
    return arr;
  }
  render() {
    var hoursScheduleList = this.returnList(0, 23, 'currentHourScheduleVal');
    var minutesScheduleList = this.returnList(0, 59, 'currentMinuteScheduleVal');
    var secondsScheduleList = this.returnList(0, 59, 'currentSecondsScheduleVal');
    var tableBody = [];
    tableBody.push(
      <tr key={'hoursScheduleTableRow'}>
        <td> Every </td>
        <td>
          <FormGroup controlId="formControlsSelect">
            <FormControl
                componentClass="select" placeholder="Select Hours Schedule" name="currentHourScheduleVal"
                onChange={this.selectItem.bind(this)} value={this.scheduler_store.currentHourScheduleVal ? this.scheduler_store.currentHourScheduleVal : this.state.currentHourScheduleVal}
            >
              {hoursScheduleList}
            </FormControl>
          </FormGroup>
        </td>
        <td>hour(s)</td>
      </tr>
    );
    tableBody.push(
      <tr key={'minutesScheduleTableRowInHours'}>
        <td> at </td>
        <td>
          <FormGroup controlId="formControlsSelect">
            <FormControl
                componentClass="select" placeholder="Select Minutes Schedule" name="currentMinuteScheduleVal"
                onChange={this.selectItem.bind(this)} value={this.scheduler_store.currentMinuteScheduleVal?this.scheduler_store.currentMinuteScheduleVal : this.state.currentMinuteScheduleVal}
            >
              {minutesScheduleList}
            </FormControl>
          </FormGroup>
        </td>
        <td>minute(s)</td>
      </tr>
    );
    tableBody.push(
      <tr key={'secondsScheduleTableRowInMinute'}>
        <td> and </td>
        <td>
          <FormGroup controlId="formControlsSelect">
            <FormControl
                componentClass="select" placeholder="Select Seconds Schedule" name="currentSecondsScheduleVal"
                onChange={this.selectItem.bind(this)} value={this.scheduler_store.currentSecondsScheduleVal ? this.scheduler_store.currentSecondsScheduleVal : this.state.currentSecondsScheduleVal}
            >
              {secondsScheduleList}
            </FormControl>
          </FormGroup>
        </td>
        <td>second(s)</td>
      </tr>
    );
    return (
      <div key="hoursBasicinfotable">
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
HoursSchedule.propTypes = {
  store: React.PropTypes.object
};

export default HoursSchedule;
