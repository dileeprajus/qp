/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable, BACKEND */
import React from 'react';
import {inject, observer} from 'mobx-react';
import {Thumbnail, Row, Col, Tab, Nav, NavItem, Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import FIlterScripts from './smart/Settings/CallbackScripts/filter_scripts';
import VersionDetails from './smart/Settings/VersionDetails/versionDetails';
import NewTenantID from './smart/Settings/TenantID/newTenantID';
import Navigator from './smart/GenericComponents/navigator';
import { NotificationManager} from 'react-notifications';
import EmailConfiguration from './smart/Settings/EmailConfiguration/email_configuration';
import TRCQueueConfiguration from './smart/Settings/VersionDetails/TRCQueueConfiguration';
import LoggerRemoveScheduler from './smart/GenericComponents/scheduler/LoggerRemoveScheduler';
import SchedulerPurgeStore from '../stores/SchedulerPurgeStore';
@inject('routing', 'breadcrumb_store', 'generic_master_store', 'validation_store', 'mapping_store', 'type_manager_store')
@observer
class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.name = 'TypeManagerConfig';
    this.generic_master_store = this.props.generic_master_store;
    this.type_manager_store = this.props.type_manager_store;
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.scheduler_purge_store = new SchedulerPurgeStore();
    this.state = {
    };
  }

  componentWillMount() {
    var PageName = 'Settings';
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/Settings' };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.generic_master_store.setTRCQueueConfiguration('ThingSchedulerToInvokeSourceQueue', 'GetData');
    this.generic_master_store.getScriptLogsStatus();
    this.generic_master_store.getDashboardStats();
  }

  refreshAllMCCs() {
    this.props.generic_master_store.refreshAllMCCs;
    NotificationManager.success('Updated MCCs Successfully', 'Success', 1000);
  }

  render() {
    var refreshAllMCCsTooltip = (<Tooltip id="tooltip-refreshMcc-config"><strong>Refresh All MCCs</strong></Tooltip>);
    return (
      <div>
        <Col xs={12}>
          <Row>
            <div className="header-fixed" style={{ zIndex: 3 }}>
              <Col xs={12} className="text-align">
              <Col xs={11}>
                <Row>
                 <h3 className="title-fixed">Settings</h3>
                </Row>
              </Col>
                <Col xs={1}>
                  <Row>
                  <Navigator history={this.props.history} type={'/Settings'} source={'Settings'} action={'Settings'}/>
                  <div hidden={BACKEND !== 'LoopBack'}>
                   <OverlayTrigger placement="left" overlay={refreshAllMCCsTooltip}>
                     <Button bsSize="small" bsStyle="info"  onClick={this.refreshAllMCCs.bind(this)}><i className="fa fa-refresh"></i></Button>
                   </OverlayTrigger>
                  </div>
                  </Row>
                </Col>
              </Col>
            </div>
          </Row>
          <Row className="top-align">
            <Tab.Container id="left-tabs-example" defaultActiveKey="FIlterScripts">
              <Thumbnail className="">
                <Row className="clearfix">
                  <Col sm={12}>
                    <Nav bsStyle="tabs">
                      <NavItem eventKey="FIlterScripts">Template Scripts</NavItem>
                      <NavItem eventKey="Tenant IDs">Tenant</NavItem>
                      <NavItem eventKey="Email Configuration">Email Configuration & Script Log</NavItem>
                      <NavItem eventKey="Version Details" style={{ float: 'right' }}>Version Details</NavItem>
                      <NavItem eventKey="TRC Queue Configuration">Processing Configuration</NavItem>
                      <NavItem eventKey="Loggers Remove Configuration">Remove Loggers Configuration</NavItem>
                    </Nav>
                  </Col>
                  <Col sm={12}>
                    <Tab.Content animation>
                      <Tab.Pane eventKey="FIlterScripts">
                        <FIlterScripts type_manager_store={this.type_manager_store}/>
                      </Tab.Pane>
                      <Tab.Pane eventKey="Tenant IDs">
                        <NewTenantID />
                      </Tab.Pane>
                      <Tab.Pane eventKey="Version Details">
                        <VersionDetails />
                      </Tab.Pane>
                      <Tab.Pane eventKey="TRC Queue Configuration">
                        <TRCQueueConfiguration />
                      </Tab.Pane>
                      <Tab.Pane eventKey="Email Configuration">
                        <EmailConfiguration />
                      </Tab.Pane>
                      <Tab.Pane eventKey="Loggers Remove Configuration">
                        <LoggerRemoveScheduler  scheduler_purge_store={this.scheduler_purge_store} generic_master_store ={this.props.generic_master_store}/>
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Row>
              </Thumbnail>
            </Tab.Container>
          </Row>
        </Col>
      </div>
    );
  }
}

Settings.propTypes = {
  store: React.PropTypes.object
};
export default Settings;
