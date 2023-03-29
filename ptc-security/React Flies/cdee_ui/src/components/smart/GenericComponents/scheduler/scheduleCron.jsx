/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { ControlLabel, FormControl, MenuItem, Panel, Row, Col, Button, ButtonToolbar, DropdownButton, Modal } from 'react-bootstrap';
import ManualSchedule from './scheduleTypes/manualSchedule';
import SecondsSchedule from './scheduleTypes/secondsSchedule';
import MinutesSchedule from './scheduleTypes/minutesSchedule';
import HoursSchedule from './scheduleTypes/hoursSchedule';
import DaysSchedule from './scheduleTypes/daysSchedule';
import WeeksSchedule from './scheduleTypes/weeksSchedule';
import MonthsSchedule from './scheduleTypes/monthsSchedule';

@inject('routing', 'breadcrumb_store' , 'generic_master_store')
@observer
class ScheduleCron extends React.Component {
  constructor(props) {
    super(props);
    this.scheduler_store = this.props.scheduler_store;
    this.state = {
    userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
    };
  }

  componentWillMount() {
  }
  selectItem(name, value) {
    this.scheduler_store.setvalue(name, value);
  }
  cancle() {
    this.scheduler_store.showModal = false;
  }
  saveCron() {
    this.scheduler_store.showModal = true;
    this.scheduler_store.serviceName = 'SaveScheduleCron';
    this.scheduler_store.modalBtnTxt = 'Save';
    this.scheduler_store.modalTitle = 'Save Scheduler Cron Configuration';
    this.scheduler_store.modalBody = 'Are you sure you want to save Cron configuration';
  }
  onSubmitBtn() {
    if(this.scheduler_store.serviceName === 'SaveScheduleCron') {
      this.scheduler_store.saveSchedulerCron(this.scheduler_store.scheduler.Name);
    }else{
      this.props.deleteSchedulerConfig();
    }
    this.scheduler_store.showModal = false;
  }
  render() {
    var scheduleTypeList = this.scheduler_store.scheduleTypes.map(m => {
      return (
        <MenuItem key={m} eventKey={m} active={(this.scheduler_store.currentScheduleType === m) ? true : false }>{m}</MenuItem>
      );
    });
    var scheduleComponent = '';
    if (this.scheduler_store.currentScheduleType === 'Manual') {
      scheduleComponent = (
        <ManualSchedule scheduler_store={this.scheduler_store} />
      );
    } else if (this.scheduler_store.currentScheduleType === 'Seconds') {
      scheduleComponent = (
        <SecondsSchedule scheduler_store={this.scheduler_store} />
      );
    } else if (this.scheduler_store.currentScheduleType === 'Minutes') {
      scheduleComponent = (
        <MinutesSchedule scheduler_store={this.scheduler_store} />
      );
    } else if (this.scheduler_store.currentScheduleType === 'Hours') {
      scheduleComponent = (
        <HoursSchedule scheduler_store={this.scheduler_store} />
      );
    } else if (this.scheduler_store.currentScheduleType === 'Days') {
      scheduleComponent = (
        <DaysSchedule scheduler_store={this.scheduler_store} />
      );
    } else if (this.scheduler_store.currentScheduleType === 'Weeks') {
      scheduleComponent = (
        <WeeksSchedule scheduler_store={this.scheduler_store} />
      );
    } else if (this.scheduler_store.currentScheduleType === 'Months') {
      scheduleComponent = (
        <MonthsSchedule scheduler_store={this.scheduler_store} />
      );
    }
    return (
      <Panel>
        <Row key={'scheduleTypeRow'}>
          <Col componentClass={ControlLabel} sm={3}>
            Schedule Type :
          </Col>
          <Col sm={9}>
            <ButtonToolbar>
              <DropdownButton bsStyle={'Default'.toLowerCase()} title={this.scheduler_store.currentScheduleType} name="currentScheduleType" value={this.scheduler_store.currentScheduleType} onSelect={this.selectItem.bind(this,'currentScheduleType')} id='dropdownScheduleType'>
                {scheduleTypeList}
              </DropdownButton>
            </ButtonToolbar>
          </Col>
        </Row>
        <Row key={'scheduleValuesRow'}>
          <Panel>
            <Col sm={12}>
              {scheduleComponent}
            </Col>
          </Panel>
        </Row>
        <Row key={'cronStringValueRow'}>
          <Col sm={6} style={{ paddingRight: '0px' }}>
            <FormControl type="text" readOnly value={'CRON String'} style={{ backgroundColor: 'white' }} />
          </Col>
          <Col sm={6} style={{ paddingLeft: '0px' }}>
            <FormControl type="text" readOnly value={this.scheduler_store.newCronString} style={{ backgroundColor: 'white' }} />
          </Col>
        </Row>
        <Row key={'cronSaveOrCancelBtnRow'}>
          <Panel key={'CronBtnPanel'}>
            <Col sm={6} className="pull-right">
              <Button bsStyle="default" className="pull-right" onClick={this.cancle.bind(this)}>Cancel</Button>
              <Button disabled = {this.state.userCheck === false} bsStyle="info" className="pull-right" onClick={this.saveCron.bind(this)}>Done</Button>
            </Col>
          </Panel>
        </Row>
        <div className="modal-container">
          <Modal show={this.scheduler_store.showModal} onHide={this.cancle.bind(this)} aria-labelledby="contained-modal-title">
            <Modal.Header closeButton>
              <h4>{this.scheduler_store.modalTitle}</h4>
            </Modal.Header>
            <Modal.Body className="modal-body">
              {this.scheduler_store.modalBody}
            </Modal.Body>
            <Modal.Footer className="modal-footer">
              <Button bsStyle="default" onClick={this.cancle.bind(this)} className="btn btn-default">Cancel</Button>
              <Button bsStyle="primary" className="btn btn-primary" onClick={this.onSubmitBtn.bind(this)}>{this.scheduler_store.modalBtnTxt ? this.scheduler_store.modalBtnTxt : 'Submit'}</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </Panel>

    );
  }
}

ScheduleCron.propTypes = {
  store: React.PropTypes.object
};

export default ScheduleCron;
