/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Col, Thumbnail, Checkbox, Panel, OverlayTrigger, Tooltip } from 'react-bootstrap';
import SchedulerConfigNew from './new';
import ScheduleCron from '../GenericComponents/scheduler/scheduleCron';
import {NotificationContainer} from 'react-notifications';

@inject('generic_master_store')
@observer
class AllSchedulers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      disable_modal_tabs: true,
      show_new_thing_form: true,
      showSchedulerDetails: false,
      userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
    };
  }

  componentWillMount() {
    this.props.scheduler_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName?this.props.generic_master_store.currentGroupName:this.props.match.params.groupName);
    this.props.scheduler_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
    this.props.scheduler_store.getSchedulerConfig(this.props.thing_store.name);
    this.props.scheduler_store.setvalue('async_callback', this.asyncCallBack.bind(this));
  }

  asyncCallBack(schedulerThis) {
    if (Object.keys(this.props.scheduler_store.scheduler).length > 0) {
      this.setState({ showSchedulerDetails: true, show_new_thing_form: false });
    } else { // get all available confignames from server to check duplicity while creating new config
      this.props.scheduler_store.getTotalConfigs;
    }
   schedulerThis.setvalue('async_callback', null);
  }
  handleSubmit() {
  }
  addButtonClick() {
    this.setState({ show: true, show_new_thing_form: true });
  }

  enable_modal_tabs() {
    this.setState({ disable_modal_tabs: false, show: false, show_new_thing_form: false, showSchedulerDetails: true });
  }
  showNewForm() {
    this.setState({ disable_modal_tabs: true, show_new_thing_form: true, showSchedulerDetails: false });
  }
  enableScheduler(event) {
    this.props.scheduler_store.setvalue('enableScheduler', event.target.checked);
  }
  deleteConfig(configName) {
    this.props.scheduler_store.showModal = true;
    this.props.scheduler_store.serviceName = 'DeleteSchedulerConfig';
    this.props.scheduler_store.modalBtnTxt = 'DeleteConfig';
    this.props.scheduler_store.modalTitle = 'Deletion of ' + configName + ' Config';
    this.props.scheduler_store.modalBody = 'Are you sure you want to delete:'+ configName + 'Config';
  }
  deleteSchedulerConfig() {
    this.props.scheduler_store.DeleteConfig(this.props.scheduler_store.scheduler.Name, this.props.thing_store.name, this.showNewForm.bind(this));
  }
  render() {
    var addStyle = {
      color: 'orange',
      background: '#f7f7f7'
    };
    const deleteToolTip = (<Tooltip id="SchedulerCofigDelete"> Delete Scheduler Config </Tooltip>);
    let close = () => this.setState({ show: false });
    var warningMsg = (<div style={{ textAlign: 'center' }}>
      <span style={{ color: 'lightgray' }}>
        No Scheduler is created for current config.
      </span>
    </div>);
    return (
      <div>
        <div hidden={this.state.showSchedulerDetails || this.state.show}>
          <Col key={'SchedulerNew'} xs={12} sm={6} md={6} lg={4}>
            <Thumbnail className="thumbnail-height thumbnail-select">
              <Button disabled = {this.state.userCheck === false} className="newthing-button" onClick={this.addButtonClick.bind(this)}>
                <div style={addStyle} >
                  <div className="newthing-font-icon"><i className="fa fa-plus-circle " aria-hidden="true"></i></div>
                  <h1 className="newthing-font">Create New Config</h1>
                </div>
              </Button>
            </Thumbnail>
          </Col>
          <Col key={'NoSchedulerMsg'} xs={12} sm={6} md={6} lg={4}>
            {warningMsg}
          </Col>
        </div>
        <NotificationContainer/>
        <div hidden={!this.state.show} className="schedulerNewDiv">
          <h4>Create New Scheduler Config</h4>
          <SchedulerConfigNew
            scheduler_store={this.props.scheduler_store}
            generic_master_store={this.props.generic_master_store}
            modalClose={close} enable_modal_tabs={this.enable_modal_tabs.bind(this)}
            thing_store={this.props.thing_store}
          />
        </div>
        <div hidden={!this.state.showSchedulerDetails}>
          <Panel>
            <strong>Scheduler Name: </strong><span className="test">{this.props.scheduler_store.scheduler.Name}</span>
            <OverlayTrigger placement="top" overlay={deleteToolTip} trigger={['hover', 'focus']}>
              <Button disabled = {this.state.userCheck === false} className="pull-right" onClick={this.deleteConfig.bind(this, this.props.scheduler_store.scheduler.Name)} >
                <i className="fa fa-trash-o" style={addStyle} aria-hidden="true"></i>
              </Button>
            </OverlayTrigger>
            <div key={'enableScheduleDiv'}>
              <Checkbox style={{ paddingLeft: '25px' }} name={'enableScheduler'} key={'enableSchedulerCheckbox'} checked={this.props.scheduler_store.enableScheduler} onChange={this.enableScheduler.bind(this)}> Enable Scheduler</Checkbox>
            </div>
            <div key={'ScheduleCronDiv'}>
              <ScheduleCron scheduler_store={this.props.scheduler_store} thing_store={this.props.thing_store} deleteSchedulerConfig={this.deleteSchedulerConfig.bind(this)}/>
            </div>
          </Panel>
        </div>
      </div>
    );
  }
}

AllSchedulers.propTypes = {
  store: React.PropTypes.object
};

export default AllSchedulers;
