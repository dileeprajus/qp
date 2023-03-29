/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { Table, Row, FormGroup, FormControl, Checkbox } from 'react-bootstrap';
import { inject } from 'mobx-react';

@inject('generic_master_store')
class WeeksSchedulePurge extends React.Component {
  constructor(props) {
    super(props);
    // This is not creating new datasource
    this.generic_master_store = this.props.generic_master_store;
    this.scheduler_purge_store = this.props.scheduler_purge_store;
    this.state = {
      currentMinuteScheduleVal: 1,
      currentSecondsScheduleVal: 0,
      currentHourScheduleVal: '',
      currentDayScheduleVal: '',
      currentSelectedWeekDayVal: '*'
    };
  }

  componentWillMount() {
  }
  selectItem(event) {
    var obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
    this.scheduler_purge_store.setvalue(event.target.name, event.target.value);
    var cronStr = this.scheduler_purge_store.retrunCronExpression('Weeks',
      {
        weeks: this.scheduler_purge_store.currentSelectedWeekDayVal ? this.scheduler_purge_store.currentSelectedWeekDayVal :  this.state.currentSelectedWeekDayVal,
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
        <option key={'name' + i} value={i}>{i}</option>
      );
    }
    return arr;
  }
  onChange(event) {
    var tempStr = this.scheduler_purge_store.currentSelectedWeekDayVal ? this.scheduler_purge_store.currentSelectedWeekDayVal : this.state.currentSelectedWeekDayVal;
    tempStr = tempStr === '*' ? '' : tempStr;
    if (event.target.checked) {
      tempStr = this.returnCheckedStr(event.target.name, tempStr);
    } else if (event.target.checked === false) {
      tempStr = this.returnUnChekedStr(event.target.name, tempStr);
      tempStr = tempStr === '' ? '*' : tempStr;
    }
    this.setState({ currentSelectedWeekDayVal: tempStr });
    this.scheduler_purge_store.setvalue('currentSelectedWeekDayVal', tempStr);
    var cronStr = this.scheduler_purge_store.retrunCronExpression('Weeks',
      {
        weeks: this.scheduler_purge_store.currentSelectedWeekDayVal ? this.scheduler_purge_store.currentSelectedWeekDayVal :  this.state.currentSelectedWeekDayVal,
        hours: this.scheduler_purge_store.currentHourScheduleVal ? this.scheduler_purge_store.currentHourScheduleVal : this.state.currentHourScheduleVal,
        minutes: this.scheduler_purge_store.currentMinuteScheduleVal ? this.scheduler_purge_store.currentMinuteScheduleVal : this.state.currentMinuteScheduleVal,
        seconds: this.scheduler_purge_store.currentSecondsScheduleVal ? this.scheduler_purge_store.currentSecondsScheduleVal : this.state.currentSecondsScheduleVal
      });
    this.scheduler_purge_store.setvalue('newCronString', cronStr);
  }
  returnCheckedStr(newStr, oldStr) {
    var str = '';
    var arr = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    var oldArr = oldStr === '' ? [] : oldStr.split(',');
    if (oldStr === '') { //if previous str is empty then return newStr as result
      str = newStr;
    }
    for (var i = 0; i < oldArr.length; i++) {
        if (arr.indexOf(newStr) < arr.indexOf(oldArr[i])) {
          str = (str === '') ? (newStr + ',' + oldStr) : (str + ',' + newStr + ',' + oldArr[i]);
          break;
        } else if (arr.indexOf(newStr) > arr.indexOf(oldArr[i])) {
          str = (str === '') ? oldArr[i] : (str + ',' + oldArr[i]);
          if (i === oldArr.length - 1) { // finally add the newString at the end of the old string
            str = str + ',' + newStr;
          }
        }
    }
    return str;
  }
  returnUnChekedStr(newStr, oldStr) {
    var str = '';
    var oldArr = oldStr === '' ? [] : oldStr.split(',');
    for (var i = 0; i < oldArr.length; i++) {
      if (newStr === oldArr[i]) {
        oldArr.splice(i, 1);
        break;
      }
    }
    for (var i = 0; i < oldArr.length; i++) {
      str = (str === '') ? oldArr[i] : (str + ',' + oldArr[i]);
    }
    return str;
  }
  render() {
    var hoursScheduleList = this.returnList(0, 23, 'currentHourScheduleVal');
    var minutesScheduleList = this.returnList(0, 59, 'currentMinuteScheduleVal');
    var secondsScheduleList = this.returnList(0, 59, 'currentSecondsScheduleVal');
    var tableBody = [];
    var weekDays=['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (var i = 0; i < weekDays.length; i++) {
      tableBody.push(
        <tr key={'row' + weekDays[i] + i}>
          <td key={'data' + weekDays[i] + i}>
            <Checkbox style={{ paddingLeft: '25px' }} name={weekDays[i].toUpperCase().substring(0, 3)} key={'checkbox' + weekDays[i]} onChange={this.onChange.bind(this)}>{weekDays[i]}</Checkbox>
          </td>
        </tr>
      );
    }
    var hmsTable = (
      <Table bordered condensed key={'hmsTableComponent'}>
        <tbody key={'hmsTableBody'}>
          <tr key={'hmsTableRow'}>
            <td key={'weekDaysAt'}>at</td>
            <td key={'weekDaysAtHoursVal'}>
              <FormGroup controlId="formControlsSelect">
                <FormControl
                    componentClass="select" placeholder="Select Hours Schedule" name="currentHourScheduleVal"
                    onChange={this.selectItem.bind(this)} value={this.scheduler_purge_store.currentHourScheduleVal ? this.scheduler_purge_store.currentHourScheduleVal : this.state.currentHourScheduleVal}
                >
                  {hoursScheduleList}
                </FormControl>
              </FormGroup>
            </td>
            <td key={'weekDaysHour'}>hour</td>
            <td key={'weekDaysMinuteVal'}>
              <FormGroup controlId="formControlsSelect">
                <FormControl
                    componentClass="select" placeholder="Select Minutes Schedule" name="currentMinuteScheduleVal"
                    onChange={this.selectItem.bind(this)} value={this.scheduler_purge_store.currentMinuteScheduleVal ? this.scheduler_purge_store.currentMinuteScheduleVal : this.state.currentMinuteScheduleVal}
                >
                  {minutesScheduleList}
                </FormControl>
              </FormGroup>
            </td>
            <td key={'weekDaysMinute'}>minute</td>
            <td key={'weekDaysSecondsVal'}>
              <FormGroup controlId="formControlsSelect">
                <FormControl
                    componentClass="select" placeholder="Select Seconds Schedule" name="currentSecondsScheduleVal"
                    onChange={this.selectItem.bind(this)} value={this.scheduler_purge_store.currentSecondsScheduleVal ? this.scheduler_purge_store.currentSecondsScheduleVal : this.state.currentSecondsScheduleVal}
                >
                  {secondsScheduleList}
                </FormControl>
              </FormGroup>
            </td>
            <td key={'weekDaysSeconds'}>second</td>
          </tr>
        </tbody>
      </Table>
    );
    return (
      <div key="weekDaysBasicinfotable">
        <Row>
          <Table striped bordered condensed hover>
            <tbody>
              {tableBody}
            </tbody>
          </Table>
        </Row>
        <Row>
          {hmsTable}
        </Row>
      </div>
    );
  }
}
WeeksSchedulePurge.propTypes = {
  store: React.PropTypes.object
};

export default WeeksSchedulePurge;
