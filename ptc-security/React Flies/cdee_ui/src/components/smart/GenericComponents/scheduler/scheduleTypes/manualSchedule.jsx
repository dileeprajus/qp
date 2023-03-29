/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { Table, Row, FormControl } from 'react-bootstrap';
import { inject } from 'mobx-react';

@inject('generic_master_store')
class ManualSchedule extends React.Component {
  constructor(props) {
    super(props);
    // This is not creating new datasource
    this.generic_master_store = this.props.generic_master_store;
    this.scheduler_store = this.props.scheduler_store;
    this.state = {
      scheduleVal: '',
      currentScheduleOpt: '',
      enable: false
    };
  }

  componentWillReceiveProps(props, state) {
    if(props.scheduler_store.newCronString) {
      if(this.state.enable) {
      var tempArr = props.scheduler_store.newCronString.split(' ')
        this.scheduler_store.manualSchedule['Seconds'].value = tempArr[0] ? tempArr[0] :'0/1';
        this.scheduler_store.manualSchedule['Minutes'].value =  tempArr[1] ? tempArr[1] :'*';
        this.scheduler_store.manualSchedule['Hours'].value =  tempArr[2] ? tempArr[2] :'*';
        this.scheduler_store.manualSchedule['DayOfWeek'].value =   tempArr[5] ? tempArr[5] :'*';
        this.scheduler_store.manualSchedule['Month'].value =  tempArr[4] ? tempArr[4] :'*';
        this.scheduler_store.manualSchedule['DayOfTheMonth'].value = tempArr[3] ? tempArr[3] :'*';
        this.setState({enable: false})
      }}

  }
  componentWillMount() {
    this.setState({enable: true})
  }
  onChange(key, name, event) {
    var manualScheduleObj = this.scheduler_store.manualSchedule;
    manualScheduleObj[key]['value'] = event.target.value;
    this.setState({ currentScheduleOpt: name, scheduleVal: event.target.value });
    this.scheduler_store.setvalue('manualSchedule', manualScheduleObj);
    var cronStr = this.scheduler_store.retrunCronExpression('Manual',
      {
        dayOfMonth:  this.scheduler_store.manualSchedule.DayOfTheMonth.value,
        month: this.scheduler_store.manualSchedule.Month.value,
        weeks: this.scheduler_store.manualSchedule.DayOfWeek.value ? this.scheduler_store.manualSchedule.DayOfWeek.value : this.scheduler_store.currentSelectedWeekDayVal,
        hours: this.scheduler_store.manualSchedule.Hours.value ? this.scheduler_store.manualSchedule.Hours.value : this.scheduler_store.currentHourScheduleVal,
        minutes: this.scheduler_store.manualSchedule.Minutes.value ? this.scheduler_store.manualSchedule.Minutes.value : this.scheduler_store.currentMinuteScheduleVal,
        seconds: this.scheduler_store.manualSchedule.Seconds.value ? this.scheduler_store.manualSchedule.Seconds.value : this.scheduler_store.currentSecondsScheduleVal
      });
    this.scheduler_store.setvalue('newCronString', cronStr);
  }
  render() {
    var tableBody = [];
    for (var i in this.scheduler_store.manualSchedule) {
      tableBody.push(
        <tr key={this.scheduler_store.manualSchedule[i] + ' - ' + i}>
          <td> {this.scheduler_store.manualSchedule[i].name} </td>
          <td> {this.scheduler_store.manualSchedule[i].allowedValues} </td>
          <td>
            <FormControl
              type="text" name={this.scheduler_store.manualSchedule[i].name}
              value={this.scheduler_store.manualSchedule[i].value ? this.scheduler_store.manualSchedule[i].value : (this.scheduler_store.manualSchedule[i].name === this.state.currentScheduleOpt ? this.state.scheduleVal : this.scheduler_store.manualSchedule[i].value)}
              onChange={this.onChange.bind(this, i, this.scheduler_store.manualSchedule[i].name)} />
          </td>
        </tr>
      );
    }
    return (
      <div key="manualBasicinfotable">
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
ManualSchedule.propTypes = {
  store: React.PropTypes.object
};

export default ManualSchedule;
