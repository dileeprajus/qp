/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable, BACKEND */
import React from 'react';
import { Col } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import Iframe from 'react-iframe';

import Navigator from './smart/GenericComponents/navigator';

@inject('breadcrumb_store', 'generic_master_store')
@observer
class LogsMonitoring extends React.Component {
  constructor(props) {
    super(props);
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.generic_master_store = this.props.generic_master_store;
    this.generic_master_store.setvalue('name', 'GenericIEMasterConfig');
  }
  componentWillMount() {
    this.breadcrumb_store.Bread_crumb_obj = { name: 'LogsMonitoring', path: '/LogsMonitoring' };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.breadcrumb_store.setLoading();
  }
 
  render() {
    return (
      <div>
        <div className="header-fixed">
          <Col xs={12} className="text-align">
            <Navigator history={this.props.history} action={'LogsMonitoring'} type={'/LogsMonitoring'} source={'LogsMonitoring'} />
            <h3 className="title-fixed">Thingworx Logs Monitoring</h3>
          </Col>
        </div>

        <Col xs={12} className="top-align iFrameWrapper">
          <div className="iframeDiv">
            <Iframe url={SERVER_BASE_URL+'/Thingworx/Runtime/index.html?appKey='+ieGlobalVariable.serverAppKey+'&x-thingworx-session=true#mashup=TRCMonitoringMashup'}
            id="trcMashupId"
            display="initial"/>
          </div>

          
        </Col>
        <Col xs={12} className="iFrameWrapper" hidden>
        <div className="iframeDiv">
            <Iframe url={SERVER_BASE_URL+"/Thingworx/Runtime/index.html#mashup=testMashParms&number=10000&boolVal=false&jsonObj={'y':'yooova','x':'yooooo x value'}"}
            id="trcMashupIdmasparams"
            display="initial"/>
          </div></Col>
      </div>
    );
  }
}

LogsMonitoring.propTypes = {
    store: React.PropTypes.object
};

export default LogsMonitoring;
