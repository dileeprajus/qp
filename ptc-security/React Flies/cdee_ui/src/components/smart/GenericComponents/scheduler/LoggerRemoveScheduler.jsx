/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Thumbnail, FormGroup, FormControl, ControlLabel, Row, Checkbox, Button, Tooltip, OverlayTrigger ,MenuItem,Panel,ButtonToolbar,DropdownButton,Modal} from 'react-bootstrap';

import DaysSchedule from './scheduleTypes/daysSchedulePurge';
import WeeksSchedule from './scheduleTypes/weeksSchedulePurge';
import MonthsSchedule from './scheduleTypes/monthsSchedulePurge';

@inject('generic_master_store','routing', 'breadcrumb_store')
@observer
class LoggerRemoveScheduler extends React.Component {
    constructor(props) {
        super(props);
        this.generic_master_store = this.props.generic_master_store;
        this.scheduler_purge_store = this.props.scheduler_purge_store;
        this.state = {
            scheduarEnabled: false,
            userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
        }
    }
    enableScheduler(event) {
      this.props.scheduler_purge_store.setvalue('enableScheduler', event.target.checked);
    }
    componentWillMount() {
      this.props.scheduler_purge_store.getPurgeDetailsConfig();
    }
    selectItem(name, value) {
      this.scheduler_purge_store.setvalue(name, value);
    }
    cancle() {
      this.scheduler_purge_store.showModal = false;
    }
    saveCron() {
      this.scheduler_purge_store.showModal = true;
      this.scheduler_purge_store.serviceName = 'SaveScheduleCron';
      this.scheduler_purge_store.modalBtnTxt = 'Save';
      this.scheduler_purge_store.modalTitle = 'Save Scheduler Cron Configuration';
      this.scheduler_purge_store.modalBody = 'Are you sure you want to save Cron configuration';
    }
    onSubmitBtn() {
      if(this.scheduler_purge_store.serviceName === 'SaveScheduleCron') {
        //this.scheduler_purge_store.saveSchedulerCron(this.scheduler_purge_store.scheduler.Name);
        this.scheduler_purge_store.saveSchedulerCron('ThingSchedulerToPurgeEntries');
      }else{
        this.props.deleteSchedulerConfig();
      }
      this.scheduler_purge_store.showModal = false;
    }

    render() {
        var dateOptionsArrList = this.scheduler_purge_store.dateDurationTypes.map(m => {
          return (
            <MenuItem key={m} eventKey={m} active={(this.scheduler_purge_store.currentDateDurationType === m) ? true : false }>{m}</MenuItem>
          );
        });
        var scheduleTypeList = this.scheduler_purge_store.purgeScheduleTypes.map(m => {
            return (
              <MenuItem key={m} eventKey={m} active={(this.scheduler_purge_store.currentScheduleType === m) ? true : false }>{m}</MenuItem>
            );
          });
          var scheduleComponent = '';
      if (this.scheduler_purge_store.currentScheduleType === 'Days') {
      scheduleComponent = (
        <DaysSchedule scheduler_purge_store={this.scheduler_purge_store} />
      );
    } else if (this.scheduler_purge_store.currentScheduleType === 'Weeks') {
      scheduleComponent = (
        <WeeksSchedule scheduler_purge_store={this.scheduler_purge_store} />
      );
    } else if (this.scheduler_purge_store.currentScheduleType === 'Months') {
      scheduleComponent = (
        <MonthsSchedule scheduler_purge_store={this.scheduler_purge_store} />
      );
    }
       
        return (
            <Panel>
               <div>
                <Row>
                    <Col xsOffset={2} sm={5} md={5} lg={5} xs={5}>
                    <h5 className="navtab">ThingSchedulerToPurgeEntries <small>..</small></h5>
                    <h7 className="navtab">The Scheduler is used to purge the stream entries based on given cron with date range.</h7>
                        
                    </Col>
                   
                </Row>
            </div>
            <div>
            <Row key={'dropdownTypeRow'}>
          <Col componentClass={ControlLabel} sm={3}>
            Purge Date Duration :
          </Col>
          <Col sm={9}>
            <ButtonToolbar>
              <DropdownButton bsStyle={'Default'.toLowerCase()} title={this.scheduler_purge_store.currentDateDurationType} name="currentDateDurationType" value={this.scheduler_purge_store.currentDateDurationType} onSelect={this.selectItem.bind(this,'currentDateDurationType')} id='dropdownDateDurationType'>
                {dateOptionsArrList}
              </DropdownButton>
            </ButtonToolbar>
          </Col>
        </Row>
        </div>
            <div key={'enableScheduleDiv'}>
              <Checkbox style={{ paddingLeft: '25px',marginLeft: '80%', marginTop: '15px'}} name={'enableScheduler'} key={'enableSchedulerCheckbox'} checked={this.props.scheduler_purge_store.enableScheduler} onChange={this.enableScheduler.bind(this)}> Enable Scheduler</Checkbox>
            </div>

            <Row key={'scheduleTypeRow'}>
          <Col componentClass={ControlLabel} sm={3}>
            Schedule Type :
          </Col>
          <Col sm={9}>
            <ButtonToolbar>
              <DropdownButton bsStyle={'Default'.toLowerCase()} title={this.scheduler_purge_store.currentScheduleType} name="currentScheduleType" value={this.scheduler_purge_store.currentScheduleType} onSelect={this.selectItem.bind(this,'currentScheduleType')} id='dropdownScheduleType'>
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
            <FormControl type="text" readOnly value={this.scheduler_purge_store.newCronString} style={{ backgroundColor: 'white' }} />
          </Col>
        </Row>
        <Row key={'cronSaveOrCancelBtnRow'}>
          <Panel key={'CronBtnPanel'}>
            <Col sm={6} className="pull-right">
              <Button bsStyle="default" className="pull-right" onClick={this.cancle.bind(this)}>Cancel</Button>
              <Button disabled = {this.state.userCheck === false } bsStyle="info" className="pull-right" onClick={this.saveCron.bind(this)}>Done</Button>
            </Col>
          </Panel>
        </Row>
        <div className="modal-container">
          <Modal show={this.scheduler_purge_store.showModal} onHide={this.cancle.bind(this)} aria-labelledby="contained-modal-title">
            <Modal.Header closeButton>
              <h4>{this.scheduler_purge_store.modalTitle}</h4>
            </Modal.Header>
            <Modal.Body className="modal-body">
              {this.scheduler_purge_store.modalBody}
            </Modal.Body>
            <Modal.Footer className="modal-footer">
              <Button bsStyle="default" onClick={this.cancle.bind(this)} className="btn btn-default">Cancel</Button>
              <Button bsStyle="primary" className="btn btn-primary" onClick={this.onSubmitBtn.bind(this)}>{this.scheduler_purge_store.modalBtnTxt ? this.scheduler_purge_store.modalBtnTxt : 'Submit'}</Button>
            </Modal.Footer>
          </Modal>
        </div>
           </Panel>
        );
    }
}

LoggerRemoveScheduler.propTypes = {
    store: React.PropTypes.object
};

export default LoggerRemoveScheduler;
