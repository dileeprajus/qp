/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Row, FormGroup, FormControl, InputGroup, Button, Checkbox } from 'react-bootstrap';
import ScheduleCron from '../GenericComponents/scheduler/scheduleCron';
import SchedulerConfigs from '../../SchedulerConfigs';

@inject('scheduler_store', 'generic_master_store')
@observer
class Schedulers extends React.Component {
  constructor(props) {
    super(props);
    this.thing_store = this.props.thing_store;
    this.trigger_type = this.props.type;
    this.scheduler_store = this.props.scheduler_store;
    this.state = {
      selectedSchedule: 'Select Schedule'
    };
  }
  componentWillMount() {
    this.scheduler_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.scheduler_store.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    this.scheduler_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
    this.scheduler_store.getAllScheduleConfigs;
    this.scheduler_store.getScheduleConfig(this.thing_store.name);
  }
  onChange(event) {
    this.setState({ selectedSchedule: event.target.value });
    this.scheduler_store.setvalue('name', event.target.value);
    this.scheduler_store.setvalue('scheduleConfig', event.target.value);
  }
  enableSchedular() {
  }
  render() {
    var scheduleOptions = [];
    for (var i = 0; i < this.scheduler_store.ScheduleConfigNames.length; i++) {
      var config = this.scheduler_store.ScheduleConfigNames[i];
      scheduleOptions.push(
        <option
          key={this.trigger_type + ' ' + config} name={this.trigger_type + ' ' + config} value={config}
        >{config}</option>
      );
    }
    return (
      <div key="schedulerDiv">
        <Row hidden={BACKEND !== 'LoopBack'}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormGroup>
              <InputGroup>
                <FormControl
                  key={this.trigger_type + 'select'}
                  componentClass="select" placeholder="select" title="Select Schedule"
                  name="schedule" value={this.scheduler_store.scheduleConfig}
                  onChange={this.onChange.bind(this)}
                >
                  {scheduleOptions}
                </FormControl>
                <InputGroup.Button>
                  <Button
                    key={this.trigger_type + 'btn'} bsStyle="info"
                    onClick={
                      () => this.scheduler_store.addConfigToScheduleArr(this.thing_store.name)}
                  >
                    Save Schedule : <i className="fa fa-clock-o" /></Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
            <div key={'enableScheduleDiv'}>
              <Checkbox style={{ paddingLeft: '25px' }} name={'enableSchedular'} key={'enableSchedularCheckbox'} onChange={this.enableSchedular.bind(this)}>Enable Scheduler</Checkbox>
            </div>
            <div key={'ScheduleCronDiv'} hidden>
              <ScheduleCron scheduler_store={this.scheduler_store} thing_store={this.thing_store} />
            </div>
          </Col>
        </Row>
        <Row key="thingworxSchedularRow" hidden={BACKEND === 'LoopBack'}>
          <Col xs={12} sm={12} md={12} lg={12} key="thingworxSchedularCol">
            <SchedulerConfigs scheduler_store={this.scheduler_store} thing_store={this.thing_store}/>
          </Col>
        </Row>
      </div>
    );
  }
}

Schedulers.propTypes = {
  store: React.PropTypes.object
};

export default Schedulers;
