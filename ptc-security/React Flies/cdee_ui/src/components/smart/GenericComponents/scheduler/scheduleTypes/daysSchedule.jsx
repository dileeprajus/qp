/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { Table, Row, FormGroup, FormControl, Radio } from 'react-bootstrap';
import { inject } from 'mobx-react';

@inject('generic_master_store')
class DaysSchedule extends React.Component {
  constructor(props) {
    super(props);
    // This is not creating new datasource
    this.generic_master_store = this.props.generic_master_store;
    this.scheduler_store = this.props.scheduler_store;
    this.state = {
      currentMinuteScheduleVal: '',
      currentSecondsScheduleVal: '',
      currentHourScheduleVal: '',
      currentDayScheduleVal: '',
      currentSelectedDayType: 'Every'
    };
  }

  componentWillMount() {
  }
  selectItem(event) {
    var obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
    this.scheduler_store.setvalue(event.target.name, event.target.value);
    var cronStr = this.scheduler_store.retrunCronExpression('Days',
      {
        type: this.scheduler_store.currentSelectedDayType ? this.scheduler_store.currentSelectedDayType : this.state.currentSelectedDayType,
        days: this.scheduler_store.currentDayScheduleVal ? this.scheduler_store.currentDayScheduleVal : this.state.currentDayScheduleVal,
        hours: this.scheduler_store.currentHourScheduleVal ? this.scheduler_store.currentHourScheduleVal : this.state.currentHourScheduleVal,
        minutes: this.scheduler_store.currentMinuteScheduleVal ? this.scheduler_store.currentMinuteScheduleVal : this.state.currentMinuteScheduleVal,
        seconds: this.scheduler_store.currentSecondsScheduleVal ? this.scheduler_store.currentSecondsScheduleVal : this.state.currentSecondsScheduleVal
      });
    this.scheduler_store.setvalue('newCronString', cronStr);
  }
  onChangeRadio(event) {
    this.setState({ currentSelectedDayType: event.target.value });
    this.scheduler_store.setvalue('currentSelectedDayType', event.target.value);
    var cronStr = this.scheduler_store.retrunCronExpression('Days',
      {
        type: event.target.value,
        days: this.scheduler_store.currentDayScheduleVal ? this.scheduler_store.currentDayScheduleVal : this.state.currentDayScheduleVal,
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
    var daysScheduleList = this.returnList(1, 30, 'currentDayScheduleVal');
    var hoursScheduleList = this.returnList(1, 23, 'currentHourScheduleVal');
    var minutesScheduleList = this.returnList(0, 59, 'currentMinuteScheduleVal');
    var secondsScheduleList = this.returnList(0, 59, 'currentSecondsScheduleVal');
    var tableBody = [];
    tableBody.push(
      <tr key={'daysScheduleTableRowEvery'}>
        <td>
          <FormGroup>
            <Radio name="daysSchedule" value="Every" inline onChange={this.onChangeRadio.bind(this)} defaultChecked={(this.state.currentSelectedDayType === 'Every')? true : false}>Every</Radio>
          </FormGroup>
        </td>
        <td>
          <FormGroup controlId="formControlsSelect">
            <FormControl
                componentClass="select" placeholder="Select Days Schedule" name="currentDayScheduleVal"
                onChange={this.selectItem.bind(this)} value={this.scheduler_store.currentDayScheduleVal ? this.scheduler_store.currentDayScheduleVal : this.state.currentDayScheduleVal}
            >
              {daysScheduleList}
            </FormControl>
          </FormGroup>
        </td>
        <td>day(s)</td>
      </tr>
    );
    tableBody.push(
      <tr key={'daysScheduleTableRowEveryWeekDay'}>
        <td colSpan={3}>
          <FormGroup>
            <Radio name="daysSchedule" value="EveryWeekDay" inline onChange={this.onChangeRadio.bind(this)} checked={(this.state.currentSelectedDayType === 'EveryWeekDay')? true : false}>Every WeekDay</Radio>
          </FormGroup>
        </td>
      </tr>
    );
    tableBody.push(
      <tr key={'daysScheduleTableRowEveryWeekendDay'}>
        <td colSpan={3}>
          <FormGroup>
            <Radio name="daysSchedule" value="EveryWeekendDay" inline onChange={this.onChangeRadio.bind(this)} checked={(this.state.currentSelectedDayType === 'EveryWeekendDay')? true : false}>Every Weekend Day</Radio>
          </FormGroup>
        </td>
      </tr>
    );
    tableBody.push(
      <tr key={'hourMinuteSecondsScheduleRowInDays'}>
        <td colSpan={3}>
          <Table bordered condensed>
            <tbody>
              <tr>
                <td>at</td>
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
                <td>hour</td>
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
                <td>minute</td>
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
                <td>second</td>
              </tr>
            </tbody>
          </Table>
        </td>
      </tr>
    );
    return (
      <div key="daysBasicinfotable">
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
DaysSchedule.propTypes = {
  store: React.PropTypes.object
};

export default DaysSchedule;
