/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { Table, Row, FormGroup, FormControl, Radio } from 'react-bootstrap';
import { inject } from 'mobx-react';

@inject('generic_master_store')
class MonthsSchedulePurge extends React.Component {
  constructor(props) {
    super(props);
    // This is not creating new datasource
    this.generic_master_store = this.props.generic_master_store;
    this.scheduler_purge_store = this.props.scheduler_purge_store;
    this.state = {
      currentMinuteScheduleVal: 0,
      currentSecondsScheduleVal: 0,
      currentHourScheduleVal: 0,
      currentDayScheduleVal: 1,
      currentSelectedDayType: 'Every',
      currentSelectedMonthType: 'Day',
      currentMonthScheduleVal: 0,
      currentMonthSpecsScheduleVal: 1,
      currentWeekDayScheduleVal: 'MON'
    };
  }

  componentWillMount() {
  }
  selectItem(event) {
    var obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
    this.scheduler_purge_store.setvalue(event.target.name, event.target.value);
    var cronStr = this.scheduler_purge_store.retrunCronExpression('Months',
      {
        type: this.scheduler_purge_store.currentSelectedMonthType ? this.scheduler_purge_store.currentSelectedMonthType : this.state.currentSelectedMonthType,
        months: this.scheduler_purge_store.currentMonthScheduleVal ? this.scheduler_purge_store.currentMonthScheduleVal : this.state.currentMonthScheduleVal,
        monthSpecs: this.scheduler_purge_store.currentMonthSpecsScheduleVal ? this.scheduler_purge_store.currentMonthSpecsScheduleVal : this.state.currentMonthSpecsScheduleVal,
        weekDays: this.scheduler_purge_store.currentWeekDayScheduleVal ? this.scheduler_purge_store.currentWeekDayScheduleVal : this.state.currentWeekDayScheduleVal,
        days: this.scheduler_purge_store.currentDayScheduleVal ? this.scheduler_purge_store.currentDayScheduleVal : this.state.currentDayScheduleVal,
        hours: this.scheduler_purge_store.currentHourScheduleVal ? this.scheduler_purge_store.currentHourScheduleVal : this.state.currentHourScheduleVal,
        minutes: this.scheduler_purge_store.currentMinuteScheduleVal ? this.scheduler_purge_store.currentMinuteScheduleVal : this.state.currentMinuteScheduleVal,
        seconds: this.scheduler_purge_store.currentSecondsScheduleVal ? this.scheduler_purge_store.currentSecondsScheduleVal : this.state.currentSecondsScheduleVal
      });
    this.scheduler_purge_store.setvalue('newCronString', cronStr);
  }
  onChangeRadio(event) {
    this.setState({ currentSelectedMonthType: event.target.value });
    this.scheduler_purge_store.setvalue('currentSelectedMonthType', event.target.value);
    var cronStr = this.scheduler_purge_store.retrunCronExpression('Months',
      {
        type: event.target.value,
        months: this.scheduler_purge_store.currentMonthScheduleVal ? this.scheduler_purge_store.currentMonthScheduleVal : this.state.currentMonthScheduleVal,
        monthSpecs: this.scheduler_purge_store.currentMonthSpecsScheduleVal ? this.scheduler_purge_store.currentMonthScheduleVal : this.state.currentMonthSpecsScheduleVal,
        weekDays: this.scheduler_purge_store.currentWeekDayScheduleVal ? this.scheduler_purge_store.currentWeekDayScheduleVal : this.state.currentWeekDayScheduleVal,
        days: this.scheduler_purge_store.currentDayScheduleVal ? this.scheduler_purge_store.currentDayScheduleVal : this.state.currentDayScheduleVal,
        hours: this.scheduler_purge_store.currentHourScheduleVal ? this.scheduler_purge_store.currentHourScheduleVal : this.state.currentHourScheduleVal,
        minutes: this.scheduler_purge_store.currentMinuteScheduleVal ? this.scheduler_purge_store.currentMinuteScheduleVal : this.state.currentMinuteScheduleVal,
        seconds: this.scheduler_purge_store.currentSecondsScheduleVal ? this.scheduler_purge_store.currentSecondsScheduleVal : this.state.currentSecondsScheduleVal
      });
    this.scheduler_purge_store.setvalue('newCronString', cronStr);
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
  returnArrList(arr, type) {
    var a = [];
    for (var i = 0; i < arr.length; i++) {
      var name = arr[i];
      if (type === 'WeekDay') {
        name = arr[i].toUpperCase().substring(0, 3); //for weekday name is like MON/TUE/WED.....
      } else if (type === 'MonthSpecs') {
        name = i + 1;
      }
      a.push(
        <option key={arr[i]} name={name} value={name}>{arr[i]}</option>
      );
    }
    return a;
  }
  render() {
    var weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var monthSpecs = ['First', 'Second', 'Third', 'Fourth'];
    var weekDaysList = this.returnArrList(weekDays, 'WeekDay');
    var monthSpecsList = this.returnArrList(monthSpecs, 'MonthSpecs');
    var monthsScheduleList = this.returnList(1, 12, 'currentMonthScheduleVal');
    var daysScheduleList = this.returnList(1, 30, 'currentDayScheduleVal');
    var hoursScheduleList = this.returnList(0, 23, 'currentHourScheduleVal');
    var minutesScheduleList = this.returnList(0, 59, 'currentMinuteScheduleVal');
    var secondsScheduleList = this.returnList(0, 59, 'currentSecondsScheduleVal');
    var tableBody = [];
    tableBody.push(
      <tr key={'monthsScheduleTableRowDay'}>
        <td>
          <FormGroup>
            <Radio name="monthsSchedule" value="Day" inline onChange={this.onChangeRadio.bind(this)} defaultChecked={(this.state.currentSelectedMonthType === 'Day')? true : false}>Day</Radio>
          </FormGroup>
        </td>
        <td>
          <FormGroup controlId="formControlsSelect">
            <FormControl
                componentClass="select" placeholder="Select Days Schedule" name="currentDayScheduleVal"
                onChange={this.selectItem.bind(this)} value={this.scheduler_purge_store.currentDayScheduleVal ? this.scheduler_purge_store.currentDayScheduleVal : this.state.currentDayScheduleVal}
            >
              {daysScheduleList}
            </FormControl>
          </FormGroup>
        </td>
        <td>of every</td>
        <td>
          <FormGroup controlId="formControlsSelect">
            <FormControl
                componentClass="select" placeholder="Select Months Schedule" name="currentMonthScheduleVal"
                onChange={this.selectItem.bind(this)} value={this.scheduler_purge_store.currentMonthScheduleVal ? this.scheduler_purge_store.currentMonthScheduleVal : this.state.currentMonthScheduleVal}
            >
              {monthsScheduleList}
            </FormControl>
          </FormGroup>
        </td>
        <td>month(s)</td>
      </tr>
    );
    tableBody.push(
      <tr key={'daysScheduleTableRowEveryWeekDay'}>
        <td>
          <FormGroup>
            <Radio name="monthsSchedule" value="WeekDay" inline onChange={this.onChangeRadio.bind(this)} checked={(this.state.currentSelectedMonthType === 'WeekDay')? true : false}></Radio>
          </FormGroup>
        </td>
        <td>
          <FormGroup controlId="formControlsSelect">
            <FormControl
                componentClass="select" placeholder="Select Months Specs Schedule" name="currentMonthSpecsScheduleVal"
                onChange={this.selectItem.bind(this)} value={this.scheduler_purge_store.currentMonthSpecsScheduleVal ? this.scheduler_purge_store.currentMonthSpecsScheduleVal : this.state.currentMonthSpecsScheduleVal}
            >
              {monthSpecsList}
            </FormControl>
          </FormGroup>
        </td>
        <td>
          <FormGroup controlId="formControlsSelect">
            <FormControl
                componentClass="select" placeholder="Select Week Day Schedule" name="currentWeekDayScheduleVal"
                onChange={this.selectItem.bind(this)} value={this.scheduler_purge_store.currentWeekDayScheduleVal ? this.scheduler_purge_store.currentWeekDayScheduleVal : this.state.currentWeekDayScheduleVal}
            >
              {weekDaysList}
            </FormControl>
          </FormGroup>
        </td>
        <td>of every</td>
        <td>
          <FormGroup controlId="formControlsSelect">
            <FormControl
                componentClass="select" placeholder="Select Months Schedule" name="currentMonthScheduleVal"
                onChange={this.selectItem.bind(this)} value={this.scheduler_purge_store.currentMonthScheduleVal ? this.scheduler_purge_store.currentMonthScheduleVal : this.state.currentMonthScheduleVal}
            >
              {monthsScheduleList}
            </FormControl>
          </FormGroup>
        </td>
        <td>month(s)</td>
      </tr>
    );
    tableBody.push(
      <tr key={'hourMinuteSecondsScheduleRowInDays'}>
        <td>at</td>
        <td>
          <FormGroup controlId="formControlsSelect">
            <FormControl
                componentClass="select" placeholder="Select Hours Schedule" name="currentHourScheduleVal"
                onChange={this.selectItem.bind(this)} value={this.scheduler_purge_store.currentHourScheduleVal ? this.scheduler_purge_store.currentHourScheduleVal : this.state.currentHourScheduleVal}
            >
              {hoursScheduleList}
            </FormControl>
          </FormGroup>
        </td>
        <td>hour</td>
        <td>
          <FormGroup controlId="formControlsSelect">
            <FormControl
                componentClass="select" placeholder="Select Minutes Schedule" name="currentMinuteScheduleVal"
                onChange={this.selectItem.bind(this)} value={this.scheduler_purge_store.currentMinuteScheduleVal?this.scheduler_purge_store.currentMinuteScheduleVal : this.state.currentMinuteScheduleVal}
            >
              {minutesScheduleList}
            </FormControl>
          </FormGroup>
        </td>
        <td>minute</td>
        <td>
          <FormGroup controlId="formControlsSelect">
            <FormControl
                componentClass="select" placeholder="Select Seconds Schedule" name="currentSecondsScheduleVal"
                onChange={this.selectItem.bind(this)} value={this.scheduler_purge_store.currentSecondsScheduleVal ? this.scheduler_purge_store.currentSecondsScheduleVal : this.state.currentSecondsScheduleVal}
            >
              {secondsScheduleList}
            </FormControl>
          </FormGroup>
        </td>
        <td>second</td>
      </tr>
    );
    return (
      <div key="daysBasicinfotable">
        <Row>
          <Table striped bordered condensed hover>
            <tbody>
              {tableBody}
            </tbody>
          </Table>
        </Row>
      </div>
    );
  }
}
MonthsSchedulePurge.propTypes = {
  store: React.PropTypes.object
};

export default MonthsSchedulePurge;
