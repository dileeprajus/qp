/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col } from 'react-bootstrap';
import AllSchedulers from './smart/Schedulers/all';
import AlertInstance from './static/layout/alertinstance';

@inject('scheduler_store', 'breadcrumb_store', 'generic_master_store', 'modal_store')
@observer
class SchedulerConfigs extends React.Component {
  constructor(props) {
    super(props);
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.generic_master_store = this.props.generic_master_store;
    this.scheduler_store = this.props.scheduler_store;
  }

  componentWillMount() {
    this.scheduler_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.scheduler_store.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    this.scheduler_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID ? this.props.generic_master_store.tenantID : this.scheduler_store.currentTenantID);
  }
  render() {
    return (
      <div>
        <Col xs={6} xsOffset={3}>
          <AlertInstance modal_store={this.props.modal_store} />
        </Col>
        <Row style={{ backgroundColor: '#fbfbfb', margin: '0% 1%' }}>
          <Col xs={12} className="text-align">
            <h5 className="navtab">Scheduler Configuration <small>..</small></h5>
          </Col>
          <div className="top-align">
            <AllSchedulers
              history={this.props.history} match={this.props.match}
              scheduler_store={this.scheduler_store}
              generic_master_store={this.props.generic_master_store}
              thing_store={this.props.thing_store}
            />
          </div>
        </Row>
      </div>
    );
  }
}

SchedulerConfigs.propTypes = {
  store: React.PropTypes.object
};

export default SchedulerConfigs;
